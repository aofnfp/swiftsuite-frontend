import React, { useState } from "react";
import { FiCalendar } from "react-icons/fi";

const data = [
  { month: "Jan", value: 60 },
  { month: "Feb", value: 90 },
  { month: "Mar", value: 120 },
  { month: "Apr", value: 80 },
  { month: "May", value: 140 },
  { month: "Jun", value: 100 },
  { month: "Jul", value: 160 },
  { month: "Aug", value: 130 },
  { month: "Sep", value: 110 },
  { month: "Oct", value: 150 },
  { month: "Nov", value: 95 },
  { month: "Dec", value: 170 },
];

const filters = ["Last 30 days", "Last 4 months", "Last year"];

const CHART_HEIGHT = 160;
const GRID_VALUES = [160, 120, 80, 40];
const MAX_GRID = 160;
const MIN_GRID = 40;
const Y_AXIS_WIDTH = 32;

const BarChart = () => {
  const [selected, setSelected] = useState(filters[0]);
  const [open, setOpen] = useState(false);

  const getPosition = (value) =>
    CHART_HEIGHT -
    ((value - MIN_GRID) / (MAX_GRID - MIN_GRID)) * CHART_HEIGHT;

  const getBarHeight = (value) => {
    const clamped = Math.min(value, MAX_GRID);
    return (
      ((clamped - MIN_GRID) / (MAX_GRID - MIN_GRID)) *
      CHART_HEIGHT
    );
  };

  return (
    <div className="bg-white shadow border rounded-xl p-4 sm:p-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
        <div>
          <p className="text-xs sm:text-sm text-gray-500">Users</p>
          <h2 className="text-xl sm:text-2xl font-semibold">12,450</h2>
          <p className="text-xs sm:text-sm text-green-600">
            +5% from last month
          </p>
        </div>

        {/* Dropdown */}
        <div className="relative w-full sm:w-auto">
          <div
            onClick={() => setOpen(!open)}
            className="flex items-center justify-between gap-2 border border-gray-300 rounded-lg px-3 py-2 text-sm cursor-pointer w-full sm:w-auto"
          >
            <div className="flex items-center gap-2">
              <FiCalendar className="text-gray-500" />
              <span>{selected}</span>
            </div>
          </div>

          {open && (
            <div className="absolute right-0 mt-2 w-full sm:w-40 bg-white border rounded-lg shadow-sm z-20">
              {filters.map((item) => (
                <div
                  key={item}
                  onClick={() => {
                    setSelected(item);
                    setOpen(false);
                  }}
                  className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chart Wrapper (scrolls on small screens) */}
      <div className="overflow-x-auto">
        <div className="min-w-[520px]">
          <div className="flex">
            {/* Y Axis */}
            <div
              className="relative pr-3 text-xs text-gray-400"
              style={{ height: CHART_HEIGHT, width: Y_AXIS_WIDTH }}
            >
              {GRID_VALUES.map((val) => (
                <span
                  key={val}
                  className="absolute right-0 -translate-y-1/2"
                  style={{ top: getPosition(val) }}
                >
                  {val}
                </span>
              ))}
            </div>

            {/* Chart Area */}
            <div className="w-full">
              <div
                className="relative flex items-end gap-3 sm:gap-4"
                style={{ height: CHART_HEIGHT }}
              >
                {/* Grid Lines */}
                {GRID_VALUES.map((val) => (
                  <div
                    key={val}
                    className="absolute border-t border-gray-200"
                    style={{
                      top: getPosition(val),
                      left: 0,
                      right: 0,
                    }}
                  />
                ))}

                {/* Bars */}
                {data.map((item) => (
                  <div
                    key={item.month}
                    className="flex-1 flex justify-center z-10"
                  >
                    <div
                      className="w-4 sm:w-6 rounded-md flex items-end"
                      style={{
                        height: CHART_HEIGHT,
                        backgroundColor: "#B4DDCA33",
                      }}
                    >
                      <div
                        className="w-full rounded-md transition-all"
                        style={{
                          height: getBarHeight(item.value),
                          background:
                            "linear-gradient(180deg, #027840 0%, #04DE76 100%)",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Months */}
              <div className="flex gap-3 sm:gap-4 mt-2">
                {data.map((item) => (
                  <div key={item.month} className="flex-1 text-center">
                    <span className="text-[10px] sm:text-xs text-gray-500">
                      {item.month}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarChart;
