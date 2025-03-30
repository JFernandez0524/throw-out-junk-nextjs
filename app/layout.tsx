import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { DarkMode } from './components/darkMode';
import { ClientProvider } from './components/ClientProvider'; // ✅ NEW

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
          <Navbar />
          <main className='flex-grow'>
            <DarkMode>{children}</DarkMode>
          </main>
          <Footer />
        </ClientProvider>
      </body>
    </html>
  );
}
