import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { DarkMode } from '../components/darkMode';
import { ClientProvider } from '../components/ClientProvider'; // ✅ NEW
import { ChatBox } from '../components/ChatBox';
import { ChatProvider } from '@/context/ChatContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ThrowOutMyJunk - Junk Removal & Cleanouts',
  description:
    'Reliable junk removal, demolition, and cleanout services in NJ.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <ClientProvider>
          {' '}
          {/* ✅ Now we handle Amplify here */}
          <ChatProvider>
            {/* Wrap children with ChatProvider to provide chat context */}
            <Navbar />
            <main className='flex-grow'>
              <DarkMode>{children}</DarkMode>
              <ChatBox />
            </main>
            <Footer />
          </ChatProvider>
          {/* ChatProvider wraps the entire app to provide chat functionality */}
        </ClientProvider>
      </body>
    </html>
  );
}
