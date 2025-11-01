import React from 'react';

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Sarah Martinez',
      role: 'First-Time Home Buyer',
      company: 'Used HomeWorth before buying',
      image: '👩',
      rating: 5,
      text: 'I was about to overpay $45,000 for my first home. HomeWorth\'s valuation saved me from a huge mistake. The report was so detailed, I knew exactly what to offer.',
      location: 'Denver, CO'
    },
    {
      name: 'Robert Chen',
      role: 'Home Seller',
      company: 'Sold home in 12 days',
      image: '👨',
      rating: 5,
      text: 'We priced our home perfectly thanks to HomeWorth. It sold for asking price in just 12 days—faster than any other home in our neighborhood! Worth every penny.',
      location: 'Portland, OR'
    },
    {
      name: 'Jennifer Adams',
      role: 'Real Estate Agent',
      company: 'Premier Properties',
      image: '👩‍💼',
      rating: 5,
      text: 'HomeWorth has transformed my business. I can now provide instant valuations to clients during showings. My clients trust the data, and I close deals faster.',
      location: 'Austin, TX'
    },
    {
      name: 'Mike Thompson',
      role: 'Property Investor',
      company: 'Active Real Estate Investor',
      image: '👨‍💼',
      rating: 5,
      text: 'I evaluate 20+ properties monthly. HomeWorth saves me $6,000+ in appraisal costs every month while giving me instant insights. Game-changer for investors!',
      location: 'Phoenix, AZ'
    },
    {
      name: 'Lisa Park',
      role: 'Home Seller',
      company: 'Maximized sale price',
      image: '👩',
      rating: 5,
      text: 'The upgrade recommendations feature was gold! We made $18K worth of improvements that added $35K to our sale price. Best investment we made.',
      location: 'San Diego, CA'
    },
    {
      name: 'David Kim',
      role: 'Home Buyer',
      company: 'Negotiated better deal',
      image: '👨',
      rating: 5,
      text: 'Used HomeWorth during negotiations and saved $32,000 off the asking price. The seller\'s agent couldn\'t argue with the professional report. Highly recommend!',
      location: 'Boston, MA'
    }
  ];

  const stats = [
    { number: '4.9/5', label: 'Average Rating', icon: '⭐' },
    { number: '10K+', label: 'Happy Customers', icon: '😊' },
    { number: '95%', label: 'Accuracy Rate', icon: '🎯' },
    { number: '30s', label: 'Average Time', icon: '⚡' }
  ];

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
            Real Stories from <span className="gradient-text">Real People</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            See how buyers and sellers are saving thousands and making smarter decisions with HomeWorth.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
              <div className="text-slate-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 lg:p-8 shadow-md border border-slate-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="text-4xl mr-4">{testimonial.image}</div>
                <div>
                  <div className="font-bold text-slate-900">{testimonial.name}</div>
                  <div className="text-sm text-slate-600 font-medium">{testimonial.role}</div>
                  <div className="text-sm text-slate-500">{testimonial.company}</div>
                </div>
              </div>
              
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">⭐</span>
                ))}
              </div>
              
              <p className="text-slate-700 mb-4 italic leading-relaxed">"{testimonial.text}"</p>
              
              <div className="text-sm text-slate-500 font-medium">📍 {testimonial.location}</div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="bg-slate-50 rounded-2xl p-8 lg:p-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Trusted by Industry Leaders
            </h3>
            <p className="text-slate-600">
              Our AI technology is used by top real estate companies and professionals nationwide.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-700">REMAX</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-700">Coldwell Banker</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-700">Keller Williams</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-700">Century 21</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">
            Ready to Experience the Future of Property Valuation?
          </h3>
          <p className="text-slate-600 mb-8">
            Join thousands of satisfied customers and start getting accurate valuations today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/signup" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-colors duration-200 shadow-lg hover:shadow-xl text-center">
              Get Started
            </a>
            <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold py-4 px-8 rounded-lg text-lg transition-colors duration-200">
              View All Reviews
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
