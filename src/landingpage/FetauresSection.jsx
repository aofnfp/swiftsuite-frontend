import React from 'react';
import { Database, Box, BarChart2, ListFilter, Send } from 'lucide-react';

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg border border-gray-100 h-full flex flex-col">
      <div className="mb-4 text-emerald-600">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-gray-800">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed flex-grow">{description}</p>
    </div>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      icon: <Database size={24} />,
      title: "Full Product Data Integration",
      description: "Automatically upload comprehensive product data from various suppliers into your eCommerce store. Effortlessly manage images, descriptions, and other essential details."
    },
    {
      icon: <ListFilter size={24} />,
      title: "Intelligent Order Routing",
      description: "Streamline order processing by automatically routing orders to the best-suited supplier. Our intelligent system ensures orders are directed to suppliers with the product in stock and the lowest cost."
    },
    {
      icon: <Box size={24} />,
      title: "Multiple Supplier Integration",
      description: "Connect one product to multiple suppliers and intelligently route orders to the best possible supplier. This ensures optimal fulfillment and customer satisfaction."
    },
    {
      icon: <BarChart2 size={24} />,
      title: "Synchronized Inventory Management",
      description: "Keep your inventory in sync with all vendors. Swift Suite processes feeds from suppliers and updates your inventory in real-time, ensuring accurate stock levels across all platforms."
    },
    {
      icon: <Send size={24} />,
      title: "Automated Order Processing",
      description: "Automate the routing of orders to vendors, distributors, suppliers, or fulfillment centers. Whether through email, EDI, FTP, CSV, XML, etc., Swift Suite supports any format your vendor requires."
    }
  ];

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Key Features</h2>
          <div className="w-24 h-1 bg-emerald-500 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;