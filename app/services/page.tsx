import { FiTruck, FiHome, FiTool } from 'react-icons/fi';

const services = [
  {
    name: 'Junk Removal',
    icon: FiTruck,
    description:
      'We remove old furniture, appliances, and general junk from homes and businesses.',
  },
  {
    name: 'Cleanouts',
    icon: FiHome,
    description:
      'Estate cleanouts, basement cleanouts, and office decluttering.',
  },
  {
    name: 'Demolition',
    icon: FiTool,
    description:
      'Interior and small structure demolition with proper debris disposal.',
  },
];

export default function ServicesPage() {
  return (
    <section className='py-16 bg-white text-center'>
      <h1 className='text-4xl font-bold text-gray-900'>Our Services</h1>
      <p className='mt-2 text-gray-600'>
        We provide professional junk removal, cleanouts, and demolition.
      </p>

      <div className='mt-8 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto'>
        {services.map((service, index) => (
          <div key={index} className='p-6 bg-gray-100 shadow rounded-lg'>
            <service.icon className='text-primary text-5xl mx-auto mb-4' />
            <h3 className='text-xl font-semibold'>{service.name}</h3>
            <p className='mt-2 text-gray-700'>{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
