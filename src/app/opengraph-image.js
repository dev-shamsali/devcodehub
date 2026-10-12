import { ImageResponse } from 'next/og';
import { SITE, AUTHOR } from '@/lib/site';

export const alt = `${SITE.name} | ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#07090d',
          padding: '72px',
          position: 'relative',
        }}
      >
        {/* Brand wash, mirroring the hero */}
        <div
          style={{
            position: 'absolute',
            top: -260,
            right: -180,
            width: 720,
            height: 720,
            borderRadius: 9999,
            background: 'radial-gradient(circle, rgba(61,141,255,0.42) 0%, rgba(61,141,255,0) 68%)',
            display: 'flex',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', fontSize: 30, letterSpacing: '-0.02em' }}>
          <span style={{ color: '#f2f5fa', fontWeight: 600 }}>dev</span>
          <span style={{ color: '#3d8dff', fontWeight: 600 }}>/</span>
          <span style={{ color: '#f2f5fa', fontWeight: 600 }}>codehub</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              fontSize: 82,
              lineHeight: 1.05,
              letterSpacing: '-0.035em',
              color: '#f2f5fa',
              fontWeight: 600,
              maxWidth: 900,
            }}
          >
            Share files with your team in one link.
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 28,
              fontSize: 29,
              color: '#a7b0c0',
              maxWidth: 800,
            }}
          >
            Images, zips and documents, shared in seconds.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            fontSize: 24,
            color: '#75727d',
          }}
        >
          <span style={{ display: 'flex', width: 10, height: 10, borderRadius: 9999, background: '#3d8dff' }} />
          <span style={{ display: 'flex' }}>Built by {AUTHOR.name}</span>
        </div>
      </div>
    ),
    size
  );
}
