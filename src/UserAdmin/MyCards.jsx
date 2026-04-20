import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoMdPerson } from "react-icons/io";
import { FaEnvelope, FaListAlt } from "react-icons/fa";
import SubscriptionModal from "../pages/SubscriptionModal";

const MyCards = ({ analytics, loading }) => {
  const { subscribed } = useSelector((state) => state.permission);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!subscribed) {
      setShowModal(true);
    }
  }, [subscribed]);

  const handleProtectedAction = (path) => {
    if (!subscribed) {
      setShowModal(true);
      return;
    }
    navigate(`/layout/home/${path}`);
  };

  return (
    <>
      <SubscriptionModal 
        isOpen={showModal} 
        onClose={() => {}}
      />

      <div className="grid md:grid-cols-12 grid-cols-1 md:gap-10 gap-5">
        <div className="text-[#027840] font-semibold text-[17px] rounded-[16px] md:col-span-4 border bg-white flex flex-col gap-3 justify-center items-center p-5 shadow-[0_2px_5px_rgba(0,0,0,0.25)] ">
          <p className="flex flex-col items-center gap-1">
            <FaListAlt />
            <h2>Number Of Members</h2>
          </p>
          <p>{analytics?.total_subaccounts ?? 0}</p>
          <button
            onClick={() => handleProtectedAction("team")}
            className="bg-[#027840] text-white py-3 px-5 rounded-[8px]"
          >
            Manage Team
          </button>
        </div>

        <div className="text-[#BB8232] font-semibold text-[17px] rounded-[16px] md:col-span-4 border bg-white flex flex-col gap-3 justify-center items-center p-5 shadow-[0_2px_5px_rgba(0,0,0,0.25)]">
          <p className="flex flex-col items-center gap-1">
            <IoMdPerson />
            <h2>Active Members</h2>
          </p>
          <p>{analytics?.active_subaccounts ?? 0}</p>
          <button
            onClick={() => handleProtectedAction("invite")}
            className="bg-[#BB8232] text-white py-3 px-3 rounded-[8px]"
          >
            Add New Member
          </button>
        </div>

        <div className="text-[#005D68] font-semibold text-[17px] rounded-[16px] md:col-span-4 border bg-white flex flex-col gap-3 justify-center items-center p-5 shadow-[0_2px_5px_rgba(0,0,0,0.25)]">
          <p className="flex flex-col items-center gap-1">
            <FaEnvelope />
            <h2>Pending Invites</h2>
          </p>
          <p>{analytics?.pending_subaccounts ?? 0}</p>
          <button
            onClick={() => handleProtectedAction("reminder")}
            className="bg-[#005D68] text-white py-3 px-5 rounded-[8px]"
          >
            Send Reminders
          </button>
        </div>
      </div>
    </>
  );
};

export default MyCards;