import React from 'react'
import { CgNotes } from "react-icons/cg";
import { AiFillInfoCircle } from "react-icons/ai";
import { FaFileInvoiceDollar } from "react-icons/fa6";
import { GrResources } from "react-icons/gr";
import { Link } from 'react-router-dom';

const blogCard = [
  {
    link: '/aboutus',
    icon: <AiFillInfoCircle size={30} />,
    head: 'About Swift Suite',
    Date: 'April 22, 2024',
    details: 'Learn more about Swift Suite and how our platform simplifies dropshipping operations for entrepreneurs'
  },
  {
    link: '/pricing',
    icon: <FaFileInvoiceDollar size={30}/>,
    head: 'Our Pricing plans',
    Date: 'April 22, 2024',
    details: 'Explore our flexible pricing plans designed to meet needs of dropshipping businesses of all sizes'
  },
  {
    link: '/aboutus',
    icon: <GrResources size={30} />,
    head: 'Dropshipping Resources',
    Date: 'April 22, 2024',
    details: 'Explore our flexible pricing plans designed to meet needs of dropshipping businesses of all sizes'
  }
];

const Blog = () => {
  return (
    <div className="lg:p-6 bg-[#E7F2ED] md:h-screen">
      <section className='flex flex-col bg-white lg:mx-[10rem] md:mx-[5rem] mx-10  h-full rounded-[10px]'>
      <div className="gap-3 mb-6  flex items-center bg-[#E0F5E3] py-5 lg:px-[10rem] md:px-[5rem] px-5">
        <CgNotes className="text-2xl text-[#027840]" size={44}/>
        <div>
          <h1 className="text-2xl font-bold">Blog</h1>
          <p className="text-gray-600">
            Insights and resources to help you optimize and grow your dropshipping business
          </p>
        </div>
      </div>
    
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:px-20 px-5 py-7">
        {blogCard.map((item, index) => (
          <Link
            to={item.link}
            key={index}
            className="flex flex-col p-4  rounded-2xl shadow-[0px_4px_25px_0px_#0000000D] transition"
            >
            <div className="mb-2 text-[#027840]">{item.icon}</div>
            <h2 className="text-lg font-semibold">{item.head}</h2>
            <p className="text-sm text-gray-500">{item.Date}</p>
            <p className="mt-2 text-gray-700 w-2/3">{item.details}</p>
          </Link>
        ))}
      </div>
        </section>
    </div>
  );
};

export default Blog;
