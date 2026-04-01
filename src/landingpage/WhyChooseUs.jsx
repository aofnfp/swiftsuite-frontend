import React from 'react';
import usa from '../Images/usa.png';
import luxury from '../Images/luxury.png';
import progress from '../Images/progress.png';
import efficiency from '../Images/efficiency.png';

const WhyChooseUs = () => {
  return (
    <div className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            className="relative rounded-lg shadow-lg overflow-hidden h-80"
            style={{
              backgroundImage: `url(${usa})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            <div className="relative h-full p-6 flex flex-col justify-between z-10">
              <h3 className="text-xl font-bold text-white mb-2">Versatility</h3>
              <p className="text-white text-sm">
                Swift Suite supports a variety of platforms, catering to the diverse needs of eCommerce merchants.
              </p>
            </div>
          </div>
          <div 
            className="relative rounded-lg shadow-lg overflow-hidden h-80"
            style={{
              backgroundImage: `url(${efficiency})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            <div className="relative h-full p-6 flex flex-col justify-between z-10">
              <h3 className="text-xl font-bold text-white mb-2">Efficiency</h3>
              <p className="text-white text-sm">
                With features inspired by successful solutions like Spark Shipping and Inventory Source, Swift Suite ensures your operations are streamlined, saving time and resources.
              </p>
            </div>
          </div>
          <div 
            className="relative rounded-lg shadow-lg overflow-hidden h-80"
            style={{
              backgroundImage: `url(${luxury})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            <div className="relative h-full p-6 flex flex-col justify-between z-10">
              <h3 className="text-xl font-bold text-white mb-2">Simplify Inventory Oversight</h3>
              <p className="text-white text-sm">
                Our integrated system brings together the dashboard, catalog, and reports for seamless inventory oversight. Say goodbye to complexity and hello to streamlined control.
              </p>
            </div>
          </div>
          <div 
            className="relative rounded-lg shadow-lg overflow-hidden h-80"
            style={{
              backgroundImage: `url(${progress})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            <div className="relative h-full p-6 flex flex-col justify-between z-10">
              <h3 className="text-xl font-bold text-white mb-2">Achieve Progress, Track Success</h3>
              <p className="text-white text-sm">
                Track your business's journey to success through our user-friendly dashboard, comprehensive catalog management, and insightful reports. Your progress, your way.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
