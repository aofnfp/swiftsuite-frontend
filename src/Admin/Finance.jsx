import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { FaCircleCheck } from "react-icons/fa6";
import { accountTier } from "../api/authApi";
import { useNavigate } from "react-router-dom";

/* ------------------ STATIC DATA ------------------ */

const planStats = [
  { name: "Starter", value: 320, color: "#005D68" },
  { name: "Growth", value: 540, color: "#027840" },
  { name: "Premium", value: 260, color: "#BB8232" },
  { name: "Enterprise", value: 120, color: "#000000" },
];

const RANGE_COLOR = "#027840";
const totalPlans = planStats.reduce((a, b) => a + b.value, 0);

/* ------------------ COMPONENT ------------------ */

const Finance = () => {
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

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
      const response = await accountTier(token);

      const mappedPlans = response.data.map((plan) => {
        const color = colorMap[plan.name] || "#000";

        return {
          ...plan,
          color,
          include: [
            `${plan.included_orders.toLocaleString()} Orders / Month`,
            `${plan.included_stores} Store${plan.included_stores > 1 ? "s" : ""}`,
            `${plan.included_vendors} Vendor${plan.included_vendors > 1 ? "s" : ""}`,
            "Inventory Sync",
            `Up to ${plan.max_subaccounts} Subaccount${plan.max_subaccounts > 1 ? "s" : ""}`,
          ],
        };
      });

      setPlans(mappedPlans);
    } catch (err) {
      console.error("Failed to fetch plans", err);
    } finally {
      setLoadingPlans(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-12">
      <h1 className="text-xl sm:text-2xl font-semibold">
        Swiftsuite Finances
      </h1>

      {/* ---------------- Subscription Summary ---------------- */}
      <section className="w-full">
        <h2 className="text-lg font-medium mb-3 text-[#027840]">
          Subscriptions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              label: "Total Subscriptions",
              value: "1,240",
              growth: "+10% from last month",
            },
            {
              label: "Total Income from subscriptions",
              value: "₦3,450,000",
              growth: "+12% from last month",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-6 border shadow-sm"
            >
              <p className="text-sm text-[#027840]">{item.label}</p>
              <h3 className="text-2xl sm:text-3xl font-semibold my-6">
                {item.value}
              </h3>
              <p className="text-sm text-[#027840]">
                {item.growth}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- Subscription Stats ---------------- */}
      <section className="w-full">
        <h2 className="text-lg font-medium mb-3 text-[#027840]">
          Subscription Stats
        </h2>

        <div className="bg-white rounded-xl border p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Progress Bars */}
          <div className="space-y-5 md:mt-10">
            {planStats.map((plan) => {
              const percentage = Math.round(
                (plan.value / totalPlans) * 100
              );

              return (
                <div key={plan.name} className="flex items-center gap-4">
                  <span className="w-24 text-sm font-medium">
                    {plan.name}
                  </span>
                  <div className="flex-1 h-3 bg-[#02784033] rounded-full">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: RANGE_COLOR,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Doughnut Chart */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="w-full max-w-[220px] aspect-square">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                                      <Pie
                      data={planStats}
                      dataKey="value"
                      innerRadius={45}   // ← same thickness as before
                      outerRadius={90}   // ← same thickness as before
                      stroke="none"
                    >

                    {planStats.map((p, i) => (
                      <Cell key={i} fill={p.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              {planStats.map((plan) => {
                const percentage = Math.round(
                  (plan.value / totalPlans) * 100
                );
                return (
                  <div
                    key={plan.name}
                    className="flex items-center gap-3 text-sm"
                  >
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: plan.color }}
                    />
                    <span>{plan.name}</span>
                    <span className="font-medium">{percentage}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Manage Subscription ---------------- */}
      <section className="w-full">
        <h2 className="text-lg font-medium mb-2 text-[#027840]">
          Manage Subscription
        </h2>
        <p className="mb-4 text-sm text-gray-600">
          Manage subscriptions prices and details for your SwiftSuite App
        </p>

        {loadingPlans ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-[420px] bg-gray-100 animate-pulse rounded-lg"
              />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="border rounded-lg p-5 bg-white flex flex-col"
              >
                <h3
                  className="text-lg font-semibold"
                  style={{ color: plan.color }}
                >
                  {plan.name}
                </h3>

                <p
                  className="my-3 text-2xl font-bold"
                  style={{ color: plan.color }}
                >
                  {parseFloat(plan.price) === 0
                    ? "Custom Pricing"
                    : `$${plan.price}`}
                </p>

                <p className="font-medium mb-2">Includes</p>
                <ul className="space-y-2 mb-6">
                  {plan.include.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-xs"
                    >
                      <FaCircleCheck color={plan.color} />
                      {item}
                    </li>
                  ))}
                </ul>

                <button
                  className="mt-auto border rounded-md py-2 px-6 mx-auto"
                  style={{ borderColor: plan.color }}
                  onClick={() =>
                    navigate("/admin_layout/manage-subscription", {
                      state: { plan },
                    })
                  }
                >
                  Manage
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Finance;
