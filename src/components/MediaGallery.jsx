'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { upload, ImageKitAbortError } from '@imagekit/next';
import {
  UploadCloud,
  FileArchive,
  Copy,
  Check,
  Download,
  Trash2,
  X,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import {
  IMAGEKIT,
  MEDIA_FOLDER,
  ACCEPT_ATTR,
  isZip,
  formatBytes,
  rejectReason,
} from '@/lib/imagekit';

/**
 * One share, holding many files.
 *
 * Files go straight from the browser to ImageKit using a short-lived signature
 * from /api/media/auth; the bytes never pass through this server. Only the
 * resulting metadata is stored, in MongoDB behind /api/media/shares.
 *
 * MongoDB cannot push to the browser, so the file list is polled and also
 * refetched right after any local mutation.
 */
const POLL_MS = 6000;

export default function MediaGallery({ shareId, shareName, onChanged }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const [notice, setNotice] = useState('');

  const inputRef = useRef(null);
  const dragDepth = useRef(0);

  const fetchFiles = useCallback(async () => {
    const res = await fetch(`/api/media/shares/${shareId}`, { cache: 'no-store' });
    const data = await res.json();
    if (!res.ok || !data.ok) throw new Error(data.error || 'Could not load this share.');
    return data.share.files.map((f) => ({ key: f.fileId, ...f }));
  }, [shareId]);

  const load = useCallback(
    () =>
      fetchFiles()
        .then(setFiles)
        .catch((error) => setNotice(error.message))
        .finally(() => setLoading(false)),
    [fetchFiles]
  );

  useEffect(() => {
    let alive = true;

    const tick = () =>
      fetchFiles()
        .then((list) => alive && setFiles(list))
        .catch((error) => alive && setNotice(error.message))
        .finally(() => alive && setLoading(false));

    tick();
    const poll = setInterval(tick, POLL_MS);

    return () => {
      alive = false;
      clearInterval(poll);
    };
  }, [fetchFiles]);

  // Close the lightbox on Escape.
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e) => e.key === 'Escape' && setLightbox(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox]);

  const uploadOne = useCallback(
    async (file, localId) => {
      const bump = (patch) =>
        setPending((prev) =>
          prev.map((p) => (p.localId === localId ? { ...p, ...patch } : p))
        );

      try {
        const authRes = await fetch('/api/media/auth', { cache: 'no-store' });
        const auth = await authRes.json();
        if (!authRes.ok || !auth.ok) {
          throw new Error(auth.error || 'Could not authorise the upload.');
        }

        const result = await upload({
          file,
          fileName: file.name,
          publicKey: auth.publicKey || IMAGEKIT.publicKey,
          token: auth.token,
          signature: auth.signature,
          expire: auth.expire,
          folder: `${MEDIA_FOLDER}/${shareId}`,
          useUniqueFileName: true,
          onProgress: (event) => {
            if (!event.lengthComputable) return;
            bump({ progress: Math.round((event.loaded / event.total) * 100) });
          },
        });

        const record = {
          fileId: result.fileId || localId,
          name: result.name || file.name,
          url: result.url || '',
          thumbnailUrl: result.thumbnailUrl || result.url || '',
          filePath: result.filePath || '',
          size: result.size ?? file.size,
          fileType: result.fileType || file.type || '',
          width: result.width ?? null,
          height: result.height ?? null,
          uploadedAt: Date.now(),
        };

        const saveRes = await fetch(`/api/media/shares/${shareId}/files`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(record),
        });
        const saved = await saveRes.json().catch(() => ({}));
        if (!saveRes.ok || !saved.ok) {
          throw new Error(saved.error || 'Uploaded, but the file could not be saved.');
        }

        setPending((prev) => prev.filter((p) => p.localId !== localId));
        await load();
        onChanged?.();
      } catch (error) {
        if (error instanceof ImageKitAbortError) {
          setPending((prev) => prev.filter((p) => p.localId !== localId));
          return;
        }
        console.error('Upload failed:', error);
        bump({ error: error.message || 'Upload failed.' });
      }
    },
    [shareId, load, onChanged]
  );

  const addFiles = useCallback(
    (fileList) => {
      const incoming = Array.from(fileList || []);
      if (!incoming.length) return;

      const rejected = [];
      const accepted = [];
      incoming.forEach((file) => {
        const reason = rejectReason(file);
        if (reason) rejected.push(reason);
        else accepted.push(file);
      });

      setNotice(rejected.length ? rejected.join(' ') : '');

      const queued = accepted.map((file) => ({
        localId: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: file.name,
        size: file.size,
        progress: 0,
        error: null,
      }));

      setPending((prev) => [...prev, ...queued]);
      // Parallel on purpose: several small images is the common case, and
      // ImageKit handles concurrent uploads per signature fine.
      queued.forEach((item, i) => uploadOne(accepted[i], item.localId));
    },
    [uploadOne]
  );

  const onDrop = (e) => {
    e.preventDefault();
    dragDepth.current = 0;
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const copyLink = async (file) => {
    try {
      await navigator.clipboard.writeText(file.url);
      setCopiedId(file.key);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const removeFile = async (file) => {
    // Drop the row first so the UI stays responsive, then release the bytes.
    setFiles((prev) => prev.filter((f) => f.key !== file.key));
    await fetch(
      `/api/media/shares/${shareId}/files?fileId=${encodeURIComponent(file.fileId)}`,
      { method: 'DELETE' }
    ).catch(() => {});
    onChanged?.();

    try {
      const res = await fetch('/api/media/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId: file.fileId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setNotice(data.error || 'Removed from the share, but ImageKit kept the file.');
      }
    } catch {
      setNotice('Removed from the share, but ImageKit could not be reached.');
    }
    load();
  };

  return (
    <div
      className="glass relative flex h-full min-h-[26rem] flex-col overflow-hidden"
      onDragEnter={(e) => {
        e.preventDefault();
        dragDepth.current += 1;
        setDragging(true);
      }}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={(e) => {
        e.preventDefault();
        dragDepth.current -= 1;
        if (dragDepth.current <= 0) setDragging(false);
      }}
      onDrop={onDrop}
    >
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 px-4 py-3">
        <div className="min-w-0">
          <h2 className="truncate font-display text-base font-semibold text-text-hi">
            {shareName}
          </h2>
          <p className="text-[0.74rem] text-text-lo">
            {files.length} {files.length === 1 ? 'file' : 'files'}
            {pending.length > 0 && ` · ${pending.length} uploading`}
          </p>
        </div>

        <button
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-1.5 rounded-full bg-brand-solid px-4 py-2 text-[0.82rem] font-medium text-white transition-colors hover:bg-brand-solid-hover active:translate-y-px"
        >
          <UploadCloud className="h-4 w-4" strokeWidth={1.75} />
          Add files
        </button>

        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPT_ATTR}
          className="hidden"
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </header>

      {notice && (
        <div className="flex items-start gap-2 border-b border-brand/20 bg-brand/10 px-4 py-2.5">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-soft" strokeWidth={1.75} />
          <p className="flex-1 text-[0.78rem] leading-relaxed text-text-mid">{notice}</p>
          <button
            onClick={() => setNotice('')}
            className="text-text-lo transition-colors hover:text-text-hi"
            aria-label="Dismiss"
          >
            <X className="h-3.5 w-3.5" strokeWidth={1.75} />
          </button>
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="aspect-square animate-pulse rounded-[10px] border border-white/8 bg-white/[0.03]"
              />
            ))}
          </div>
        ) : files.length === 0 && pending.length === 0 ? (
          <div className="flex h-full min-h-[18rem] items-center justify-center">
            <div className="max-w-sm text-center">
              <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-brand/25 bg-brand/10">
                <UploadCloud className="h-5 w-5 text-brand-soft" strokeWidth={1.75} />
              </div>
              <h3 className="font-display text-lg tracking-tight text-text-hi">
                Drop images or a zip
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-mid">
                Drag files anywhere in this panel, or use Add files. Everyone
                with the link sees them appear.
              </p>
            </div>
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {pending.map((item) => (
              <li
                key={item.localId}
                className="relative overflow-hidden rounded-[10px] border border-white/8 bg-white/[0.03] p-3"
              >
                <div className="flex h-full min-h-[7rem] flex-col justify-between">
                  <p className="truncate text-[0.76rem] text-text-mid">{item.name}</p>
                  {item.error ? (
                    <p className="text-[0.72rem] leading-snug text-brand-soft">{item.error}</p>
                  ) : (
                    <div>
                      <div className="mb-1.5 flex items-center gap-1.5 text-[0.72rem] text-text-lo">
                        <Loader2 className="h-3 w-3 animate-spin" strokeWidth={2} />
                        {item.progress}%
                      </div>
                      <div className="h-1 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-brand transition-[width] duration-200"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </li>
            ))}

            {files.map((file) => {
              const zip = isZip(file);
              return (
                <li
                  key={file.key}
                  className="group relative overflow-hidden rounded-[10px] border border-white/8 bg-white/[0.025] transition-colors hover:border-white/16"
                >
                  {zip ? (
                    <div className="flex aspect-square flex-col items-center justify-center gap-2 p-3">
                      <FileArchive className="h-8 w-8 text-brand-soft" strokeWidth={1.5} />
                      <p className="line-clamp-2 break-all text-center text-[0.72rem] text-text-mid">
                        {file.name}
                      </p>
                    </div>
                  ) : (
                    <button
                      onClick={() => setLightbox(file)}
                      className="block aspect-square w-full"
                      aria-label={`Open ${file.name}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`${file.url}?tr=w-400,h-400,c-at_max`}
                        alt={file.name}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    </button>
                  )}

                  <div className="flex items-center justify-between gap-1 border-t border-white/8 px-2 py-1.5">
                    <span className="truncate text-[0.68rem] text-text-lo">
                      {formatBytes(file.size)}
                    </span>
                    <span className="flex shrink-0 items-center gap-0.5">
                      <button
                        onClick={() => copyLink(file)}
                        className="rounded p-1 text-text-lo transition-colors hover:bg-white/10 hover:text-text-hi"
                        aria-label={`Copy link to ${file.name}`}
                      >
                        {copiedId === file.key ? (
                          <Check className="h-3.5 w-3.5 text-emerald-400" strokeWidth={2} />
                        ) : (
                          <Copy className="h-3.5 w-3.5" strokeWidth={1.75} />
                        )}
                      </button>
                      <a
                        href={`${file.url}?ik-attachment=true`}
                        download={file.name}
                        rel="noopener noreferrer"
                        className="rounded p-1 text-text-lo transition-colors hover:bg-white/10 hover:text-text-hi"
                        aria-label={`Download ${file.name}`}
                      >
                        <Download className="h-3.5 w-3.5" strokeWidth={1.75} />
                      </a>
                      <button
                        onClick={() => removeFile(file)}
                        className="rounded p-1 text-text-lo transition-colors hover:bg-brand/15 hover:text-brand-soft"
                        aria-label={`Delete ${file.name}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                      </button>
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {dragging && (
        <div className="pointer-events-none absolute inset-2 z-40 flex items-center justify-center rounded-[12px] border-2 border-dashed border-brand/60 bg-ink-900/80 backdrop-blur-sm">
          <p className="font-display text-lg text-text-hi">Drop to upload</p>
        </div>
      )}

      {lightbox && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-ink-900/90 p-4 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.name}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute right-4 top-4 rounded-full border border-white/12 bg-white/5 p-2 text-text-hi transition-colors hover:bg-white/10"
            aria-label="Close"
          >
            <X className="h-4 w-4" strokeWidth={1.75} />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${lightbox.url}?tr=w-1600,c-at_max`}
            alt={lightbox.name}
            onClick={(e) => e.stopPropagation()}
            className="max-h-full max-w-full rounded-[10px] object-contain"
          />
        </div>
      )}
    </div>
  );
}
