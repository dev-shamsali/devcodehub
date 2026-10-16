import LegalPage from '@/components/LegalPage';
import { SITE, AUTHOR } from '@/lib/site';

export const metadata = {
  title: 'Terms of Use',
  description: `The rules for using ${SITE.name}, including what is not allowed.`,
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Use" updated="16 October 2026">
      <section>
        <p>
          By creating an account or using {SITE.name} you agree to these terms. If you do not
          agree, please do not use the service.
        </p>
      </section>

      <section>
        <h2>Your account</h2>
        <ul>
          <li>Give accurate details and keep your login private. You are responsible for what happens under your account.</li>
          <li>Your name is shown to other users as the creator or last editor of snippets.</li>
          <li>You stay signed in for 45 days after you log in, or until you log out.</li>
        </ul>
      </section>

      <section>
        <h2>Acceptable use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Post abusive, hateful, threatening or sexually explicit language, including in snippet names, share names and your account name.</li>
          <li>Upload malware, or anything illegal or that infringes someone else&rsquo;s rights.</li>
          <li>Store passwords, secret keys or other people&rsquo;s personal data in snippets or files.</li>
          <li>Try to break, overload or gain unauthorised access to the service or other users&rsquo; data.</li>
          <li>Use the service to send spam or to impersonate another person.</li>
        </ul>
        <p className="mt-3">
          Names containing abusive words are blocked automatically. We may remove content or
          suspend accounts that break these rules, without notice.
        </p>
      </section>

      <section>
        <h2>Your content</h2>
        <p>
          You keep ownership of what you add. You give us permission to store it and show it to
          the people you share it with so the service can work. Unpinned snippets and shares are
          deleted automatically 36 hours after their last change, so keep your own copy of
          anything important.
        </p>
      </section>

      <section>
        <h2>Limits</h2>
        <p>Uploads are limited to 25 MB per file and to images, zip archives, PDFs and Word documents.</p>
      </section>

      <section>
        <h2>No warranty</h2>
        <p>
          {SITE.name} is provided free and as is. It may change, be unavailable or lose data. To
          the extent the law allows, we are not liable for losses that come from using it.
        </p>
      </section>

      <section>
        <h2>Ending your use</h2>
        <p>
          You can stop using the service at any time and ask for your account to be deleted, as
          described in the <a href="/privacy">Privacy Policy</a>.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          Questions about these terms: reach {AUTHOR.name} through{' '}
          <a href={AUTHOR.github} rel="noopener noreferrer" target="_blank">GitHub</a>.
        </p>
      </section>
    </LegalPage>
  );
}
