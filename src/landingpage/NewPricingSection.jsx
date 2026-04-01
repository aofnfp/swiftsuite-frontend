import React from 'react';
import { Check } from 'lucide-react';
import { GoCheckCircleFill } from "react-icons/go";


const NewPricingSection = () => {
  const pricingPlans = [
    {
      name: 'Starter',
      nameStyle: 'text-[#BB8232]',
      subtitle: 'Grow and scale your business',
      price: '$149',
      period: 'per organization per month',
      buttonText: 'Choose Plan',
      buttonStyle: 'border border-[#BB8232]  hover:bg-amber-50',
      includes: [
        '1 Integrations',
        '50k SKU Limit',
        '250 Orders Included',
        '$0.50 Additional Orders',
        '2x Daily Sync Frequency',
        'Basic Support',
        'Up to 5 members'
      ],
      features: [
        'Integrate your own vendors',
        'Integrate and manage your own inventory',
        'QuickBooks Sync'
      ],
      iconColor: 'text-[#BB8232]'
    },
    {
      name: 'Growth',
      nameStyle: 'text-[#005D68]',
      subtitle: 'Grow and scale your business',
      price: '$249',
      period: 'per organization per month',
      buttonText: 'Choose Plan',
      buttonStyle: 'border border-[#005D68] hover:bg-teal-50',
      includes: [
        '2 Integrations',
        '250k SKU Limit',
        '500 Orders Included',
        '$0.40 Additional Orders',
        'Optimised Sync Frequency',
        'Priority Support',
        'Up to 10 members'
      ],
      featuresTitle: 'Everything in Starter plus;',
      features: [
        'Vendor SLA Management',
        'Advanced Product Data and Pricing Rules',
        'Custom ERP Connectors'
      ],
      iconColor: 'text-[#005D68]'
    },
    {
      name: 'Enterprise',
      nameStyle: 'text-[#000000]',
      subtitle: 'Grow and scale your business',
      price: '$399',
      period: 'per organization per month',
      buttonText: 'Choose Plan',
      buttonStyle: 'border border-[#000000]  hover:bg-gray-50',
      includes: [
        'Custom Integrations',
        'Custom SKU Volume',
        '1000 Orders Included',
        '$0.30 Additional Orders',
        'Optimised Sync Frequency',
        'Dedicated Account Management',
        'Custom User Count'
      ],
      features: [
        'Enterprise API endpoints',
        'NetSuite Connector',
        'Custom ERP Connectors'
      ],
      iconColor: 'text-[#000000]'
    }
  ];

  return (
    <div className="p-10 bg-white">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Pricing</h2>
        <p className="text-black max-w-lg mx-auto">
          One flat monthly fee. No contracts, no hidden fees, no stress of.
        </p>
        <p className="text-black max-w-lg mx-auto">
        finding a great designer.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-5 mx-20">
        {pricingPlans.map((plan, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-6">
              <h3 className={`text-xl font-semibold mb-2 ${plan.nameStyle}`}>{plan.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{plan.subtitle}</p>
              <div className="flex items-baseline">
              <div className="">
                <div className="text-2xl  text-gray-900"><span className='font-bold text-[30px]'>{plan.price}</span><sup className="text-sm align-super">per organization per month</sup></div>
              </div>

                {/* <span className="text-gray-500 text-sm ml-2"></span> */}
              </div>
            </div>
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Includes</h4>
              <ul className="space-y-2">
                {plan.includes.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    {/* <Check className={`w-4 h-4 mt-0.5 mr-3 flex-shrink-0 ${plan.iconColor}`} /> */}
                    <span className={`${plan.iconColor}`}><GoCheckCircleFill /></span>
                    <span className="text-gray-600 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-8">
              <h4 className="font-semibold text-gray-900 mb-3">
                {plan.featuresTitle || 'Features'}
              </h4>
              <ul className="space-y-1">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 h-10">
                    {/* <Check className={`w-4 h-4 mt-0.5 mr-3 flex-shrink-0 ${plan.iconColor}`} /> */}
                    <span className={`${plan.iconColor}`}><GoCheckCircleFill /></span>
                    <span className="text-gray-600 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${plan.buttonStyle}`}>
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewPricingSection;