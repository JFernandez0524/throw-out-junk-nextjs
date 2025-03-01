import type { Metadata } from 'next';
import { DarkMode } from './components/darkMode';
import { Inter } from 'next/font/google';
import './globals.css';
import outputs from '@/amplify_outputs.json';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer'; // ✅ Make sure this is imported
import { Amplify } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';

Amplify.configure(outputs);

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
        <Navbar />
        <main className='flex-grow'>
          <DarkMode>{children}</DarkMode>{' '}
          {/* ✅ Dark mode wraps main content only */}
        </main>
        <Footer /> {/* ✅ Footer is now at the bottom */}
      </body>
    </html>
  );
}
