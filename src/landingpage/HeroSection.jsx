import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const images = ["/image/port.jpg", "/image/cargo_ship.jpg", "/image/warehouse.jpg"];

const HeroSection = () => {
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid lg:grid-cols-2 md:grid-cols-2 bg-gray-100 p-10">
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight lg:mt-10">
          Elevate Your e-Commerce <br /> Dropshipping Experience
        </h1>
        <p className="text-gray-600 mt-4 text-sm sm:text-base md:text-lg lg:pr-10">
          At Swift Suite, explore our wide range of products and enjoy 
          unbeatable prices, fast shipping, and a seamless shopping experience 
          every time.
        </p>
        <button
          onClick={() => navigate("signup")}
          className="mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 my-5 px-6 rounded-lg"
        >
          Get Started
        </button>
      </div>

      <div className='flex justify-center items-center md:ms-5'>
        <img
          src={images[currentImage]}
          alt="Dropshipping Experience"
          className="rounded-lg shadow-lg w-full transition-all h-96 duration-500"
        />
      </div>
    </div>
  );
};

export default HeroSection;
