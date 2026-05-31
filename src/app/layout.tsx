import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ImageTools — Free Online Image Tools',
  description: 'Free online image tools — compress, convert, resize, crop. 100% browser-side, zero upload.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://image.toolconv.com'),
  icons: { icon: '/favicon.ico' },
};

/// Root layout — minimal shell. [locale]/layout.tsx sets <html lang> dynamically.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
