import React, { useState } from "react";
import EditProfile from "./EditProfile";
import Notification from "./Notification";
import Password from "./Password";
import { IoIosNotificationsOutline } from "react-icons/io";
import { PiLockKeyLight } from "react-icons/pi";
import { FaRegUser } from "react-icons/fa";



const Parent = () => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="flex flex-col h-screen pt-[60px]  bg-[#f2f2f2] px-5">
      <h1 className="text-xl font-bold mt-5">Settings</h1>
      <div className="flex  gap-4 my-5">
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4  rounded-lg font-medium transition flex justify-center items-center gap-2 ${
            activeTab === "profile"
              ? "bg-[#027840] text-white"  
              : "border border-[#00000033] text-gray-500"
          }`}
        >
          <FaRegUser />
          Profile
        </button>
        <button
          onClick={() => setActiveTab("notifications")}
          className={`px-4 py-2 rounded-lg font-medium transition flex justify-center items-center gap-2 ${
            activeTab === "notifications"
              ? "bg-[#027840] text-white"
              : "border border-[#00000033] text-gray-500"
          }`}
        >
          <IoIosNotificationsOutline  size={20}/>
          Notifications
        </button>
        <button
          onClick={() => setActiveTab("password")}
          className={`px-4 py-2 rounded-lg font-medium transition flex justify-center items-center gap-2 ${
            activeTab === "password"
              ? "bg-[#027840] text-white"
              : "border border-[#00000033] text-gray-500"
          }`}
        >
          <PiLockKeyLight  size={20}/>
          Change Password
        </button>
      </div>

      {/* Main Content */}
      <div className=" overflow-y-auto md:w-3/4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#f2f2f2]">
        {activeTab === "profile" && <EditProfile />}
        {activeTab === "notifications" && <Notification />}
        {activeTab === "password" && <Password />}
      </div>
    </div>
  );
};

export default Parent;
