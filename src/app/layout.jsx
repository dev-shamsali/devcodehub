import { Geist, Geist_Mono, Bricolage_Grotesque } from 'next/font/google';
import './globals.css';
import { SITE, AUTHOR, jsonLd } from '@/lib/site';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

// Display face. Variable optical-size axis, so headlines get real character
// at large sizes without a second file.
const bricolage = Bricolage_Grotesque({
  variable: '--font-bricolage',
  subsets: ['latin'],
  display: 'swap',
  axes: ['opsz'],
});

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    'code snippet sharing',
    'realtime code editor',
    'collaborative code editor',
    'share code with team',
    'online code exchange',
    'pair programming tool',
    'code review snippets',
    'DevCodeHub',
    AUTHOR.name,
  ],
  authors: [{ name: AUTHOR.name, url: AUTHOR.github }],
  creator: AUTHOR.name,
  publisher: AUTHOR.name,
  category: 'technology',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} | ${SITE.tagline}`,
    description: SITE.description,
    locale: SITE.locale,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} | ${SITE.tagline}`,
    description: SITE.description,
    creator: `@${AUTHOR.shortName.replace(/\s+/g, '')}`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [{ url: '/favicons/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/favicons/site.webmanifest',
};

export const viewport = {
  themeColor: '#0a090b',
  colorScheme: 'dark',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${bricolage.variable} bg-ink-900 text-text-hi antialiased`}
      >
        <script
          type="application/ld+json"
          // Structured data is a static object built in our own code, not user input.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.graph()) }}
        />
        <div className="grain" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
