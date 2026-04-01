import React, { useState } from "react";

const Notification = () => {
  const [activeTab, setActiveTab] = useState("general");

  // separate states for each toggle
  const [generalEnabled, setGeneralEnabled] = useState(false);
  const [teamsEnabled, setTeamsEnabled] = useState(false);

  const tabs = [
    { id: "general", label: "General" },
    { id: "teams", label: "Teams" },
  ];

  return (
    <div className="w-full bg-white shadow">
      {/* Tab Headers with full border */}
      <div className="relative border-b flex space-x-6 px-5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-3 text-sm font-medium relative transition-all duration-200
              ${
                activeTab === tab.id
                  ? "text-[#027840]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
          >
            {tab.label}
            {/* Active Indicator */}
            {activeTab === tab.id && (
              <span className="absolute left-0 -bottom-[1px] h-[2px] w-full bg-[#027840]" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-5">
        {activeTab === "general" && (
  <div className="space-y-6">
    {/* Intro text */}
    <div className="flex justify-between">
      <div>
        <p className="text-sm text-gray-600 font-bold">Email Notification.</p>
        <p className="text-gray-500 md:w-3/4">
          Get notified on all activities you perform on your account on
          SwiftSuite App. You can always come back to change notification
          settings in order not to receive overwhelming notification emails.
        </p>
      </div>
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setGeneralEnabled(!generalEnabled)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors 
          ${generalEnabled ? "bg-[#005D68]" : "bg-gray-300"}`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform 
            ${generalEnabled ? "translate-x-6" : "translate-x-1"}`}
          />
        </button>
      </div>
    </div>

    {/* Notification Preferences */}
    <div className="">
      {/* Header */}
      <div className="grid grid-cols-2 gap-2 text-sm font-semibold text-gray-700 mb-2 py-1 border-b">
        <span className="">Choose how you’d like to be notified on the following activities</span>
        <div className="flex gap-20 justify-center items-center">
        <span className="text-center">Email</span>
        <span className="text-center">Push</span>
        </div>
      </div>

      {/* Activities */}
      {[
        "List a product",
        "Email a vendor",
        "Enrol a Marketplace",
        "Save a listing",
        "Delete a listing",
        "Delete a vendor"
      ].map((activity, idx) => (
        <div
          key={idx}
          className="grid grid-cols-2 gap-2 items-center py-2 text-sm"
        >
          <span className="text-gray-600">{activity}</span>

          {/* Email checkbox */}
          <div className="flex justify-center items-center gap-24">

          <div className="flex justify-center">
            <input
              type="checkbox"
              className="w-5 h-5 rounded-[4px] border border-[#027840] bg-white appearance-none 
              checked:bg-[#027840] checked:border-green-500
              checked:after:content-['✓'] checked:after:text-white 
              checked:after:text-sm checked:after:font-bold 
              checked:after:absolute checked:after:top-0 
                checked:after:left-1/2 checked:after:transform 
                checked:after:-translate-x-1/2 checked:after:leading-5 relative"
                />
          </div>

          {/* Push checkbox */}
          <div className="flex justify-center">
            <input
              type="checkbox"
              className="w-5 h-5 rounded-[4px] border border-[#027840] bg-white appearance-none 
              checked:bg-[#027840] checked:border-green-500
              checked:after:content-['✓'] checked:after:text-white 
              checked:after:text-sm checked:after:font-bold 
              checked:after:absolute checked:after:top-0 
                checked:after:left-1/2 checked:after:transform 
                checked:after:-translate-x-1/2 checked:after:leading-5 relative"
                />
          </div>
                </div>
        </div>
      ))}
    </div>
  </div>
)}


        {activeTab === "teams" && (
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-600 font-bold">
                Teams Email Notification.
              </p>
              <p className="text-gray-500">
                Receive real-time updates about team members activities in your
                mail
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setTeamsEnabled(!teamsEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors 
                ${teamsEnabled ? "bg-[#005D68]" : "bg-gray-300"}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform 
                  ${teamsEnabled ? "translate-x-6" : "translate-x-1"}`}
                />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notification;
