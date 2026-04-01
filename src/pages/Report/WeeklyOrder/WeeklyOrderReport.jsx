import { CalendarArrowDown, ClockArrowUp, Shuffle } from "lucide-react";
import React from "react";
import WeeklyOrderChart from "./WeeklyOrderChart";
import WeeklyOrdersPerformances from "./WeeklyOrdersPerformances";

const WeeklyOrderReport = () => {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {[
          {
            icon: (
              <Shuffle
                className="text-green-600 mt-2"
                size={50}
              />
            ),
            label: "Total Orders",
            value: "$400",
          },
          {
            icon: <CalendarArrowDown className="text-green-600 mt-2" size={50} />,
            label: "Completion Orders",
            value: "$800",
          },
          {
            icon: <ClockArrowUp className="text-green-600 mt-2" size={50} />,
            label: "Completed Orders",
            value: "$200",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white flex items-center sm:items-start gap-6 p-4 sm:p-6 rounded-lg border border-gray-200"
          >
            <div>{item.icon}</div>
            <div className="mt-1">
              <span className="block text-gray-600 text-base sm:text-lg font-bold">
                {item.label}
              </span>
              <div className="text-2xl sm:text-3xl font-bold text-gray-800">
                {item.value}
              </div>
            </div>
          </div>
        ))}
      </div>
      <WeeklyOrderChart />
      <WeeklyOrdersPerformances />
    </div>
  );
};

export default WeeklyOrderReport;
