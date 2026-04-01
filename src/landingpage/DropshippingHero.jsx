import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import Woman_holding_shirts from '../Images/Woman_holding_shirts.png';
import bottle from '../Images/bottle.png';
import E_Commerce_website from '../Images/E_Commerce_website.png';
import dooze from '../Images/dooze.png'
import logistic from '../Images/logistic.png';
import ship from '../Images/ship.png';
import drop from '../Images/drop.png';
import leather from '../Images/leather.png';
import wrist_watch from '../Images/wrist_watch.png';


const DropshippingHero = () => {
  const sectionSlides = [
    [logistic, ship, drop],
    [leather, wrist_watch, dooze],
    [Woman_holding_shirts, bottle, E_Commerce_website],
  ];

  const renderSwiperSection = (slides) => (
    <Swiper
      spaceBetween={30}
      slidesPerView={1}
      loop={true}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      modules={[Autoplay, Pagination]}
      className="mt-10"
    >
      {slides.map((group, index) => (
        <SwiperSlide key={index}>
          <div className="flex flex-wrap justify-center gap-6">
            {group.map((img, idx) => (
              <div
                key={idx}
                className="w-full sm:w-80 md:w-96 lg:w-[420px] rounded-lg overflow-hidden shadow-md bg-gray-200"
              >
                <div className="relative" style={{ height: '360px' }}>
                  <img
                    src={img}
                    alt={`Slide ${index + 1} - Image ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );

  return (
    <div className="bg-white py-12 space-y-20">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Your Ultimate Dropshipping<br />Solution Starts Here
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Sell online and in person. Sell locally and globally. Sell direct and wholesale.
        </p>
      </div>
      <div className="w-full  mx-auto">
        {renderSwiperSection(sectionSlides)}
      </div>
    </div>
  );
};

export default DropshippingHero;
