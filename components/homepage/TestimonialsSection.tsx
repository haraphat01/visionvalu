import React from 'react';

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Real Estate Agent',
      company: 'Premier Properties',
      image: '👩‍💼',
      rating: 5,
      text: 'VisionValu has revolutionized how I present properties to clients. The AI analysis is incredibly accurate and saves me hours of research. My clients love the detailed reports!',
      location: 'San Francisco, CA'
    },
    {
      name: 'Michael Chen',
      role: 'Property Developer',
      company: 'Urban Development Co.',
      image: '👨‍💼',
      rating: 5,
      text: 'As a developer, I need quick, accurate valuations for multiple properties. VisionValu delivers professional-grade analysis in minutes. It\'s become an essential tool in my workflow.',
      location: 'Austin, TX'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Real Estate Investor',
      company: 'Rodriguez Investments',
      image: '👩‍💻',
      rating: 5,
      text: 'The market trend analysis feature is incredible. I can make informed investment decisions quickly. The accuracy is impressive - it\'s saved me thousands in due diligence costs.',
      location: 'Miami, FL'
    },
    {
      name: 'David Thompson',
      role: 'Property Manager',
      company: 'Thompson Properties',
      image: '👨‍🏢',
      rating: 5,
      text: 'Managing 200+ properties requires efficient valuation processes. VisionValu\'s bulk upload feature and detailed reports have streamlined our operations significantly.',
      location: 'Seattle, WA'
    },
    {
      name: 'Lisa Wang',
      role: 'Real Estate Broker',
      company: 'Wang & Associates',
      image: '👩‍💼',
      rating: 5,
      text: 'My clients are impressed with the professional reports. The AI analysis provides insights I never would have considered. It\'s elevated my service quality.',
      location: 'New York, NY'
    },
    {
      name: 'James Wilson',
      role: 'Property Appraiser',
      company: 'Wilson Appraisals',
      image: '👨‍💼',
      rating: 5,
      text: 'As a traditional appraiser, I was skeptical of AI valuations. But VisionValu\'s accuracy and detailed analysis have made it a valuable tool in my practice.',
      location: 'Chicago, IL'
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
            What Our Customers Say
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Join thousands of real estate professionals who trust VisionValu for accurate, fast property valuations.
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-slate-50 rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center mb-4">
                <div className="text-3xl mr-3">{testimonial.image}</div>
                <div>
                  <div className="font-semibold text-slate-900">{testimonial.name}</div>
                  <div className="text-sm text-slate-600">{testimonial.role}</div>
                  <div className="text-sm text-slate-500">{testimonial.company}</div>
                </div>
              </div>
              
              <div className="flex mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400">⭐</span>
                ))}
              </div>
              
              <p className="text-slate-700 mb-4 italic">"{testimonial.text}"</p>
              
              <div className="text-sm text-slate-500">{testimonial.location}</div>
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
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-colors duration-200 shadow-lg hover:shadow-xl">
              Start Free Trial
            </button>
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
