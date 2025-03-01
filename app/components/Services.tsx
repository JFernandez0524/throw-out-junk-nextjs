import { FiTruck, FiHome, FiTool } from 'react-icons/fi';

const services = [
  {
    name: 'Junk Removal',
    icon: FiTruck,
    description:
      'Fast and reliable junk removal services for homes and businesses.',
  },
  {
    name: 'Cleanouts',
    icon: FiHome,
    description: 'We handle estate, garage, basement, and office cleanouts.',
  },
  {
    name: 'Demolition',
    icon: FiTool,
    description:
      'Small structure and interior demolition with proper debris disposal.',
  },
];

const Services = () => (
  <section className='py-16 bg-gray-100 text-center'>
    <h2 className='text-4xl font-bold text-gray-900'>Our Services</h2>
    <div className='mt-8 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto'>
      {services.map((service, index) => (
        <div key={index} className='p-6 bg-white shadow rounded-lg'>
          <service.icon className='text-primary text-5xl mx-auto mb-4' />
          <h3 className='text-xl font-semibold'>{service.name}</h3>
          <p className='mt-2 text-gray-600'>{service.description}</p>
        </div>
      ))}
    </div>
  </section>
);

export default Services;
