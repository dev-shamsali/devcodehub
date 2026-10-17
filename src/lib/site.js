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
  tagline: 'Realtime code editor and file sharing for development teams',
  description:
    'DevCodeHub is a realtime code editor and a shared file drop for development teams. Edit snippets live, share images and zip files, and see who created and edited each one. Sign in with email or Google.',
  locale: 'en_US',
};

export const AUTHOR = {
  name: 'Shams Ali Shaikh',
  shortName: 'Shams Ali',
  role: 'Full stack developer',
  bio: 'Shams Ali Shaikh is a full stack developer who builds web products with Next.js and React. He designed and built DevCodeHub to remove the friction of attaching the same screenshots and archives to every chat thread during code review.',
  github: 'https://github.com/dev-shamsali',
  linkedin: 'https://www.linkedin.com/in/shams-ali-shaikh-27194425a/',
  instagram: 'https://www.instagram.com/shamsss.in/',
  portfolio: 'https://shamsali.devcodehub.cloud',
  knowsAbout: [
    'Next.js',
    'React',
    'MongoDB',
    'Web authentication',
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
    a: 'DevCodeHub is a free workspace for development teams with two tools. The editor lets everyone with a snippet link edit the same code live and shows who created and last edited it. Media is a shared drop for images, zip files, PDFs and Word documents.',
  },
  {
    q: 'Who built DevCodeHub?',
    a: `DevCodeHub was designed and built by ${AUTHOR.name}, a full stack developer working in Next.js and React. He built it after getting tired of attaching the same screenshots to three chat threads during code review. You can find his work at ${AUTHOR.github}.`,
  },
  {
    q: 'Do I need an account to use DevCodeHub?',
    a: 'Yes. Sign up with an email and password or with Google. You stay signed in until you log out.',
  },
  {
    q: 'Which files can I share?',
    a: 'Images, zip archives, PDFs and Word documents, up to 25 MB per file. Each file gets a direct link you can paste into an issue or a pull request.',
  },
  {
    q: 'How do other people see new files?',
    a: 'The share refreshes itself every few seconds, so a file you add shows up for everyone who has that share open. Nobody has to reload the page.',
  },
  {
    q: 'Is DevCodeHub free?',
    a: 'Yes. DevCodeHub is free to use and there is no paid tier or seat count.',
  },
  {
    q: 'How long do shares last?',
    a: 'Unpinned shares are cleared automatically 36 hours after their last change, which keeps the workspace from filling up. Pin a share to keep it.',
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
    sameAs: [AUTHOR.github, AUTHOR.linkedin, AUTHOR.instagram, AUTHOR.portfolio],
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
            'Realtime collaborative code editor',
            'Creator and last-editor names on every snippet',
            'Image, zip, PDF and Word uploads',
            'Direct CDN link for every file',
            'Shares that refresh for everyone watching',
            'Sign in with email or Google',
            'Pin a share to keep it',
          ],
        },
        {
          // Sitelink hint. Google decides whether to show sitelinks and which
          // ones, but naming the media route as primary navigation is how you tell
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
