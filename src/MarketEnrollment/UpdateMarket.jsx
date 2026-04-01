import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Toaster, toast } from "sonner";
import { Button } from "antd";
import { CiEdit } from "react-icons/ci";
import { FaTrashAlt } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { IoAdd } from "react-icons/io5";
import { LiaTimesSolid } from "react-icons/lia";
import { MdAccountBox } from "react-icons/md";
import { FaRegCircleDot } from "react-icons/fa6";
import { marketPlaces } from "./Data";
import SubscriptionModal from "../pages/SubscriptionModal";
import { marketplaceEnrolment } from "../api/authApi";

const UpdateMarket = () => {
  const [markets, setMarkets] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [noEnrolment, setNoEnrolment] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userId = JSON.parse(localStorage.getItem("userId"));
  const subscribed = useSelector((state) => state.permission?.subscribed ?? false);

  const marketplacesToFetch = ["Ebay", "woocommerce"];

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const results = await Promise.allSettled(
          marketplacesToFetch.map((mp) => marketplaceEnrolment(userId, mp))
        );
        const validData = results
          .filter((res) => res.status === "fulfilled" && res.value?.marketplace_name)
          .map((res) => res.value)
          .map((responseData) => {
            const matchedVendor = marketPlaces.find(
              (v) => v.name.toLowerCase() === responseData.marketplace_name?.toLowerCase()
            );
            return {
              ...responseData,
              logo: matchedVendor?.image || null,
            };
          });
        if (validData.length === 0) {
          setNoEnrolment(true);
        }
        setMarkets(validData);
      } catch (err) {
        setNoEnrolment(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [token, userId]);

  const handleToggle = (name) => {
    if (!subscribed) {
      setShowSubscriptionModal(true);
      return;
    }
    setExpanded((prev) => ({ ...prev, [name]: !prev[name] }));
  };

 const handleEditClick = (marketplace) => {
  localStorage.setItem("MarketList", "false");
  localStorage.setItem("submittedMarketPlace", marketplace);
  navigate("/layout/market", {
    state: { marketPlace: marketplace },
  });
};

  return (
    <div className="w-full">
      <Toaster richColors />

      {loading ? (
        <div className="flex justify-center py-10">
          <ThreeDots color="#000" height={40} />
        </div>
      ) : noEnrolment ? (
        <div className="text-center py-10 text-gray-600">No enrolment found</div>
      ) : (
        markets.map((market, idx) => (
          <div
            key={idx}
            className="border rounded-lg mb-5"
          >
            <button
              onClick={() => handleToggle(market.marketplace_name)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-100 hover:bg-gray-200 transition-all"
            >
              <div className="flex items-center gap-3">
                {market.logo && (
                  <img
                    src={market.logo}
                    alt={`${market.marketplace_name} Logo`}
                    className="h-6 w-10 object-contain"
                  />
                )}
                <span className="font-semibold">{market.marketplace_name}</span>
              </div>
              <div className="text-xl">
                {expanded[market.marketplace_name] ? <LiaTimesSolid /> : <IoAdd />}
              </div>
            </button>

            {expanded[market.marketplace_name] && (
              <div className="px-4 py-3 bg-white border-t">
                <div className="flex flex-col md:flex-row justify-between text-sm font-semibold border-b pb-2 gap-2">
                  <div className="md:w-1/3">Store ID</div>
                  <div className="md:w-1/3 text-center">Status</div>
                  <div className="md:w-1/3 text-end"></div>
                </div>

                <div className="flex flex-col md:flex-row justify-between text-sm py-3 gap-3 items-center">
                  <div className="md:w-1/3 w-full flex justify-start">
                    <span className="flex items-center bg-[#005D6833] px-2 py-1 rounded w-full md:w-auto">
                      <MdAccountBox className="text-lg mr-1" />{" "}
                      {market.store_id || "N/A"}
                    </span>
                  </div>

                  <div className="md:w-1/3 w-full flex items-center justify-center gap-2 text-[#BB8232] font-semibold">
                    <FaRegCircleDot /> Connected
                  </div>

                  <div className="md:w-1/3 w-full flex justify-center md:justify-end gap-2">
                    <Button
                      size="small"
                      icon={<CiEdit />}
                      onClick={() => handleEditClick(market.marketplace_name)}
                      className="!bg-[#027840] !text-white !border-none hover:!bg-green-600 focus:!bg-green-600 active:!bg-green-700 !py-[16px] !rounded-[8px] w-full md:w-auto"
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      icon={<FaTrashAlt />}
                      onClick={() =>
                        toast.warning("Delete functionality not implemented.")
                      }
                      className="!bg-[#A71A1D] !text-white !border-none hover:!bg-red-600 focus:!bg-red-600 active:!bg-red-700 !py-[16px] !rounded-[8px] w-full md:w-auto"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))
      )}

      {showSubscriptionModal && (
        <SubscriptionModal
          isOpen={showSubscriptionModal}
          onClose={() => setShowSubscriptionModal(false)}
        />
      )}
    </div>
  );
};

export default UpdateMarket;
