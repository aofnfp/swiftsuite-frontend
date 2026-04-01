import React, { useState } from "react";
import { FaRocket, FaKey,
  FaMoneyBill,
  FaWrench,
  FaFileAlt,
  FaTools,
  FaEnvelope,
} from "react-icons/fa";
import GettingStarted from "./GettingStarted";
import KeyFeatures from "./KeyFeatures";
import Billing from "./Billing";
import Troubleshooting from "./Troubleshooting";
import Documentation from "./Documentation";
import MoreResources from "./MoreResources";
import img from "./Images/billswift1.png"

const Help = () => {
  const [selectedSection, setSelectedSection] = useState(1);
  const [search, setSearch] = useState("");

  const sections = [
    { id: 1, name: "Getting Started", icon: <FaRocket /> },
    { id: 2, name: "Key Features", icon: <FaKey /> },
    { id: 3, name: "Billing", icon: <FaMoneyBill /> },
    { id: 4, name: "Troubleshooting", icon: <FaWrench /> },
    { id: 5, name: "Documentation", icon: <FaFileAlt /> },
    { id: 6, name: "More Resources", icon: <FaTools /> },
  ];

  const renderSection = () => {
    switch (selectedSection) {
      case 1:
        return <GettingStarted />;
      case 2:
        return <KeyFeatures />;
      case 3:
        return <Billing />;
      case 4:
        return <Troubleshooting />;
      case 5:
        return <Documentation />;
      case 6:
        return <MoreResources />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen pt-4 space-y-2 flex flex-col items-center">
      <div className="w-full px-2">
      <h2 className="text-center text-xl font-medium text-[#027840] mb-6 mt-16">
        How can we be of help?
      </h2>
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="What would you like to be informed about?"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-200 shadow-[25px_0px_25px_0px_#0000000D] rounded-l-lg px-4 py-2 w-[500px] md:w-[600px] focus:outline-none placeholder:text-[#027840] placeholder:opacity-40"
        />
        <button className="bg-[#027840] text-white px-6 py-2 rounded-r-lg hover:bg-green-700 transition">
          Search
        </button>
      </div>
      </div>

      <div className="w-full flex justify-center py-4">
        <div
          className="flex space-x-4 overflow-x-auto  scrollbar-hide px-4"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            scrollBehavior: "smooth",
            maxWidth: "90%",
          }}
        >
          {sections.map((section) => (
            <div
              key={section.id}
              onClick={() => setSelectedSection(section.id)}
              className={`flex-shrink-0 cursor-pointer w-48 bg-white rounded-lg p-4 text-center transition-all duration-300 border-2 ${
                selectedSection === section.id
                  ? "border-green-600 shadow-md"
                  : "border-gray-200"
              }`}
            >
              <div
                className={`transition-all duration-300 ${
                  selectedSection === section.id
                    ? "opacity-100 scale-105"
                    : "opacity-30"
                }`}
              >
                <div className="text-3xl mb-2 flex justify-center">
                  {section.icon}
                </div>
                <p className="font-semibold text-lg text-green-700">
                  {section.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <div className="w-full mt-4">
        <div className="p-6  overflow-y-auto scrollbar-hide transition-all duration-300 lg:mx-[60px]">
          {renderSection()}
        </div>

      </div>
        <section className="mt-2 w-full text-center bg-white py-4">
          <h1 className="text-lg font-semibold mb-2">
            Still Couldn’t Find What You’re Looking For?
          </h1>
          <p className="text-gray-600 mb-6">Reach out to us</p>

          <div className="flex flex-wrap justify-center gap-6 px-4 text-white">
            <div className="flex flex-col justify-center items-center text-center w-64 bg-[#027840] text-white rounded-lg p-6 shadow-sm hover:shadow-md transition">
              <FaEnvelope size={24} className=" mb-2" />
              <p className="font-semibold ">Email</p>
              <p className="">Support@swiftsuite.app</p>
            </div>

            <div className="flex flex-col justify-center items-center text-center w-64 bg-[#005D68] rounded-lg p-6 shadow-sm hover:shadow-md transition">
              <FaEnvelope size={24} className=" mb-2" />
              <p className="font-semibold">Live Chat</p>
              <p className="" >
                Available in your Swift Suite dashboard (Mon–Fri, 9am–6pm)
              </p>
            </div>

            <div className="flex flex-col justify-center items-center text-center w-64 bg-black rounded-lg p-6 shadow-sm hover:shadow-md transition">
              <FaEnvelope size={24} className=" mb-2" />
              <p className="font-semibold">Community Forum</p>
              <p className="">
                Join discussions, share tips, and get help from other users
              </p>
            </div>
          </div>
        </section>
        <div className="bg-white w-full flex flex-col justify-center items-center mt-2 py-4">
          <img src={img} width={150} alt="" />
          <p className="text-[#027840]"> Simplifying Dropshipping for Enterpreneurs</p>
        </div>
    </div>
  );
};

export default Help;
