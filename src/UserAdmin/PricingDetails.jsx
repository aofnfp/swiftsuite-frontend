import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";
import { Toaster, toast } from "sonner";
import Faqs from "./Faqs";

const PricingDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [loadingTier, setLoadingTier] = useState(null);
  const [activePlan, setActivePlan] = useState(location.state?.plan || null);
  const [selectedAddOns, setSelectedAddOns] = useState({});

  useEffect(() => {
    if (!activePlan) {
      const storedPlan = localStorage.getItem("selectedPlan");
      if (storedPlan) setActivePlan(JSON.parse(storedPlan));
    }
  }, [activePlan]);

  useEffect(() => {
    if (activePlan) {
      localStorage.setItem("selectedPlan", JSON.stringify(activePlan));
    }
  }, [activePlan]);

  const chooseMyPlan = async (tier) => {
    setLoadingTier(tier);
    try {
      const endpoint = `https://service.swiftsuite.app/accounts/tier-subscription/`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ tier }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text);
        throw new Error("Unexpected server response. Please try again.");
      }

      if (response.status === 401 || response.status === 403) {
        toast.error("Redirecting to sign in...");
        localStorage.setItem("selectedPlan", JSON.stringify(activePlan));
        localStorage.setItem("redirectAfterLogin", location.pathname);
        setTimeout(() => navigate("/signin"), 2000);
        return;
      }

      const result = await response.json();
      if (response.ok) {
        localStorage.removeItem("selectedPlan");
        window.open(result.checkout_url, "_blank");
      } else {
        toast.error(result.detail || "Failed to select plan.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Unable to connect. Please check your internet and try again.");
    } finally {
      setLoadingTier(null);
    }
  };

  if (!activePlan) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] text-center">
        <p className="text-lg text-gray-600 mb-4">No plan details available.</p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-700"
        >
          Go Back
        </button>
      </div>
    );
  }


  return (
    <div className="py-1 mx-auto bg-[#E7F2ED] rounded-lg">
      <div className="mt-2 py-5 bg-white">
        <h1 className="text-3xl text-center font-semibold">Pricing Plans</h1>
        <p className="text-center">
          Here, you have an elaborate view of the plans you want to go with <br />
          and the top features, broken down <br /> and explained
        </p>
      </div>

      <div className="bg-white">
        <div className="flex flex-col lg:flex-row pt-10 mt-3 justify-center items-stretch bg-white max-w-[50%] mx-auto">
          <div className="grid grid-rows-2 flex-1 min-w-[50%]">
            <div className="flex bg-[#F2F2F2] font-semibold text-2xl p-8">
              <p>
                Choose your <br /> plan
              </p>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold h-[40px] flex items-center text-[17px]">
                Top Features
              </p>
              <ul className="flex-1 flex flex-col">
                {activePlan.include?.map((item) => {
                  let cleanedText = item.text
                    .replace(/inventory sync/gi, "")
                    .replace(/Orders \/ Month/gi, "Orders")
                    .replace(/Vendors/gi, "Vendor Integrations")
                    .replace(/,/g, "")
                    .replace(/[0-9]/g, "")
                    .replace(/\bstore(s)?\b/gi, "Marketplace Integrations")
                    .replace(/\s+/g, " ")
                    .trim();

                  return cleanedText ? (
                    <li key={item.id} className="border-b flex items-center h-[60px] pl-2">
                      <span className="text-gray-700 mx-4">{cleanedText}</span>
                    </li>
                  ) : null;
                })}
              </ul>
            </div>
          </div>

          <div className="grid grid-rows-2 w-full lg:w-[50%] shadow-[0_2px_30px_0_rgba(0,0,0,0.25)]">
            <div className="border flex flex-col items-center justify-center text-center py-5">
              <h2 className="text-2xl font-bold mb-4" style={{ color: activePlan.color }}>
                {activePlan.name}
              </h2>
              <div className="font-bold mb-2 text-[2rem]" style={{ color: activePlan.color }}>
                {parseFloat(activePlan.price) === 0 ? (
                  <span>Custom</span>
                ) : (
                  <>
                    ${parseFloat(activePlan.price).toLocaleString()}
                    <span className="text-[1rem] text-gray-500">/month</span>
                  </>
                )}
              </div>

              <p className="mb-4 font-semibold text-gray-500">
                billed <br /> monthly
              </p>

              
              <button
                onClick={() => chooseMyPlan(activePlan.id)}
                className="border w-[170px] h-[40px] px-4 rounded-[10px] bg-[#027840] text-white flex items-center justify-center gap-2 mt-3"
                disabled={loadingTier === activePlan.id}
                aria-busy={loadingTier === activePlan.id}
              >
                {loadingTier === activePlan.id ? (
                  <ThreeDots height="20" width="20" color="white" ariaLabel="loading" />
                ) : (
                  "Proceed to Payment"
                )}
              </button>
            </div>

            <div className="border">
              <p className="font-semibold h-[40px] flex items-center text-[17px] "></p>
              <ul className="flex-1 flex flex-col">
                <li className="border-b flex flex-col items-center justify-center h-[60px]">
                  <span className="font-semibold">{activePlan.included_orders} Orders/month</span>
                  <span className="text-gray-500 text-sm">
                    (extra order cost ${parseFloat(activePlan.extra_order_cost).toFixed(2)})
                  </span>
                </li>
                <li className="border-b flex flex-col items-center justify-center h-[60px]">
                  <span className="font-semibold">{activePlan.included_stores} Marketplace Integrations</span>
                  <span className="text-gray-500 text-sm">
                    (extra store cost: ${parseFloat(activePlan.extra_store_cost).toFixed(2)})
                  </span>
                </li>
                <li className="border-b flex flex-col items-center justify-center h-[60px]">
                  <span className="font-semibold">{activePlan.included_vendors} Vendor Integrations</span>
                  <span className="text-gray-500 text-sm">
                    (extra vendor cost: ${parseFloat(activePlan.extra_vendor_cost).toFixed(2)})
                  </span>
                </li>
                <li className="border-b flex flex-col items-center justify-center h-[60px]">
                  <span className="font-semibold">{activePlan.max_subaccounts} Subaccounts</span>
                  <span className="text-gray-500 text-sm">(Included in plan)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 
      <div className="bg-white pt-5">
        <section className="pb-5 bg-white max-w-[50%] mx-auto">
          <div className="flex flex-col gap-4">
            <h1 className="font-bold text-xl">Optional Add-Ons</h1>
            {card.map((item, index) => {
              const isSelected = selectedAddOns[index] || false;
              return (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b gap-4"
                >
                  <div className="sm:flex-[2] w-full">
                    <h3 className="font-bold text-lg">{item.heading}</h3>
                    <p className="text-gray-600 text-sm">{item.details}</p>
                  </div>
                  <div className="sm:flex-1 w-full flex justify-center sm:justify-center font-bold">
                    ${item.price}/month
                  </div>
                  <div className="sm:flex-1 w-full flex justify-start sm:justify-end items-center">
                    <button
                      onClick={() => toggleAddOn(index, !isSelected)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors 
                        ${isSelected ? "bg-[#005D68]" : "bg-gray-300"}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform 
                        ${isSelected ? "translate-x-6" : "translate-x-1"}`}
                      />
                    </button>
                  </div>
                </div>
              );
            })}
            <div className="text-center">
              <div className="text-xl font-bold flex justify-between">
                <p>Total:</p>
                <p>${totalPrice.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex justify-end items-end">
              <button
                onClick={() => chooseMyPlan(activePlan.id)}
                className="border w-[170px] h-[40px] px-4 rounded-[10px] bg-[#027840] text-white flex items-center justify-center gap-2"
                disabled={loadingTier === activePlan.id}
                aria-busy={loadingTier === activePlan.id}
              >
                {loadingTier === activePlan.id ? (
                  <ThreeDots height="20" width="20" color="white" ariaLabel="loading" />
                ) : (
                  "Proceed to Payment"
                )}
              </button>
            </div>
          </div>
        </section>
      </div>
      */}

      <div className="mt-3 bg-white mx-auto">
        <Faqs />
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

export default PricingDetails;
