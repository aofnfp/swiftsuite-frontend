import React, { useState } from "react";

const MonthlyOrderChart = () => {
  const [hoverData, setHoverData] = useState(null);

  const chartData = [
    { date: "Jan", completed: 10000, canceled: 20000 },
    { date: "Feb", completed: 500, canceled: 200 },
    { date: "Mar", completed: 7000, canceled: 300 },
    { date: "Apr", completed: 15000, canceled: 800 },
    { date: "May", completed: 25000, canceled: 1200 },
    { date: "Jun", completed: 18000, canceled: 9000 },
    { date: "Jul", completed: 10000, canceled: 4000 },
    { date: "Aug", completed: 13000, canceled: 6000 },
    { date: "Sep", completed: 7000, canceled: 3000 },
    { date: "Oct", completed: 16000, canceled: 9000 },
    { date: "Nov", completed: 9000, canceled: 40 },
    { date: "Dec", completed: 1000, canceled: 50 },
  ];

  const maxValue = 30000; // increased so bars scale correctly
  const yAxisLabels = ["30K", "20K", "10K", "0K"];

  return (
    <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg border border-gray-200 w-full my-6 relative">

      {/* Tooltip */}
      {hoverData && (
        <div
          className="fixed bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg pointer-events-none z-50"
          style={{
            top: Math.max(8, hoverData.y - 10),
            left: hoverData.x,
            transform: "translate(-50%, -100%)",
            whiteSpace: "nowrap",
          }}
        >
          <div>Completed: {hoverData.completed}</div>
          <div>Canceled: {hoverData.canceled}</div>
        </div>
      )}

      <div className="mb-6 sm:mb-8">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
          Order Statistics
        </h2>
        <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
          $23
        </div>
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <span className="text-xs sm:text-sm text-gray-700 flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 bg-green-600 rounded-full"></span>
            Completed
          </span>
          <span className="text-xs sm:text-sm text-gray-700 flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 bg-orange-300 rounded-full"></span>
            Canceled
          </span>
        </div>
      </div>

      <div className="relative overflow-x-auto">
        <div className="min-w-[700px] sm:min-w-full relative">

          <div className="absolute left-0 top-0 bottom-10 flex flex-col justify-between text-[10px] sm:text-xs text-gray-400 pr-2 sm:pr-3">
            {yAxisLabels.map((label, i) => (
              <span key={i}>{label}</span>
            ))}
          </div>

          <div className="ml-10 sm:ml-16">
            <div className="relative h-48 sm:h-56 mb-3">
              <div className="absolute inset-0 flex flex-col justify-between">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="border-t border-dashed border-gray-200"
                  ></div>
                ))}
              </div>

              <div className="absolute inset-0 flex items-end justify-between gap-4 sm:gap-6 md:gap-8">
                {chartData.map((bar, i) => {
                  const completedHeight = (bar.completed / maxValue) * 100;
                  const canceledHeight = (bar.canceled / maxValue) * 100;

                  return (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center h-full justify-end min-w-[16px] sm:min-w-[20px]"
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setHoverData({
                          x: rect.left + rect.width / 2,
                          y: rect.top,
                          completed: bar.completed,
                          canceled: bar.canceled,
                        });
                      }}
                      onMouseLeave={() => setHoverData(null)}
                    >
                      {/* Completed (green) */}
                      <div
                        className="md:w-[50px] w-[30px] bg-green-600 rounded-t-sm"
                        style={{
                          height: "0%",
                          animation: `grow-completed-${i} 800ms ease-out forwards`,
                        }}
                      ></div>

                      {/* Canceled (orange) */}
                      <div
                        className="md:w-[50px] w-[30px] bg-orange-300 rounded-t-sm -mt-1"
                        style={{
                          height: "0%",
                          animation: `grow-canceled-${i} 900ms ease-out forwards`,
                          animationDelay: "100ms",
                        }}
                      ></div>

                      {/* Keyframes */}
                      <style>
                        {`
                          @keyframes grow-completed-${i} {
                            from { height: 0%; }
                            to { height: ${completedHeight}%; }
                          }
                          @keyframes grow-canceled-${i} {
                            from { height: 0%; }
                            to { height: ${canceledHeight}%; }
                          }
                        `}
                      </style>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between gap-4 sm:gap-6 md:gap-8 text-[10px] sm:text-xs text-gray-400">
              {chartData.map((bar, i) => (
                <div
                  key={i}
                  className="flex-1 text-center leading-tight whitespace-nowrap"
                >
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

export default MonthlyOrderChart;
