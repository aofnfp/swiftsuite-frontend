import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Minus, Plus } from "lucide-react";

const AdminManageSubscription = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(state?.plan);

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No plan selected</p>
      </div>
    );
  }

  const isUnlimited = (value) => value >= 9999999;

  const updateValue = (key, delta) => {
    if (isUnlimited(plan[key])) return;
    setPlan((prev) => ({
      ...prev,
      [key]: Math.max(0, prev[key] + delta),
    }));
  };

  const toggleFeature = (key) => {
    setPlan((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const Control = ({ label, field }) => (
    <div className="flex items-center justify-between shadow-[0_4px_25px_0_rgba(0,0,0,0.05)] md:p-3">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex items-center gap-4">
        <button
          onClick={() => updateValue(field, -1)}
          disabled={isUnlimited(plan[field])}
          className="w-8 h-8 rounded bg-[#BB8232] text-white flex items-center justify-center disabled:opacity-40"
        >
          <Minus size={14} />
        </button>

        <span className="min-w-[100px] text-center font-semibold">
          {isUnlimited(plan[field])
            ? "Unlimited"
            : plan[field].toLocaleString()}
        </span>

        <button
          onClick={() => updateValue(field, 1)}
          disabled={isUnlimited(plan[field])}
          className="w-8 h-8 rounded bg-[#027840] text-white flex items-center justify-center disabled:opacity-40"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );

  const features = [
    { key: "api_access", label: "API Access" },
    { key: "branded_tracking", label: "Branded Tracking" },
    { key: "dedicated_success_manager", label: "Dedicated Success Manager" },
    { key: "white_label_branding", label: "White-label Branding" },
    { key: "advanced_analytics", label: "Advanced Analytics" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-5xl space-y-5 bg-white md:p-3 my-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">{plan.name}</h1>
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-gray-600"
          >
            ← Back
          </button>
        </div>

        <section className="bg-white rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-medium text-[#027840] font-semibold">Marketplace</h2>
          <Control
            label="Number of Marketplaces"
            field="included_stores"
          />
        </section>

        <section className="bg-white rounded-lg p-6 space-y-6">
          <h2 className="text-lg font-medium text-[#027840] font-semibold">Vendors & SKU</h2>
          <Control
            label="Number of Vendors"
            field="included_vendors"
          />
          <Control
            label="SKU Limit"
            field="store_sku_limit"
          />
        </section>

        <section className="bg-white rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-medium text-[#027840] font-semibold">Orders</h2>
          <Control
            label="Orders per Month"
            field="included_orders"
          />
        </section>

        <section className="bg-white  rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-medium">More Features</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {features.map((feature) => (
              <label
                key={feature.key}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={plan[feature.key]}
                  onChange={() => toggleFeature(feature.key)}
                  className="w-4 h-4 accent-[#027840]"
                />
                <span className="text-sm">{feature.label}</span>
              </label>
            ))}
          </div>
        </section>

        <div className="flex gap-4">
          <button className="px-6 py-2 bg-[#027840] text-white rounded-md">
            Save Changes
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 border rounded-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminManageSubscription;
