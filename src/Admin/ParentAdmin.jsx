import React from 'react';
import Sidebar from './Sidebar';
import { NavLink, Outlet } from "react-router-dom";
import { User } from 'lucide-react';

const ParentAdmin = () => {
  const firstName = localStorage.getItem("fullName")?.split(" ")[0] || "Admin";
  const userImage = localStorage.getItem("profileImage"); 

  const sizeClass = "w-12 h-12"; 
  const iconSize = 20;

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />

      <main className="flex-1 h-full overflow-y-auto bg-[#E7F2ED] px-6 pt-20 md:pt-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between md:mx-10">
          
          <div className="flex items-center gap-4">
            {userImage ? (
              <img
                src={userImage}
                alt="User"
                className={`${sizeClass} rounded-full object-cover`}
              />
            ) : (
              <div className={`${sizeClass} rounded-full flex items-center justify-center bg-gradient-to-br from-[#027840]/10 to-[#025c33]/10`}>
                <div className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md">
                  <User size={iconSize} className="text-[#027840]" />
                </div>
              </div>
            )}

            <div>
              <p className="text-lg font-bold text-gray-900">
                Welcome, {firstName}
              </p>
              <p className="text-sm text-gray-500">
                Here are your latest insights
              </p>
            </div>
          </div>
          
          <input
            type="text"
            placeholder="Search features"
            className="w-full sm:w-64 rounded-l-[20px] rounded-r-[20px] border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default ParentAdmin;
