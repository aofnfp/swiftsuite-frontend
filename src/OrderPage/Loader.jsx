import React from "react";

const Loader = () => {
  return (
      <div className="">
        <div className="overflow-x-auto p-5 rounded-lg shadow-lg mb-10 bg-white mx-5">
          <div className="flex justify-between mb-4">
            <div className="flex gap-3">
              <div className="h-6 w-16 bg-gray-200 rounded"></div>
              <div className="h-8 w-40 bg-gray-200 rounded"></div>
            </div>
            <div className="h-8 w-32 bg-gray-200 rounded"></div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border-collapse">
              <thead>
                <tr>
                  {Array.from({ length: 7 }).map((_, index) => (
                    <th
                      key={index}
                      className="border-b border-gray-200 px-6 py-3 text-left bg-gray-50"
                    >
                      <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 10 }).map((_, rowIndex) => (
                  <tr key={rowIndex}>
                    {Array.from({ length: 7 }).map((_, colIndex) => (
                      <td
                        key={colIndex}
                        className="border-b border-gray-200 px-6 py-4 text-left"
                      >
                        <div className="h-4 w-full bg-gray-200 rounded"></div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex lg:flex-row md:flex-col flex-col justify-between mt-4 items-center">
            <div className="h-4 w-40 bg-gray-200 rounded"></div>
            <div className="flex gap-3 items-center">
              <div className="h-8 w-24 bg-gray-200 rounded"></div>
              <div className="h-8 w-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Loader;
