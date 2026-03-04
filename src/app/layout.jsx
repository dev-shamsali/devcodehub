import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "DevCodeHub | Team Code Exchange Platform",
  description:
    "DevCodeHub is a collaborative platform where development teams can quickly share, exchange, and manage small code snippets to improve productivity and teamwork.",
  keywords: [
    "DevCodeHub",
    "code exchange",
    "team collaboration",
    "developer tools",
    "code snippets",
    "programming collaboration",
  ],
  authors: [{ name: "Shams Ali Shaikh" }],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Favicons */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicons/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicons/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}