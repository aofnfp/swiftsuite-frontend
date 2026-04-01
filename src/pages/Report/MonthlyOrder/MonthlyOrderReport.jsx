import { BookX, CalendarCheck2, ListOrdered } from "lucide-react";
import MonthlyOrderChart from "./MonthlyOrderChart";
import Performances from "./Performances";

const MonthlyOrderReport = () => {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {[
          {
            icon: (
              <ListOrdered
                className="text-green-600 mt-2"
                size={50}
              />
            ),
            label: "Total Orders",
            value: "$2000",
          },
          {
            icon: <CalendarCheck2 className="text-green-600 mt-2" size={50} />,
            label: "Completion Orders",
            value: "$1500",
          },
          {
            icon: <BookX className="text-green-600 mt-2" size={50} />,
            label: "Completed Orders",
            value: "$1900",
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
      <MonthlyOrderChart />
      <Performances />
    </div>
  );
};

export default MonthlyOrderReport;
