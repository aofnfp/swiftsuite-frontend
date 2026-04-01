import React, { useState } from "react";
import { memberActivities } from "./MembersActivitiesData";
import { BsThreeDots, BsSearch } from "react-icons/bs";
import { MdClose, MdCheck } from "react-icons/md";
import { Link } from "react-router-dom";
import { MdOutlineArrowBackIos } from "react-icons/md";
import MemberActivityDrawer from "./MemberActivityDrawer";

const MemberActivities = () => {
  const [timeFilter, setTimeFilter] = useState("Last 7 days");
  const [moduleFilter, setModuleFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedActivity, setSelectedActivity] = useState(null);

  const getActionStyles = (action) => {
    if (action.toLowerCase().includes("deleted")) {
      return {
        textColor: "text-[#BB8232]",
        iconBg: "bg-[#BB8232]",
        icon: <MdClose className="text-white" size={14} />,
      };
    }
    if (action.toLowerCase().includes("saved")) {
      return {
        textColor: "text-[#005D68]",
        iconBg: "bg-[#005D68]",
        icon: <MdCheck className="text-white" size={14} />,
      };
    }
    if (action.toLowerCase().includes("enroled")) {
      return {
        textColor: "text-[#027840]",
        iconBg: "bg-[#027840]",
        icon: <MdCheck className="text-white" size={14} />,
      };
    }
    return {
      textColor: "text-[#005D68]",
      iconBg: "bg-[#005D68]",
      icon: <MdCheck className="text-white" size={14} />,
    };
  };

  const filteredActivities = memberActivities.filter((activity) =>
    activity.fullname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="px-4 my-20">
      <Link to="/layout/home" className="flex items-center gap-1">
        <MdOutlineArrowBackIos /> Return to dashboard
      </Link>
      <h2 className="text-xl font-bold mb-1 mt-5">Member Activities</h2>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6 bg-white p-4">
        <div className="flex gap-3">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            <option>Last 7 days</option>
            <option>Last 2 days</option>
            <option>Last 24 hours</option>
            <option>Last 1 hour</option>
          </select>

          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            <option>All</option>
            <option>Inventory Module</option>
            <option>Orders Module</option>
          </select>
        </div>

        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border rounded-lg w-full pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
          <BsSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      <div className="hidden md:grid grid-cols-7 font-semibold text-gray-700 pb-1 border-b">
        <div className="col-span-2 md:px-20">Name</div>
        <div>Role</div>
        <div>Item</div>
        <div>Timestamp</div>
        <div>Action</div>
        <div className="text-center"></div>
      </div>

      {filteredActivities.map((activity) => {
        const initials = activity.fullname
          .split(" ")
          .map((name) => name[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);

        const styles = getActionStyles(activity.action);

        return (
          <div
            key={activity.id}
            className="grid md:grid-cols-7 items-center py-3 border-b bg-white px-2 hover:bg-gray-50 transition md:gap-0 gap-3"
          >
            <div className="flex items-center gap-3 col-span-6 md:col-span-2">
              <div className="flex items-center justify-center w-12 h-12 border rounded-lg font-bold bg-[#5B4B4B] text-white">
                {initials}
              </div>
              <div>
                <p className="font-medium">{activity.fullname}</p>
                <p className="text-sm text-gray-500">{activity.email}</p>
              </div>
            </div>

            <div className="col-span-3 md:col-span-1 text-[#027840]">
              <span className="px-2 py-2 text-xs font-bold border border-[#00000033] rounded-[6px]">
                {activity.role}
              </span>
            </div>

            <div className="col-span-3 md:col-span-1 font-bold">
              {activity.item}
            </div>

            <div className="col-span-3 md:col-span-1 text-gray-500">
              {activity.timestamp}
            </div>

            <div
              className={`col-span-3 md:col-span-1 flex items-center gap-2 ${styles.textColor}`}
            >
              <span
                className={`flex items-center justify-center w-5 h-5 ${styles.iconBg} rounded-full`}
              >
                {styles.icon}
              </span>
              {activity.action}
            </div>

            <div className="flex justify-start md:justify-center relative group col-span-3 md:col-span-1">
              <button
                onClick={() => setSelectedActivity(activity)}
                className="p-2 rounded-full hover:bg-gray-200 transition"
              >
                <BsThreeDots size={18} />
              </button>
              <div className="absolute top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-gray-800 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap">
                See details
              </div>
            </div>
          </div>
        );
      })}

      {/* Drawer Component */}
      <MemberActivityDrawer
        activity={selectedActivity}
        onClose={() => setSelectedActivity(null)}
      />
    </div>
  );
};

export default MemberActivities;
