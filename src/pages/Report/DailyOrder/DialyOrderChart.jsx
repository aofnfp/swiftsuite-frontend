import React, { useState } from "react";

const DailyOrderChart = () => {
  const [hoverData, setHoverData] = useState(null);

  const chartData = [
    { time: "00:00", timeEnd: "02:00", viewed: 0, sold: 0 },
    { time: "02:00", timeEnd: "04:00", viewed: 500, sold: 200 },
    { time: "04:00", timeEnd: "06:00", viewed: 7000, sold: 3000 },
    { time: "06:00", timeEnd: "08:00", viewed: 15000, sold: 8000 },
    { time: "08:00", timeEnd: "10:00", viewed: 25000, sold: 12000 },
    { time: "10:00", timeEnd: "12:00", viewed: 18000, sold: 9000 },
    { time: "12:00", timeEnd: "14:00", viewed: 10000, sold: 4000 },
    { time: "14:00", timeEnd: "16:00", viewed: 13000, sold: 6000 },
    { time: "16:00", timeEnd: "18:00", viewed: 7000, sold: 3000 },
    { time: "18:00", timeEnd: "20:00", viewed: 16000, sold: 9000 },
    { time: "20:00", timeEnd: "22:00", viewed: 9000, sold: 4000 },
    { time: "22:00", timeEnd: "00:00", viewed: 10000, sold: 5000 },
  ];

  const maxValue = 30000;
  const yAxisLabels = ["30K", "20K", "10K", "0K"];

  return (
    <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg border border-gray-200 w-full my-6 overflow-x-auto relative">

      {/* Tooltip (position: fixed so viewport coords from getBoundingClientRect() work) */}
      {hoverData && (
        <div
          className="fixed bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg pointer-events-none z-50"
          style={{
            top: Math.max(8, hoverData.y - 10) + "px", // place slightly above the bar
            left: hoverData.x + "px",
            transform: "translate(-50%, -100%)",
            whiteSpace: "nowrap"
          }}
        >
          <div className="font-medium">Viewed: {hoverData.viewed}</div>
          <div className="font-medium">Sold: {hoverData.sold}</div>
        </div>
      )}

      <div className="mb-6 sm:mb-8">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
          Orders Statistics
        </h2>
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <span className="text-xs sm:text-sm text-gray-700 flex items-center gap-2">
            <span className="inline-block w-2 h-2 sm:w-2.5 sm:h-2.5 bg-orange-400 rounded-full"></span>
            Completed
          </span>
          <span className="text-xs sm:text-sm text-gray-700 flex items-center gap-2">
            <span className="inline-block w-2 h-2 sm:w-2.5 sm:h-2.5 bg-green-700 rounded-full"></span>
            Cancelled
          </span>
        </div>
        <div className="text-gray-500 text-sm sm:text-base mb-3">
          Orders <span className="text-green-600">up vs 12% yesterday</span>
        </div>
      </div>

      <div className="relative min-w-[600px] sm:min-w-0">
        <div className="absolute left-0 top-0 bottom-10 flex flex-col justify-between text-[10px] sm:text-xs text-gray-400 pr-2 sm:pr-3">
          {yAxisLabels.map((label, i) => (
            <span key={i}>{label}</span>
          ))}
        </div>

        <div className="ml-10 sm:ml-16">
          <div className="relative h-40 sm:h-56 md:h-64 mb-3">
            <div className="absolute inset-0 flex flex-col justify-between">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="border-t border-dashed border-gray-200"
                ></div>
              ))}
            </div>

            {/* Bars */}
            <div className="absolute inset-0 flex items-end justify-between">
              {chartData.map((bar, i) => {
                const viewedHeight = (bar.viewed / maxValue) * 100;
                const soldHeight = (bar.sold / maxValue) * 100;

                return (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center h-full justify-end relative"
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setHoverData({
                        x: rect.left + rect.width / 2,
                        y: rect.top,
                        viewed: bar.viewed,
                        sold: bar.sold,
                      });
                    }}
                    onMouseLeave={() => setHoverData(null)}
                  >
                    {/* Viewed bar: animated via keyframes so it grows on mount */}
                    <div
                      className="md:w-[50px] w-[30px] bg-orange-400 hover:bg-orange-500 rounded-t-sm transition-all duration-700"
                      style={{
                        height: "0%",
                        animation: `grow-viewed-${i} 800ms ease-out forwards`
                      }}
                    ></div>

                    {/* Sold bar */}
                    <div
                      className="md:w-[50px] w-[30px] bg-green-700 hover:bg-green-800 rounded-t-sm -mt-1 transition-all duration-700"
                      style={{
                        height: "0%",
                        animation: `grow-sold-${i} 900ms ease-out forwards`,
                        animationDelay: "120ms"
                      }}
                    ></div>

                    {/* Keyframes injected per-bar (unique names avoid clashes) */}
                    <style>
                      {`
                        @keyframes grow-viewed-${i} {
                          from { height: 0%; }
                          to { height: ${viewedHeight}% ; }
                        }
                        @keyframes grow-sold-${i} {
                          from { height: 0%; }
                          to { height: ${soldHeight}% ; }
                        }
                      `}
                    </style>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-gray-400">
            {chartData.map((bar, i) => (
              <div key={i} className="flex-1 text-center leading-tight">
                <div>{bar.time}</div>
                <div>{bar.timeEnd}</div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default DailyOrderChart;
