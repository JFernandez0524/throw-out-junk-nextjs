import { FiPhone } from 'react-icons/fi';

const phoneNumber = '+1-973-384-1054'; // Replace with your actual phone number

const PhoneNumber = ({ className = '' }) => (
  <a
    href={`tel:${phoneNumber}`}
    className={`inline-flex items-center text-primary font-semibold hover:underline ${className}`}
  >
    <FiPhone className='mr-2' size={24} />
    {phoneNumber}
  </a>
);

export default PhoneNumber;
