import type { Metadata } from 'next';
import './globals.css';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://image.toolconv.com';

export const metadata: Metadata = {
  title: 'ImageTools — Free Online Image Tools',
  description: 'Free online image tools — compress, convert, resize, crop. 100% browser-side, zero upload.',
  metadataBase: new URL(SITE_URL),
  icons: { icon: '/favicon.ico' },
  openGraph: {
    title: 'ImageTools — Free Online Image Tools',
    description: 'Free online image tools — compress, convert, resize, crop. 100% browser-side, zero upload.',
    siteName: 'ImageTools',
    url: SITE_URL,
    type: 'website',
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ImageTools — Free Online Image Tools',
    description: 'Free online image tools — compress, convert, resize, crop. 100% browser-side, zero upload.',
    images: [`${SITE_URL}/og-image.png`],
  },
};

/// Root layout — minimal shell. [locale]/layout.tsx sets <html lang> dynamically.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
