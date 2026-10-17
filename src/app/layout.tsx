import type { Metadata, Viewport } from 'next';
import { Space_Grotesk, Inter, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://appverse.si'),
  title: {
    default: 'AppverseSI — Tomorrow, Made Real | Appverse Superintelligence',
    template: '%s | AppverseSI',
  },
  description:
    'AppverseSI (Appverse Superintelligence) develops and publishes useful in-house apps, builds toward connected super-app experiences, and partners with businesses on custom web applications and software.',
  keywords: [
    'AppverseSI',
    'Appverse Superintelligence',
    'appverse.si',
    'Super Apps',
    'App Development',
    'Custom Web Applications',
    '3D WebGL Websites',
    'Software Studio',
  ],
  authors: [{ name: 'AppverseSI' }],
  alternates: {
    canonical: 'https://appverse.si',
  },
  openGraph: {
    title: 'AppverseSI — Tomorrow, Made Real.',
    description:
      'Apps for today. A bigger vision for tomorrow. In-house apps, connected super-app architecture, and custom software engineering for businesses.',
    url: 'https://appverse.si',
    siteName: 'AppverseSI',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AppverseSI — Appverse Superintelligence',
    description:
      'Apps for today. A bigger vision for tomorrow. In-house apps and custom software engineering.',
  },
  icons: {
    icon: '/favicon.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#030408',
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${ibmPlexMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
