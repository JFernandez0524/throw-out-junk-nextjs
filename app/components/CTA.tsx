import { FiPhone } from 'react-icons/fi';
import PhoneNumber from './PhoneNumber';

const CTA = () => {
  const phoneNumber = '+1-973-384-1054';
  return (
    <section className='py-16 bg-primary text-white text-center'>
      <h2 className='text-4xl font-bold'>Ready for a Clean Space?</h2>
      <p className='mt-2 text-lg'>Call us now for a free quote!</p>
      <div className='mt-6'>
        <a
          href={`tel:${phoneNumber}`}
          className='inline-flex items-center bg-white text-primary px-6 py-3 text-lg font-semibold rounded-lg shadow-md hover:bg-gray-200 transition'
        >
          <PhoneNumber />
        </a>
      </div>
    </section>
  );
};

export default CTA;
