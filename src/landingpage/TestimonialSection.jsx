import React from 'react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Brenda Rae',
      title: 'Social Media Analyst',
      image: '/image/rae.png',
      rating: 4.5,
      testimonial: 'As a small business owner, time is my most valuable asset. Swift Suite has simplified our catalog management and made tracking inventory a breeze. The support team is responsive and always ready to help. Highly recommended!'
    },
    {
      id: 2,
      name: 'Amy Adams',
      title: 'Economics Analyst',
      image: '/image/amy.png',
      rating: 5.0,
      testimonial: 'The scalability of Swift Suite is unmatched. It seamlessly adapts to our growth, providing unparalleled insights. The dashboard has transformed the way we approach logistics, making daily operations smoother than ever.'
    },
    {
      id: 3,
      name: 'Joanna Pasier',
      title: 'Economics Analyst',
      image: '/image/joanna.png',
      rating: 5.0,
      testimonial: 'Swift Suite is a game-changer in our industry. The level of detail in the reports is unparalleled, guiding our strategic planning. The user-friendly interface has streamlined our processes and positively impacted our day-to-day efficiency.'
    },
    {
      id: 4,
      name: 'Jeremy Jane',
      title: 'Economics Analyst',
      image: '/image/jeremy.png',
      rating: 5.0,
      testimonial: 'The analytics capabilities exceeded our expectations. The intuitive design made onboarding new team members effortless, and the customer support team has been extraordinary in addressing our specific industry needs.'
    },
  ];

  return (
    <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
          Customers Testimonials
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0">
                    <img
                      className="h-14 w-14 rounded-full object-cover border-2 border-yellow-400"
                      src={item.image}
                      alt={item.name}
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.title}</p>
                  </div>
                  <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                    <svg 
                      className="w-5 h-5 text-yellow-400" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-1 font-medium text-gray-900">{item.rating.toFixed(1)}</span>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">"{item.testimonial}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;