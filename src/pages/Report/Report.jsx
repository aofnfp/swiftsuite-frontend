import React, { useState } from "react";
import item from "./data";
import InventoryReport from "./InventoryReport";
import OrderReport from "./OrderReport";
import SalesReport from "./SalesReport";

const Report = () => {
  const [reports, setReports] = useState("home");

  return (
    <>
      {reports === "home" && (
        <div className="mt-14">
          <h1 className="font-bold text-3xl text-gray-800 bg-white p-5">
            Reports
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 px-4 sm:px-10 md:px-20 lg:px-32 mt-10">
            {item.map((report) => (
              <div
                key={report.id}
                className="bg-white w-full max-w-[20rem] mx-auto rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col"
              >
                <div className="w-full h-60 flex items-center justify-center">
                  <img
                    src={report.logo}
                    alt={report.title}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="px-6 pb-6 pt-4 flex flex-col flex-grow min-h-60">
                  <h2 className="font-semibold text-xl text-gray-800 mb-2">
                    {report.title}
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed flex-grow mb-4">
                    {report.description}
                  </p>
                  <button
                    onClick={() => setReports(report.title.toLowerCase())}
                    className={`bg-[#027840] hover:opacity-90 text-white font-medium px-5 py-2.5 rounded-md transition-all duration-200 w-full`}
                  >
                    {report.buttonText}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {reports === "sales" && <SalesReport onBack={() => setReports("home")} />}
      {reports === "inventory" && (
        <InventoryReport onBack={() => setReports("home")} />
      )}
      {reports === "orders" && (
        <OrderReport onBack={() => setReports("home")} />
      )}
    </>
  );
};

export default Report;
