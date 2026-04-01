import React, { useEffect, useState } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { ThreeDots } from "react-loader-spinner";
import { accountTier } from "../api/authApi";

const pricing_cache = "pricing_plans_cache";
const CACHE_TTL = 1000 * 60 * 5;

const PricingSection = () => {
  const [plans, setPlans] = useState([]);
  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingPlan, setLoadingPlan] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isLandingPage = location.pathname === "/";
  const token = localStorage.getItem("token");

  const colorMap = {
    Starter: "#BB8232",
    Growth: "#005D68",
    Premium: "#000000",
    Enterprise: "#027840",
  };

  useEffect(() => {
    fetchPlans();
  }, []);
  
  const fetchPlans = async () => {
    try {
      const cachedData = localStorage.getItem(pricing_cache);
      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        if (Date.now() - timestamp < CACHE_TTL) {
          setPlans(data);
          setLoadingPage(false);
          return;
        }
      }
      const response = await accountTier();
      const apiPlans = response.data.map((plan) => {
        const color = colorMap[plan.name] || "#000000";
        const includes = [
          { id: 1, text: `${plan.included_orders.toLocaleString()} Orders / Month` },
          { id: 2, text: `${plan.included_stores} Store${plan.included_stores > 1 ? "s" : ""}` },
          { id: 3, text: `${plan.included_vendors} Vendor${plan.included_vendors > 1 ? "s" : ""}` },
          { id: 4, text: `Inventory Sync` },
          { id: 5, text: `Up to ${plan.max_subaccounts} Subaccount${plan.max_subaccounts > 1 ? "s" : ""}` },
        ];

        const features = [
          { id: 1, text: `API Access`, value: plan.api_access },
          { id: 2, text: `Branded Tracking`, value: plan.branded_tracking },
          { id: 3, text: `Dedicated Success Manager`, value: plan.dedicated_success_manager },
          { id: 4, text: `White-label Branding`, value: plan.white_label_branding },
          { id: 5, text: `Advanced Analytics`, value: plan.advanced_analytics },
        ];

        return {
          ...plan,
          color,
          include: includes,
          feature: features,
        };
      });

      localStorage.setItem(
        pricing_cache,
        JSON.stringify({ data: apiPlans, timestamp: Date.now() })
      );

      setPlans(apiPlans);
    } catch (error) {
      console.error("Failed to fetch pricing plans:", error);
    } finally {
      setLoadingPage(false);
    }
  };

  const goToPricingDetails = (plan) => {
    setLoadingPlan(plan.id);
    setTimeout(() => {
      setLoadingPlan(null);
      navigate("/pricing-details", { state: { plan } });
    }, 1000);
  };

  return (
    <div className={isLandingPage && "lg:px-5 md:px-10 px-4"}>
      {loadingPage ? (
        <div className="flex items-center justify-center h-[500px]">
          <ThreeDots height="60" width="60" color="#BB8232" ariaLabel="loading" />
        </div>
      ) : (
        <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols lg:gap-5 md:gap-6 gap-4 lg:px-0 md:px-4 px-2">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="rounded-lg py-6 px-4 border border-[#E4E4E4] bg-white duration-300 flex flex-col"
            >
              <div className="flex flex-col items-start">
                <h3 className="text-lg font-semibold" style={{ color: plan.color }}>
                  {plan.name}
                </h3>
              </div>

              <p className={isLandingPage ? "hidden" : "my-2 flex items-start h-[5rem]"}>
                {plan.description}
              </p>


              <div className="mb-3 mt-4 text-start">
                <div className="text-2xl text-gray-900">
                  {parseFloat(plan.price) === 0 ? (
                    <span className="font-[700] text-[25px]" style={{ color: plan.color }}>
                      Custom Pricing
                    </span>
                  ) : (
                    <>
                      <span className="font-[700] text-[30px]" style={{ color: plan.color }}>
                        ${parseFloat(plan.price).toLocaleString()}
                      </span>
                      <sup className="text-sm align-super">{!isLandingPage && " per month"}</sup>
                    </>
                  )}
                </div>
              </div>
              <section className={isLandingPage ? "hidden" : "block"}>
                <p className="my-2 text-start font-[500]">Includes</p>
                <ul className="space-y-3 mb-6">
                  {plan.include.map((include) => (
                    <li key={include.id} className="flex items-start">
                      <div className="flex-shrink-0 opacity-60" style={{ color: plan.color }}>
                        <FaCircleCheck />
                      </div>
                      <p className="ml-2 text-xs text-gray-700">{include.text}</p>
                    </li>
                  ))}
                </ul>
              </section>

              <p className="text-start font-[500]">More Features</p>
              <ul className="space-y-3 my-3">
                {plan.feature.map((feature) => (
                  <li key={feature.id} className="flex items-start">
                    <div
                      className="flex-shrink-0 opacity-60"
                      style={{ color: feature.value ? plan.color : "#999" }}
                    >
                      {feature.value ? <FaCircleCheck /> : <FaTimes />}
                    </div>
                    <p className="ml-2 text-xs text-gray-700">{feature.text}</p>
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex items-center justify-center">
                <button
                  type="button"
                  style={{ borderColor: plan.color }}
                  onClick={() => goToPricingDetails(plan)}
                  className="rounded-[8px] border bg-white w-[184px] h-[48px] hover:border-2 py-2 px-4 my-5 text-sm font-medium text-gray-700 flex items-center justify-center gap-2"
                  disabled={loadingPlan === plan.id}
                >
                  {loadingPlan === plan.id ? (
                    <ThreeDots height="24" width="40" color={plan.color} />
                  ) : (
                    isLandingPage ? "Learn more" : "Choose Plan"
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Toaster position="top-right" />
    </div>
  );
};

export default PricingSection;
