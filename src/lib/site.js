/**
 * Single source of truth for site identity, author identity and the FAQ.
 *
 * The FAQ lives here rather than in the component because it is rendered twice:
 * once as visible accordion content, once as FAQPage structured data. Answer
 * engines quote the structured data, so the two must never drift apart.
 */

export const SITE = {
  name: 'DevCodeHub',
  url: 'https://devcodehub.cloud',
  tagline: 'Realtime code snippet exchange for development teams',
  description:
    'DevCodeHub is a realtime code exchange where development teams share, edit and manage small snippets together. Create a snippet, send the link, edit it live with your team. No account required.',
  locale: 'en_US',
};

export const AUTHOR = {
  name: 'Shams Ali Shaikh',
  shortName: 'Shams Ali',
  role: 'Full stack developer',
  bio: 'Shams Ali Shaikh is a full stack developer who builds realtime web products with Next.js, React and Firebase. He designed and built DevCodeHub to remove the friction of pasting snippets between chat apps during code review.',
  github: 'https://github.com/dev-shamsali',
  linkedin: 'https://www.linkedin.com/in/dev-shamsali',
  knowsAbout: [
    'Next.js',
    'React',
    'Firebase Realtime Database',
    'Realtime collaboration',
    'Full stack web development',
  ],
};

/**
 * Answer Engine Optimization surface.
 *
 * Each answer is written to stand alone when an assistant quotes it without
 * the question, and the authorship answer names the developer in full so the
 * attribution survives extraction.
 */
export const FAQ = [
  {
    q: 'What is DevCodeHub?',
    a: `DevCodeHub is a free realtime code exchange for development teams. You create a named snippet, share its link, and everyone with the link edits the same buffer live. It is built for the small pieces of code that move between people during review and debugging, not for full projects.`,
  },
  {
    q: 'Who built DevCodeHub?',
    a: `DevCodeHub was designed and built by ${AUTHOR.name}, a full stack developer working in Next.js, React and Firebase. He built it after getting tired of pasting the same snippet into three chat windows during code review. You can find his work at ${AUTHOR.github}.`,
  },
  {
    q: 'Do I need an account to use DevCodeHub?',
    a: 'No. DevCodeHub signs you in anonymously the moment you open the editor, so you can create and share a snippet without registering, confirming an email or installing anything.',
  },
  {
    q: 'How does realtime editing work in DevCodeHub?',
    a: 'Every snippet is a record in Firebase Realtime Database. When you type, the change is written to that record and pushed to every other connected browser within a fraction of a second, so all collaborators see the same content without refreshing.',
  },
  {
    q: 'Which programming languages does DevCodeHub support?',
    a: 'The editor uses CodeMirror 6 with JavaScript and TypeScript syntax highlighting, and snippets can be downloaded in the file extension that matches their language. Any plain text pastes and shares correctly regardless of language.',
  },
  {
    q: 'Is DevCodeHub free?',
    a: 'Yes. DevCodeHub is free to use and there is no paid tier, seat count or usage limit.',
  },
  {
    q: 'How long do DevCodeHub snippets last?',
    a: 'Unpinned snippets are cleared automatically 36 hours after their last edit, which keeps the workspace from filling up with dead pastes. Pin a snippet to keep it indefinitely.',
  },
];

export const jsonLd = {
  person: () => ({
    '@type': 'Person',
    '@id': `${SITE.url}/#author`,
    name: AUTHOR.name,
    alternateName: AUTHOR.shortName,
    jobTitle: AUTHOR.role,
    description: AUTHOR.bio,
    url: `${SITE.url}/#developer`,
    sameAs: [AUTHOR.github, AUTHOR.linkedin],
    knowsAbout: AUTHOR.knowsAbout,
  }),

  graph() {
    const person = this.person();
    return {
      '@context': 'https://schema.org',
      '@graph': [
        person,
        {
          '@type': 'WebSite',
          '@id': `${SITE.url}/#website`,
          url: SITE.url,
          name: SITE.name,
          description: SITE.description,
          inLanguage: 'en',
          publisher: { '@id': `${SITE.url}/#author` },
          creator: { '@id': `${SITE.url}/#author` },
        },
        {
          '@type': 'WebApplication',
          '@id': `${SITE.url}/#app`,
          name: SITE.name,
          url: SITE.url,
          description: SITE.description,
          applicationCategory: 'DeveloperApplication',
          operatingSystem: 'Any browser',
          browserRequirements: 'Requires JavaScript.',
          author: { '@id': `${SITE.url}/#author` },
          creator: { '@id': `${SITE.url}/#author` },
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
          featureList: [
            'Realtime collaborative editing',
            'Shareable snippet links',
            'Anonymous access with no signup',
            'Syntax highlighting via CodeMirror 6',
            'Pin and lock snippets',
            'Snippet download',
          ],
        },
        {
          // Sitelink hint. Google decides whether to show sitelinks and which
          // ones, but naming the editor as primary navigation is how you tell
          // it this route matters. It is a signal, never a guarantee.
          '@type': 'SiteNavigationElement',
          '@id': `${SITE.url}/#nav`,
          name: ['Editor', 'Media', 'Features', 'FAQ', 'Developer'],
          url: [
            `${SITE.url}/editor`,
            `${SITE.url}/media`,
            `${SITE.url}/#features`,
            `${SITE.url}/#faq`,
            `${SITE.url}/#developer`,
          ],
        },
        {
          '@type': 'FAQPage',
          '@id': `${SITE.url}/#faq`,
          mainEntity: FAQ.map(({ q, a }) => ({
            '@type': 'Question',
            name: q,
            acceptedAnswer: { '@type': 'Answer', text: a },
          })),
        },
      ],
    };
  },
};
