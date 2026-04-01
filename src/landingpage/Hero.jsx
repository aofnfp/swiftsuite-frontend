import React from 'react';
import landingpage from '../Images/landingpage.png';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-[80vh]">
      <img
        src={landingpage}
        alt="Landing Page"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 flex flex-col justify-center items-start px-6 sm:px-12 bg-black bg-opacity-30">
        <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
          Elevate Your e-Commerce <br /> Dropshipping Experience
        </h1>
        <p className="text-white mt-4 text-sm sm:text-base md:text-lg max-w-xl">
          At Swift Suite, explore our wide range of products and enjoy 
          unbeatable prices, fast shipping, and a seamless shopping experience 
          every time.
        </p>
        <button
          onClick={() => navigate('signup')}
          className="mt-6 bg-green-800 text-white font-semibold py-3 px-10 rounded-lg hover:border"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Hero;
