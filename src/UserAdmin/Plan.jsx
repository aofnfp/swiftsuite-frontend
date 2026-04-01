import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FiClock } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import leather from "../Images/Sneak.png";
import { Link, useNavigate } from "react-router-dom";
import SubscriptionModal from "../pages/SubscriptionModal";

const Plan = ({ analytics, loading, error }) => {
  const { subscribed } = useSelector((state) => state.permission);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleSeeMore = (e) => {
    e.preventDefault();
    if (!subscribed) {
      setShowModal(true);
      return;
    }
    navigate("/layout/members-activities");
  };

  const tier = analytics?.tier || "Unknown";
  const tierColors = {
    Starter: "bg-[#BB8232]",
    Premium: "bg-black",
    Growth: "bg-[#005D68]",
    Enterprise: "bg-[#027840]",
  };

  const tierClass = tierColors[tier] || "bg-gray-400";

  const starCounts = {
    Starter: 0,
    Growth: 1,
    Premium: 2,
    Enterprise: 3,
  };

  const stars = starCounts[tier] || 0;

  return (
    <>
      <SubscriptionModal isOpen={showModal} onClose={() => setShowModal(false)} />

      <div className="grid md:grid-cols-12 grid-cols-1 gap-5 my-5">
        <div className="md:col-span-5 col-span-6 flex flex-col gap-3 p-5 bg-white rounded-[8px]">
          <h2 className="font-bold">Current Plan</h2>

          {loading ? (
            <div className="animate-pulse bg-gray-200 h-8 w-24 rounded" />
          ) : error ? (
            <div className="text-red-500">Failed to load plan</div>
          ) : (
            <div className="flex items-center gap-3">
              <div
                className={`border p-2 ${tierClass} w-[120px] text-white rounded-[8px] text-center font-semibold`}
              >
                {tier}
              </div>

              <div className="flex items-center">
                {Array.from({ length: stars }).map((_, i) => (
                  <FaStar key={i} className="text-yellow-500 text-lg" />
                ))}
              </div>
            </div>
          )}

          <p className="text-[#027840]">
            Upgrade your subscription plan to enjoy more advanced admin privileges.
            Add more team members and integrate new features.
          </p>

          <div className="flex justify-between items-center">
            <p className="text-[#00000099] font-[500]">Want to Upgrade?</p>
            <Link
              to="/pricing"
              className="border border-[#027840] text-[#027840] py-2 px-7 font-semibold rounded-[8px]"
            >
              See Other Plans
            </Link>
          </div>
        </div>

        <div className="md:col-span-7 col-span-6">
          <div className="flex justify-between">
            <h2 className="font-semibold mb-2">Recent Activities by all members</h2>
            <a
              href="/layout/members-activities"
              onClick={handleSeeMore}
              className="underline text-[#005D68] cursor-pointer"
            >
              See more
            </a>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex bg-white items-center justify-between px-4 py-2 rounded-[8px]">
              <p className="text-[#005D68] ">
                <span className="font-bold text-black">Tori Vega</span> listed a product
              </p>
              <p className="flex item-center gap-1 text-[#00000099]">
                <FiClock className="mt-[3px]" /> Just now
              </p>
              <img src={leather} alt="" className="w-[40px] rounded" />
            </div>

            <div className="flex bg-white items-center justify-between px-4 py-2 rounded-[8px]">
              <p className="text-[#005D68] ">
                <span className="font-bold text-black">Tesi Love</span> edited inventory
              </p>
              <p className="flex item-center gap-1 text-[#00000099]">
                <FiClock className="mt-[3px]" /> 1 hr ago
              </p>
              <img src={leather} alt="" className="w-[40px] rounded" />
            </div>

            <div className="flex bg-white items-center justify-between px-4 py-2 rounded-[8px]">
              <p className="text-[#005D68] ">
                <span className="font-bold text-black">Andy Ray</span> listed a product
              </p>
              <p className="flex item-center gap-1 text-[#00000099]">
                <FiClock className="mt-[3px]" /> 5 hrs ago
              </p>
              <img src={leather} alt="" className="w-[40px] rounded" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Plan;
