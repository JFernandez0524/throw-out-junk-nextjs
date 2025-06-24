'use client'; // Required for Next.js App Router

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiMenu, FiX, FiPhone } from 'react-icons/fi'; // Using react-icons

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const phoneNumber = '+1-973-384-1054'; // Update with your real number

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

            {/* Visible Phone Number on Mobile */}
            <a
              href={`tel:${phoneNumber}`}
              className='md:hidden flex items-center text-primary font-semibold text-2xl hover:text-primary-dark transition'
            >
              <FiPhone className='mr-1' /> Call Now
            </a>
          </div>

          {/* Desktop Phone Number */}
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
          <div className='hidden md:flex space-x-6'>
            <NavItem href='/' label='Home' />
            <NavItem href='/services' label='Services' />
            <NavItem href='/about' label='About' />
            <NavItem href='/contact' label='Contact' />
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown (Animated) */}
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
          </div>
        </motion.div>
      )}
    </nav>
  );
};

// Reusable NavItem Component
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
