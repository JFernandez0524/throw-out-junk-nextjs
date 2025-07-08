import PhoneNumber from './PhoneNumber';

export const CTA = () => {
  const phoneNumber = '+1-973-384-1054';
  return (
    <section className='py-16 bg-primary text-white text-center'>
      <h2 className='text-4xl font-bold'>Ready for a Clean Space?</h2>
      <p className='mt-2 text-lg'>Call us now for a free quote!</p>
      <div className='mt-6'>
        <PhoneNumber />
      </div>
    </section>
  );
};

export default CTA;
