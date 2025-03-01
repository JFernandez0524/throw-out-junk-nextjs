const WhyChooseUs = () => (
  <section className='py-16 bg-white text-center'>
    <h2 className='text-4xl font-bold text-gray-900'>Why Choose Us?</h2>
    <div className='mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto'>
      {[
        'Fast & Reliable',
        'Licensed & Insured',
        'Eco-Friendly',
        'Affordable Pricing',
      ].map((item, index) => (
        <div key={index} className='p-6 bg-gray-100 rounded-lg shadow'>
          <h3 className='text-xl font-semibold text-gray-800'>{item}</h3>
        </div>
      ))}
    </div>
  </section>
);

export default WhyChooseUs;
