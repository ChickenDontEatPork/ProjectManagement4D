'use client';
import { Inter } from 'next/font/google';
import axios from 'axios';
import Sidebar from './[sidebar]/Sidebar';

const inter = Inter({ subsets: ['latin'] });

axios.defaults.baseURL = process.env.NEXT_PUBLIC_ENDPOINT;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <div className='flex h-full w-full'>
          <section className='h-full w-[15%] min-w-[234px]'>
            <Sidebar />
          </section>
          <section className='h-full w-[85%] overflow-y-scroll'>
            {children}
          </section>
        </div>
      </body>
    </html>
  );
}
