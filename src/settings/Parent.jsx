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
    <div className="flex min-h-screen flex-col bg-[#f2f2f2] px-3 pt-[60px] sm:px-4 md:px-5">
      <h1 className="mt-4 text-lg font-bold sm:mt-5 sm:text-xl">Settings</h1>

      <div className="my-4 flex flex-col gap-3 sm:my-5 sm:flex-row sm:flex-wrap sm:gap-4">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition sm:w-auto sm:text-base ${
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
          className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition sm:w-auto sm:text-base ${
            activeTab === "notifications"
              ? "bg-[#027840] text-white"
              : "border border-[#00000033] text-gray-500"
          }`}
        >
          <IoIosNotificationsOutline size={20} />
          Notifications
        </button>

        <button
          onClick={() => setActiveTab("password")}
          className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition sm:w-auto sm:text-base ${
            activeTab === "password"
              ? "bg-[#027840] text-white"
              : "border border-[#00000033] text-gray-500"
          }`}
        >
          <PiLockKeyLight size={20} />
          Change Password
        </button>
      </div>

      <div className="w-full overflow-y-auto pb-4 md:w-3/4 lg:w-[70%] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#f2f2f2]">
        {activeTab === "profile" && <EditProfile />}
        {activeTab === "notifications" && <Notification />}
        {activeTab === "password" && <Password />}
      </div>
    </div>
  );
};

export default Parent;