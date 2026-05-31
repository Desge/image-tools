import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ImageTools — Free Online Image Tools',
  description: 'Free online image tools — compress, convert, resize, crop. 100% browser-side, zero upload.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://image.toolconv.com'),
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
