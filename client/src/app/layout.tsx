import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import axios from 'axios';
import Providers from '@/components/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CE Project Management | KMITL',
  description: 'CE Project Management | KMITL',
};

axios.defaults.baseURL = process.env.NEXT_PUBLIC_ENDPOINT;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
