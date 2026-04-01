import React from 'react';

const ChooseUs = () => {
  const benefits = [
    {
      id: '01',
      title: 'Versatility',
      description: 'Swift Suite supports a variety of platforms, catering to the diverse needs of eCommerce merchants.',
      color: 'bg-green-600'
    },
    {
      id: '02',
      title: 'Efficiency',
      description: 'Swift Suite supports a variety of platforms, catering to the diverse needs of eCommerce merchants.',
      color: 'bg-amber-600'
    },
    {
      id: '03',
      title: 'Simplify Inventory Oversight',
      description: 'Swift Suite supports a variety of platforms, catering to the diverse needs of eCommerce merchants.',
      color: 'bg-teal-400'
    },
    {
      id: '04',
      title: 'Achieve Progress, Track Success',
      description: 'Swift Suite supports a variety of platforms, catering to the diverse needs of eCommerce merchants.',
      color: 'bg-teal-700'
    }
  ];

  return (
    <div className="p-8 bg-gray-50">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
        Why Chose Us?
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {benefits.map((benefit, index) => (
          <div key={benefit.id} className="flex flex-col items-center text-center px-10">
            <div className={`${benefit.color} text-white py-3 rounded-full font-semibold text-sm mb-6 w-full`}>
              {benefit.title}
            </div>
            <div className="w-px h-20 mb-4 border border-dashed border-gray-700"></div>
            <div className="w-12 h-12 rounded-full border-2 border-teal-400 flex items-center justify-center text-teal-400 font-bold text-lg mb-6">
              {benefit.id}
            </div>
            <p className="text-green-600 text-sm leading-relaxed max-w-xs">
              {benefit.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChooseUs;