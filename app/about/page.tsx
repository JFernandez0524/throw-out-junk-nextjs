export default function AboutPage() {
  return (
    <section className='py-16 bg-gray-100 text-center'>
      <h1 className='text-4xl font-bold text-gray-900'>About Us</h1>
      <p className='mt-4 text-lg text-gray-700 max-w-3xl mx-auto'>
        At <strong>ThrowOutMyJunk</strong>, we specialize in **junk removal,
        cleanouts, and demolition services** across New Jersey. Our mission is
        to provide **fast, reliable, and eco-friendly** disposal solutions for
        homes and businesses.
      </p>

      <div className='mt-8 max-w-4xl mx-auto space-y-6'>
        <p className='text-gray-600'>
          🚛 **Professional & Friendly Team** – We arrive on time, work
          efficiently, and leave your space spotless.
        </p>
        <p className='text-gray-600'>
          🌱 **Eco-Friendly Disposal** – We recycle, donate, and properly
          dispose of all junk.
        </p>
        <p className='text-gray-600'>
          💰 **Transparent Pricing** – No hidden fees. Get a free quote today!
        </p>
      </div>
    </section>
  );
}
