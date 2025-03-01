import { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const faqs = [
  {
    question: 'What items do you remove?',
    answer:
      'We remove furniture, appliances, construction debris, yard waste, and more!',
  },
  {
    question: 'Do you offer same-day service?',
    answer: 'Yes! We provide same-day or next-day junk removal services.',
  },
  {
    question: 'How much does junk removal cost?',
    answer:
      'Pricing depends on the volume and type of junk. Call us for a free estimate!',
  },
  {
    question: 'Do you recycle or donate items?',
    answer: 'Yes! We recycle and donate whenever possible to minimize waste.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className='py-16 bg-gray-100 text-center'>
      <h2 className='text-4xl font-bold text-gray-900'>
        Frequently Asked Questions
      </h2>
      <div className='mt-8 max-w-4xl mx-auto space-y-4'>
        {faqs.map((faq, index) => (
          <div key={index} className='p-4 bg-white rounded-lg shadow-md'>
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className='w-full flex justify-between items-center text-left text-lg font-semibold'
            >
              {faq.question}
              {openIndex === index ? (
                <FiChevronUp size={20} />
              ) : (
                <FiChevronDown size={20} />
              )}
            </button>
            {openIndex === index && (
              <p className='mt-2 text-gray-700'>{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
