'use client';

import { FiPhone } from 'react-icons/fi';

const Hero: React.FC = () => {
  const phoneNumber = '+1-973-384-1054';

  return (
    <section className="relative h-[80vh] md:h-[90vh] bg-[url('/hero.jpg')] bg-cover bg-center flex items-center justify-center text-center">
      {/* Dark Overlay */}
      <div className='absolute inset-0 bg-black bg-opacity-50' />

      {/* Hero Content */}
      <div className='relative z-10 max-w-3xl px-6'>
        <h1 className='text-4xl md:text-6xl font-bold text-white leading-tight'>
          We Make Junk Disappear & Your Home Shine ✨
        </h1>
        <p className='mt-4 text-lg text-gray-200'>
          Call us today for a <strong>free quote</strong> and enjoy a
          clutter-free home!
        </p>
        <div className='mt-6'>
          <a
            href={`tel:${phoneNumber}`}
            className='inline-flex items-center bg-primary text-white px-6 py-3 text-lg font-semibold rounded-lg shadow-md hover:bg-primary-dark transition'
          >
            <FiPhone className='mr-2' size={24} />
            Call for a Free Quote
          </a>
        </div>
        <p className='mt-4 text-gray-300'>
          Available 7 days a week – Call us now!
        </p>
      </div>
    </section>
  );
};

export default Hero;
