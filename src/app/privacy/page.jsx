import LegalPage from '@/components/LegalPage';
import { SITE, AUTHOR } from '@/lib/site';

export const metadata = {
  title: 'Privacy Policy',
  description: `What ${SITE.name} collects, why, who it is shared with and how to have it removed.`,
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="17 October 2026">
      <section>
        <p>
          {SITE.name} is a small project run by {AUTHOR.name}. This page explains in plain
          words what data the service collects, what it is used for and what you can ask for.
        </p>
      </section>

      <section>
        <h2>What we collect</h2>
        <ul>
          <li>
            <strong>Account details:</strong> your name and email address. If you sign up with a
            password, only a bcrypt hash of it is stored, never the password itself. If you sign
            in with Google, we receive your name, email address and Google account ID.
          </li>
          <li>
            <strong>Content you add:</strong> code snippets and their names, share names and the
            files you upload (images, zip archives, PDFs and Word documents).
          </li>
          <li>
            <strong>Attribution:</strong> each snippet records the name of the person who created
            it and who edited it last, and the time of the last edit. Other signed-in users can
            see these names.
          </li>
          <li>
            <strong>Usage analytics:</strong> basic, aggregated page-view statistics through
            Google Analytics for Firebase.
          </li>
        </ul>
      </section>

      <section>
        <h2>Cookies</h2>
        <p>
          We set one essential session cookie when you log in. It keeps you signed in and expires
          when you log out, or after a year without use. We also set short-lived security cookies
          used by sign-in. We do not use advertising cookies.
        </p>
      </section>

      <section>
        <h2>Why we use it</h2>
        <ul>
          <li>To create your account and keep you signed in.</li>
          <li>To show your snippets and files to the people you share them with.</li>
          <li>To send password reset emails when you ask for one.</li>
          <li>To protect the service from abuse, such as repeated failed logins.</li>
        </ul>
        <p className="mt-3">We do not sell your data and we do not show advertising.</p>
      </section>

      <section>
        <h2>Who processes it</h2>
        <p>These providers handle data on our behalf:</p>
        <ul>
          <li>MongoDB Atlas: accounts and media share records.</li>
          <li>Google Firebase: realtime code snippets and usage analytics.</li>
          <li>ImageKit: storage and delivery of uploaded files.</li>
          <li>Google: optional sign-in with Google, and Gmail for password reset emails.</li>
        </ul>
        <p className="mt-3">
          Some of these providers process data outside India. Their own privacy policies apply to
          that processing.
        </p>
      </section>

      <section>
        <h2>How long we keep it</h2>
        <ul>
          <li>Snippets and shares that are not pinned are deleted automatically 36 hours after their last change.</li>
          <li>Pinned items stay until someone deletes them.</li>
          <li>Account details stay until you ask us to delete the account.</li>
          <li>Password reset links expire after 1 hour and work once.</li>
        </ul>
      </section>

      <section>
        <h2>Snippets are visible to other users</h2>
        <p>
          Anyone who is signed in and has a link to a snippet or share can open it. Do not put
          passwords, API keys or personal data in snippets or uploads. Treat everything you add
          as shared.
        </p>
      </section>

      <section>
        <h2>Your choices</h2>
        <p>
          You can ask to see, correct or delete your account and the data tied to it. Contact{' '}
          {AUTHOR.name} through <a href={AUTHOR.github} rel="noopener noreferrer" target="_blank">GitHub</a> or{' '}
          <a href={AUTHOR.linkedin} rel="noopener noreferrer" target="_blank">LinkedIn</a> and
          include the email address of the account.
        </p>
      </section>

      <section>
        <h2>Security</h2>
        <p>
          Passwords are hashed, sessions use signed httpOnly cookies and traffic is encrypted in
          transit. No online service is perfectly secure, so keep sensitive material out of it.
        </p>
      </section>

      <section>
        <h2>Children</h2>
        <p>The service is not meant for children under 13, and we do not knowingly collect their data.</p>
      </section>

      <section>
        <h2>Changes</h2>
        <p>If this policy changes, the date above changes with it. Continued use means you accept the update.</p>
      </section>
    </LegalPage>
  );
}
