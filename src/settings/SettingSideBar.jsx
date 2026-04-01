import React from "react";

const SettingSideBar = ({ activeTab, setActiveTab }) => {
  return (
    <div className="w-64 h-screen bg-[#027840] shadow-lg p-4 text-white">
      {/* <h2 className="text-xl font-bold mb-6">Settings</h2> */}

      <ul className="space-y-4">
        <li
          onClick={() => setActiveTab("profile")}
          className={`cursor-pointer p-2 rounded-lg font-semibold ${
            activeTab === "profile"
              ? "bg-white text-[#027840]"
              : "hover:bg-white hover:text-[#027840] font-semibold"
          }`}
        >
          Profile
        </li>
        <li
          onClick={() => setActiveTab("notifications")}
          className={`cursor-pointer p-2 rounded-lg  font-semibold ${
            activeTab === "notifications"
              ? "bg-white text-[#027840]"
              : "hover:bg-white hover:text-[#027840]"
          }`}
        >
          Notifications
        </li>
      </ul>
    </div>
  );
};

export default SettingSideBar;
