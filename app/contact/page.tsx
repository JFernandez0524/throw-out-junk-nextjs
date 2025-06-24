'use client';

import { useState } from 'react';
import { FiPhone, FiMail, FiSend } from 'react-icons/fi';
import PhoneNumber from '@/app/components/PhoneNumber';

const phoneNumber = '+1-973-384-1054';
const email = 'info@throwoutmyjunk.com';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <section className='py-16 bg-white text-center'>
      <h1 className='text-4xl font-bold text-gray-900'>Contact Us</h1>
      <p className='mt-4 text-lg text-gray-700'>
        Got junk? Get a free quote today!
      </p>

      {/* Contact Info */}
      <div className='mt-8 space-y-6'>
        <a
          href={`tel:${phoneNumber}`}
          className='block bg-primary text-white px-6 py-3 text-lg font-semibold rounded-lg shadow-md hover:bg-primary-dark transition inline-flex items-center mx-auto'
        >
          <PhoneNumber className='text-white' />
        </a>
        <a
          href={`mailto:${email}`}
          className='block text-primary text-lg font-semibold hover:underline'
        >
          <FiMail className='mr-2 inline' size={24} />
          {email}
        </a>
      </div>

      {/* Contact Form */}
      <div className='mt-12 max-w-lg mx-auto bg-gray-100 p-6 rounded-lg shadow-lg'>
        <h2 className='text-2xl font-semibold text-gray-900'>
          Request a Free Quote
        </h2>
        <form onSubmit={handleSubmit} className='mt-6 space-y-4'>
          <input
            type='text'
            name='name'
            placeholder='Your Name'
            value={formData.name}
            onChange={handleChange}
            required
            className='w-full p-3 border rounded-md'
          />
          <input
            type='email'
            name='email'
            placeholder='Your Email'
            value={formData.email}
            onChange={handleChange}
            required
            className='w-full p-3 border rounded-md'
          />
          <input
            type='tel'
            name='phone'
            placeholder='Your Phone'
            value={formData.phone}
            onChange={handleChange}
            required
            className='w-full p-3 border rounded-md'
          />
          <textarea
            name='message'
            placeholder='Describe your junk removal needs...'
            value={formData.message}
            onChange={handleChange}
            required
            className='w-full p-3 border rounded-md'
          ></textarea>

          <button
            type='submit'
            className='w-full bg-primary text-white py-3 rounded-md flex justify-center items-center space-x-2'
          >
            <FiSend size={20} />
            <span>Send Request</span>
          </button>
        </form>

        {/* Status Messages */}
        {status === 'success' && (
          <p className='mt-4 text-green-600'>
            Your request has been sent successfully!
          </p>
        )}
        {status === 'error' && (
          <p className='mt-4 text-red-600'>
            Oops! Something went wrong. Try again.
          </p>
        )}
      </div>
    </section>
  );
}
