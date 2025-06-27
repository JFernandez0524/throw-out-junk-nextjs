const Testimonials = () => (
  <section className='py-16 bg-gray-100 text-center'>
    <h2 className='text-4xl font-bold text-gray-900'>What Our Customers Say</h2>
    <div className='mt-8 max-w-4xl mx-auto space-y-6'>
      {[
        {
          name: 'John D.',
          review: 'Fast, professional, and left my place spotless!',
        },
        {
          name: 'Sarah P.',
          review: 'Great service, friendly team, and reasonable pricing.',
        },
        {
          name: 'Mark T.',
          review:
            'They removed everything quickly and responsibly. Highly recommend!',
        },
      ].map((testimonial, index) => (
        <div key={index} className='p-6 bg-white shadow rounded-lg'>
          <p className='text-gray-700'>"{testimonial.review}"</p>
          <h4 className='mt-2 font-semibold text-primary'>
            {testimonial.name}
          </h4>
        </div>
      ))}
    </div>
  </section>
);

export default Testimonials;
