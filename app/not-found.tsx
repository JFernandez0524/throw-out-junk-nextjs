import Link from 'next/link';
import { FaExclamationTriangle } from 'react-icons/fa';

export default function NotFound() {
  return (
    <main className='container mx-auto h-screen '>
      <section className='flex flex-col items-center justify-center h-full'>
        <div className=''>
          <FaExclamationTriangle className='text-5xl text-yellow-500' />
        </div>
        <div className=' text-center'>
          <h2>OOOPS.....</h2>
          <p>Looks like this page does not exist.</p>
          <button className='items-center justify-center px-4 py-2 mt-4 text-white bg-blue-500 rounded-md'>
            <Link href='/contact'>Contact Us</Link>
          </button>
        </div>
      </section>
    </main>
  );
}
