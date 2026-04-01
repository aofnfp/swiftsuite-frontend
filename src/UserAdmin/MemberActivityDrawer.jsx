import React from "react";
import { MdClose, MdPerson } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import { FaUserCircle } from "react-icons/fa";
import {GrConnect} from "react-icons/gr"
import displayImages from '../Images/activitiesImage.jpg'

const MemberActivityDrawer = ({ activity, onClose }) => {
  if (!activity) return null;

  const getActionVerb = (action) => {
    if (action.toLowerCase().includes("deleted")) return "Deleted on";
    if (action.toLowerCase().includes("saved")) return "Saved on";
    if (action.toLowerCase().includes("enroled")) return "Enroled on";
    return "Action performed on";
  };

  
  const getInitials = (name) => {
    if (!name) return "";
    const words = name.split(" ");
    return words
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };


  return (
    <AnimatePresence>
      {activity && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          {/* <motion.div
            className="fixed right-0 top-0 h-full w-full sm:w-[450px] bg-white shadow-lg z-50 flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween" }}
          > */}

          <motion.div
          className="fixed right-0 top-0 h-full w-full sm:w-[460px] bg-white z-50 p-6 flex flex-col overflow-y-auto"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", duration: 1.9 }}
        >

            {/* Header */}
            <div className="flex justify-between items-center p-4">
              <h3 className="text-xl font-bold">Member Details</h3>
              <MdPerson className="text-gray-600" size={24} />
            </div>

            {/* Content */}
            <div className="p-4 space-y-5 overflow-y-auto">
              <div>
                <p className="text-sm font-semibold text-gray-500">Name</p>
                <p className="text-lg font-medium">{activity.fullname}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-[#027840]">Email</p>
                <p className="text-lg font-medium">{activity.email}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-[#027840]">Role</p>
                <p className="text-lg font-medium">{activity.role}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-[#027840]">Timestamp</p>
                <p className="text-lg font-medium">{activity.timestamp}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-[#027840]">Action</p>
                <p className="text-lg font-medium">{activity.action}</p>
              </div>
            </div>
            <section className="p-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">Action Performed</h3>
              <GrConnect className="text-gray-600" size={24} />
            </div>
            <div className="flex items-center gap-4">
                {activity.img ? (
                  <img
                    src={activity.img}
                    alt={activity.item}
                    className="w-16 h-16 object-cover rounded-lg border"
                  />
                ) : (
                  <div className="w-16 h-16 flex items-center justify-center bg-gray-200 rounded-lg border text-lg font-bold text-gray-700">
                    {getInitials(activity.fullname)}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {activity.action}
                  </p>
                  <p className="text-base font-semibold">{activity.item}</p>
                </div>
              </div>

              {/* Action Performed On */}
              <div>
                <p className="text-sm font-medium text-gray-500 mt-5">
                  {getActionVerb(activity.action)}
                </p>
                <p className="text-gray-700">
                  12 Sep 2025, 10:30 AM
                </p>
              </div>
            </section>
             <section className="p-4">
              <p className="font-bold text-xl">Flag as inappropriate decision</p>
              <p>Drop a note and let {activity.fullname} know this action wasn’t supposed to take place.</p>
              <div className="flex flex-col gap-2">
              <input type="text" className="border border-gray-300 h-[100px] w-3/4"/>
              <button className="bg-[#027840] w-[3.5rem] text-white py-1 rounded-[5px]">Flag</button>
              </div>
             </section>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-black md:hidden"
            >
              <MdClose size={24} />
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MemberActivityDrawer;
