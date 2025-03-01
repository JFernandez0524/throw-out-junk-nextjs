import Link from 'next/link';
import {
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiPhone,
  FiMail,
} from 'react-icons/fi';

const Footer = () => {
  const phoneNumber = '+1-973-384-1054';
  const email = 'info@throwoutmyjunk.com';

  return (
    <footer className='bg-gray-900 text-white py-8'>
      <div className='max-w-7xl mx-auto px-6'>
        <div className='grid md:grid-cols-3 gap-8 text-center md:text-left'>
          {/* Logo & About */}
          <div>
            <h2 className='text-2xl font-bold text-primary'>ThrowOutMyJunk</h2>
            <p className='mt-2 text-gray-400'>
              Your trusted junk removal & demolition experts in NJ.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className='text-xl font-semibold text-primary'>Quick Links</h3>
            <ul className='mt-2 space-y-2'>
              <li>
                <Link href='/' className='hover:text-primary'>
                  Home
                </Link>
              </li>
              <li>
                <Link href='/services' className='hover:text-primary'>
                  Services
                </Link>
              </li>
              <li>
                <Link href='/about' className='hover:text-primary'>
                  About
                </Link>
              </li>
              <li>
                <Link href='/contact' className='hover:text-primary'>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className='text-xl font-semibold text-primary'>Contact Us</h3>
            <div className='mt-2 space-y-2'>
              <a
                href={`tel:${phoneNumber}`}
                className='flex items-center justify-center md:justify-start space-x-2 text-gray-400 hover:text-white'
              >
                <FiPhone /> <span>{phoneNumber}</span>
              </a>
              <a
                href={`mailto:${email}`}
                className='flex items-center justify-center md:justify-start space-x-2 text-gray-400 hover:text-white'
              >
                <FiMail /> <span>{email}</span>
              </a>
            </div>

            {/* Social Icons */}
            <div className='mt-4 flex justify-center md:justify-start space-x-4'>
              <a
                href='https://facebook.com'
                target='_blank'
                rel='noopener noreferrer'
                className='text-gray-400 hover:text-white'
              >
                <FiFacebook size={24} />
              </a>
              <a
                href='https://instagram.com'
                target='_blank'
                rel='noopener noreferrer'
                className='text-gray-400 hover:text-white'
              >
                <FiInstagram size={24} />
              </a>
              <a
                href='https://twitter.com'
                target='_blank'
                rel='noopener noreferrer'
                className='text-gray-400 hover:text-white'
              >
                <FiTwitter size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className='mt-8 text-center text-gray-500'>
          &copy; {new Date().getFullYear()} ThrowOutMyJunk. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
