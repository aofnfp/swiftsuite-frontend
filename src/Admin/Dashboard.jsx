import React from "react";
import BarChart from "./BarChart";
import TopUsers from "./TopUsers";
import ManualInventoryOrder from "./ManualInventoryOrder";

const stats = [
  { title: "Total Revenue", value: 12500, isMoney: true, percent: 25 },
  { title: "Total Listings", value: 340, isMoney: false, percent: 10 },
  { title: "Saved Listings", value: 120, isMoney: false, percent: 5 },
  { title: "Orders", value: 560, isMoney: false, percent: 15 },
  { title: "Active Vendors", value: 32, isMoney: false, percent: 8 },
  { title: "Active Marketplaces", value: 12, isMoney: false, percent: 20 },
];

const Dashboard = () => {
  return (
    <div className="p-6 bg-[#E7F2ED] min-h-screen flex flex-col gap-10">
      <h1 className="text-2xl font-bold mb-6">Dashboard Admin</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const isLastTwo = index >= stats.length - 2;

          return (
            <div
              key={index}
              className={`border border-[#02784033] rounded-lg p-6 flex flex-col justify-between transition-shadow duration-300 bg-white text-gray-900`}
            >
              <h2 className="font-medium text-gray-500">{stat.title}</h2>
              <p className="text-2xl font-bold mt-2">
                {stat.isMoney ? `$${stat.value.toLocaleString()}` : stat.value}
              </p>
              <p
                className={`mt-4 text-sm ${
                  stat.percent >= 0 ? "text-[#027840]" : "text-red-500"
                }`}
              >
                {stat.percent >= 0 ? `▲` : `▼`} {stat.percent}% from last month
              </p>
            </div>
          );
        })}
      </div>

      <section>
        <BarChart />
      </section>
      <section>
        <TopUsers />
      </section>
    </div>
  );
};

export default Dashboard;
