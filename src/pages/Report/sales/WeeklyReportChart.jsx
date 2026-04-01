import React, { useState } from "react";

const WeeklyReportChart = () => {
  const [hoverData, setHoverData] = useState(null);

  const chartData = [
    { date: "Sept 25", viewed: 10000, sold: 20000 },
    { date: "Sept 26", viewed: 500, sold: 200 },
    { date: "Sept 27", viewed: 7000, sold: 300 },
    { date: "Sept 28", viewed: 15000, sold: 800 },
    { date: "Sept 29", viewed: 25000, sold: 1200 },
    { date: "Sept 30", viewed: 18000, sold: 9000 },
    { date: "Oct 01", viewed: 10000, sold: 4000 },
    { date: "Oct 02", viewed: 13000, sold: 6000 },
    { date: "Oct 03", viewed: 7000, sold: 3000 },
    { date: "Oct 04", viewed: 16000, sold: 9000 },
    { date: "Oct 05", viewed: 9000, sold: 40 },
    { date: "Oct 06", viewed: 1000, sold: 50 },
  ];

  const maxValue = 25000;
  const yAxisLabels = ["$2,000", "$1,500", "$1,000", "$500"];

  return (
    <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg border border-gray-200 w-full my-6">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
          Total Revenue
        </h2>
        <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
          $23
        </div>
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <span className="text-xs sm:text-sm text-gray-700 flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 bg-green-600 rounded-full"></span>
            Profit
          </span>
          <span className="text-xs sm:text-sm text-gray-700 flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 bg-green-200 rounded-full"></span>
            Previous day's profit
          </span>
        </div>
      </div>

      {/* 🔵 TOOLTIP */}
      {hoverData && (
        <div
          className="absolute bg-white shadow-lg border text-xs px-3 py-2 rounded-md z-50"
          style={{
            top: hoverData.y - 50,
            left: hoverData.x - 30,
          }}
        >
          <div className="font-semibold text-gray-800">{hoverData.date}</div>
          <div className="text-green-600 font-medium">Viewed: {hoverData.viewed}</div>
          <div className="text-green-800 font-medium">Sold: {hoverData.sold}</div>
        </div>
      )}

      <div className="relative overflow-x-auto">
        <div className="min-w-[600px] sm:min-w-full relative">
          
          {/* Y-Axis labels */}
          <div className="absolute left-0 top-0 bottom-10 flex flex-col justify-between text-[10px] sm:text-xs text-gray-400 pr-2 sm:pr-3">
            {yAxisLabels.map((label, i) => (
              <span key={i}>{label}</span>
            ))}
          </div>

          <div className="ml-10 sm:ml-16">
            <div className="relative h-48 sm:h-56 mb-3">

              {/* Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="border-t border-dashed border-gray-200"></div>
                ))}
              </div>

              {/* Bars */}
              <div className="absolute inset-0 flex items-end justify-between gap-4 sm:gap-6 md:gap-8">

                {chartData.map((bar, i) => {
                  const viewedHeight = (bar.viewed / maxValue) * 100;
                  const soldHeight = (bar.sold / maxValue) * 100;

                  return (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center h-full justify-end min-w-[16px] sm:min-w-[20px] relative"
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setHoverData({
                          x: rect.left + rect.width / 2,
                          y: rect.top,
                          ...bar
                        });
                      }}
                      onMouseLeave={() => setHoverData(null)}
                    >
                      {/* 🔵 Viewed bar (animated) */}
                      <div
                        className="md:w-[50px] w-[30px] bg-green-200 hover:bg-green-300 rounded-t-sm transition-all duration-500 ease-out"
                        style={{
                          height: "0%",
                          animation: `grow-viewed-${i} 1s ease-out forwards`
                        }}
                      ></div>

                      {/* 🔵 Sold bar (animated) */}
                      <div
                        className="md:w-[50px] w-[30px] bg-green-600 hover:bg-green-700 rounded-t-sm -mt-1 transition-all duration-500 ease-out"
                        style={{
                          height: "0%",
                          animation: `grow-sold-${i} 1s ease-out forwards`,
                          animationDelay: "0.2s"
                        }}
                      ></div>

                      {/* Inline animation keyframes */}
                      <style>
                        {`
                          @keyframes grow-viewed-${i} {
                            from { height: 0%; }
                            to { height: ${viewedHeight}% }
                          }
                          @keyframes grow-sold-${i} {
                            from { height: 0%; }
                            to { height: ${soldHeight}% }
                          }
                        `}
                      </style>
                    </div>
                  );
                })}

              </div>
            </div>

            {/* X-Axis labels */}
            <div className="flex justify-between gap-4 sm:gap-6 md:gap-8 text-[10px] sm:text-xs text-gray-400">
              {chartData.map((bar, i) => (
                <div key={i} className="flex-1 text-center leading-tight whitespace-nowrap">
                  {bar.date}
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyReportChart;  