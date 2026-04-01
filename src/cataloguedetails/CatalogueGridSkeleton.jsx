import react from 'react';

const CatalogueGridSkeleton = () => {
  return (
    <div className="grid gap-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-1 my-10">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="grid grid-cols-12 items-center">
          {/* Checkbox skeleton */}
          <div className="w-4 h-4 rounded border border-green-400 bg-gray-300 animate-pulse mr-2 col-span-1" />

          {/* Product card skeleton */}
          <div className="col-span-11 flex flex-col gap-2 items-center shadow-xl relative group rounded-xl bg-white lg:w-[200px] md:h-[346px] pb-[25%] overflow-hidden">
            {/* Brand tag */}
            <div className="ml-auto w-[6rem] h-6 bg-green-300 rounded-tr-xl rounded-l-[10px] animate-pulse mt-2 mr-2" />

            {/* Image block */}
            <div className="flex justify-center items-center mt-4">
              <div className="h-[5rem] w-[4rem] bg-gray-300 rounded-xl animate-pulse" />
            </div>

            {/* Title */}
            <div className="w-[80%] h-4 bg-gray-200 rounded animate-pulse mt-2" />
            <div className="w-[60%] h-4 bg-gray-200 rounded animate-pulse" />

            {/* SKU / Type */}
            <div className="w-full px-2 grid grid-cols-12 gap-2 mt-2">
              <div className="col-span-6 space-y-2">
                <div className="h-3 w-12 bg-green-300 rounded animate-pulse" />
                <div className="h-3 w-20 bg-gray-300 rounded animate-pulse" />
              </div>
              <div className="col-span-6 space-y-2 text-center">
                <div className="h-3 w-20 bg-green-300 rounded animate-pulse mx-auto" />
                <div className="h-3 w-24 bg-gray-300 rounded animate-pulse mx-auto" />
              </div>
            </div>

            {/* Footer (price, qty, upc) */}
            <div className="absolute bottom-0 px-2 py-2 bg-green-200 w-full h-[25%] flex flex-col justify-between animate-pulse">
              <div className="flex justify-between text-xs">
                <div>
                  <div className="h-3 w-10 bg-gray-300 rounded mb-1" />
                  <div className="h-3 w-16 bg-gray-200 rounded" />
                </div>
                <div>
                  <div className="h-3 w-14 bg-gray-300 rounded mb-1" />
                  <div className="h-3 w-10 bg-gray-200 rounded" />
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-3 w-10 bg-gray-300 rounded mb-1" />
                <div className="h-3 w-20 bg-gray-200 rounded" />
              </div>
            </div>

            {/* Dots action */}
            <div className="absolute top-20 right-2">
              <div className="w-6 h-6 bg-gray-300 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
export default CatalogueGridSkeleton;