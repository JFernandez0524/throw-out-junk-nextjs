import { FiZap, FiShield, FiDollarSign } from 'react-icons/fi';
import { FaRecycle } from 'react-icons/fa';
const benefits = [
  {
    icon: FiZap,
    title: 'Fast & Reliable',
    description: 'Same-day or next-day junk removal services.',
  },
  {
    icon: FiShield,
    title: 'Licensed & Insured',
    description: 'We are fully licensed and insured for your peace of mind.',
  },
  {
    icon: FaRecycle,
    title: 'Eco-Friendly Disposal',
    description: 'We recycle and donate items whenever possible.',
  },
  {
    icon: FiDollarSign,
    title: 'Affordable Pricing',
    description: 'Transparent pricing with no hidden fees.',
  },
];

const WhyChooseUs = () => (
  <section className='py-16 bg-white text-center'>
    <h2 className='text-4xl font-bold text-gray-900'>Why Choose Us?</h2>
    <p className='mt-2 text-gray-600'>
      We’re reliable, efficient, and customer-focused.
    </p>

    <div className='mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto'>
      {benefits.map((benefit, index) => (
        <div
          key={index}
          className='p-6 bg-gray-100 rounded-lg shadow flex flex-col items-center'
        >
          <benefit.icon className='text-primary text-5xl mb-4' />
          <h3 className='text-xl font-semibold text-gray-800'>
            {benefit.title}
          </h3>
          <p className='mt-2 text-gray-600 text-center'>
            {benefit.description}
          </p>
        </div>
      ))}
    </div>
  </section>
);

export default WhyChooseUs;
