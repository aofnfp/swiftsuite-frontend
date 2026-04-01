import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { marketPlaces } from "../MarketEnrollment/Data";
import SubscriptionModal from "../pages/SubscriptionModal";

const MarketList = () => {
  const navigate = useNavigate();
  const { subscribed } = useSelector((state) => state.permission); 
  const [showModal, setShowModal] = useState(false);

  const handleMarketplaceClick = (marketplaceName, available) => {
    if (!available) return;

    if (!subscribed) {
      setShowModal(true); 
      return;
    }

    localStorage.setItem("MarketList", "true");
    navigate("/layout/market", {
      state: { marketPlace: marketplaceName },
    });
  };

  return (
    <div className="mb-5 mx-auto">
      <SubscriptionModal isOpen={showModal} onClose={() => setShowModal(false)} />

      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
        {marketPlaces.length > 0 ? (
          marketPlaces.map((item) => (
            <div
              key={item.id || item.name}
              className="bg-white shadow border text-sm rounded-[16px] p-[20px]"
            >
              <div className="my-2 h-[40px] flex items-center gap-2">
                <img
                  src={item?.image || "path/to/fallback-image.png"}
                  width={50}
                  height={80}
                  className="object-contain h-full"
                  alt={item?.name || "Marketplace logo"}
                />
                <div className="font-semibold">{item?.name}</div>
              </div>
              <div className="px-1 text-[13px] my-4 h-10">
                {item?.summaries || `Sell products on ${item?.name}`}
              </div>
              <button
                onClick={() => handleMarketplaceClick(item.name, item.available)}
                disabled={!item.available}
                className={`py-2 w-[150px] rounded-[8px] mx-auto font-semibold h-[40px] border 
                  ${
                    item.available
                      ? "border-[rgba(2,120,64,0.4)] hover:bg-green-700 hover:text-white"
                      : "bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed"
                  }`}
              >
                {item.available ? "Add Marketplace" : "Not Available"}
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            No marketplaces found.
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketList;
