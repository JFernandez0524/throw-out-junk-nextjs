'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiMenu, FiX, FiPhone, FiLogIn, FiLogOut } from 'react-icons/fi';
import { useAuthenticator } from '@aws-amplify/ui-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const phoneNumber = '+1-973-384-1054';

  const { user, signOut } = useAuthenticator((context) => [context.user]);

  const AuthLink = () =>
    user ? (
      <button
        onClick={signOut}
        className='text-gray-700 hover:text-primary transition duration-300 flex items-center gap-1'
      >
        <FiLogOut />
        Logout
      </button>
    ) : (
      <Link
        href='/auth/signin'
        className='text-gray-700 hover:text-primary transition duration-300 flex items-center gap-1'
        onClick={() => setIsOpen(false)}
      >
        <FiLogIn />
        Login
      </Link>
    );

  return (
    <nav className='bg-white shadow-md fixed top-0 left-0 w-full z-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <div className='flex items-center space-x-4'>
            <Link
              href='/'
              className='text-2xl font-bold text-primary tracking-wide'
            >
              Throw Out <span className='text-secondary'>MyJunk</span>
            </Link>

            <a
              href={`tel:${phoneNumber}`}
              className='md:hidden flex items-center text-primary font-semibold'
            >
              <FiPhone className='mr-1' /> Call Now
            </a>
          </div>

          {/* Desktop Phone */}
          <a
            href={`tel:${phoneNumber}`}
            className='hidden md:flex items-center text-primary font-semibold text-lg hover:text-primary-dark transition'
          >
            <FiPhone className='mr-2' /> {phoneNumber}
          </a>

          {/* Mobile Menu Button */}
          <button
            className='md:hidden text-gray-700 focus:outline-none'
            onClick={() => setIsOpen(!isOpen)}
            aria-label='Toggle Menu'
          >
            {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
          </button>

          {/* Desktop Menu */}
          <div className='hidden md:flex space-x-6 items-center'>
            <NavItem href='/' label='Home' />
            <NavItem href='/services' label='Services' />
            <NavItem href='/about' label='About' />
            <NavItem href='/contact' label='Contact' />
            <AuthLink />
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className='md:hidden bg-white shadow-md'
        >
          <div className='flex flex-col space-y-4 p-4'>
            <NavItem href='/' label='Home' onClick={() => setIsOpen(false)} />
            <NavItem
              href='/services'
              label='Services'
              onClick={() => setIsOpen(false)}
            />
            <NavItem
              href='/about'
              label='About'
              onClick={() => setIsOpen(false)}
            />
            <NavItem
              href='/contact'
              label='Contact'
              onClick={() => setIsOpen(false)}
            />
            <AuthLink />
          </div>
        </motion.div>
      )}
    </nav>
  );
};

interface NavItemProps {
  href: string;
  label: string;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ href, label, onClick }) => (
  <Link
    href={href}
    className='text-gray-700 hover:text-primary transition duration-300'
    onClick={onClick}
  >
    {label}
  </Link>
);

export default Navbar;
