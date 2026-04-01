import React from 'react';
import './SkeletonLoader.css'; 

function CatalogueSkeleton() {
  return (
    <div className="flex items-center my-5 relative group rounded-[8px] border border-[#005D6833] md:px-2 lg:mx-0 mx-2 bg-white animate-pulse">
      <div className="mr-2 w-4 h-4 bg-gray-300 rounded"></div>
      <div className="grid grid-cols-12 py-3 w-full text-sm rounded-r-xl md:mx-0 bg-white">
        <div className="flex justify-between items-center lg:col-span-6 md:col-span-5 col-span-2">
          <div className="w-40 h-28 bg-gray-300 rounded-md"></div>
          <div className="lg:ms-8 md:mx-5 mx-0 md:flex flex-wrap gap-2 w-full hidden">
            <div className="font-bold md:text-[1.1rem] w-full h-5 bg-gray-300 rounded mb-2"></div>
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="flex w-full gap-2 mb-1">
                <div className="md:w-[5rem] w-[6rem] h-4 bg-gray-300 rounded"></div>
                <div className="md:w-2/3 w-[8rem] h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
        <div className="border-[3px] border-[#027840] md:px-2 flex flex-col gap-3 justify-center items-center lg:col-span-2 md:col-span-3 col-span-4 md:py-5 m-0 rounded-[8px]">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="w-20 h-4 bg-gray-300 rounded mb-2"></div>
          ))}
        </div>
        <div className="md:p-3 p-2 flex rounded-xl lg:col-span-4 md:col-span-4 col-span-6">
          <div className="hidden md:flex flex-col justify-center text-sm items-center text-center mx-auto w-full">
            <div className="font-bold w-24 h-4 bg-gray-300 rounded mb-2"></div>
            <div className="w-full h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CatalogueSkeleton;

