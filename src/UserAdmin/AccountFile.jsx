import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setPermissions } from "../redux/permissionSlice";
import MyCards from "./MyCards";
import Plan from "./Plan";
import DoughnutChart from "./DoughnutChart";
import BarRevenue from "./BarRevenue";
import InviteMembers from "./InviteMembers";
import TeamsManage from "./TeamsManage";
import ManualInventoryOrder from "../Admin/ManualInventoryOrder";

const AccountFile = () => {
  const [view, setView] = useState("default");
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/signin");
          return;
        }

        const response = await axios.get(
          "https://service.swiftsuite.app/accounts/dashboard-analytics/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = response.data;
        setAnalytics(data);

        const isSubscribed = data.subscription_status === "active";
        const existingPermissions =
          JSON.parse(localStorage.getItem("permissions")) || {};

        dispatch(
          setPermissions({
            subscribed: isSubscribed,
            isAdmin: existingPermissions.isAdmin || false,
          })
        );
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError("Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [dispatch, navigate]);

  const isSubscribedFromAnalytics =
    analytics?.subscription_status === "active";

  const renderContent = () => {
    switch (view) {
      case "team":
        return (
          <div className="text-xl">
            <TeamsManage
              onBack={() => setView("default")}
              analytics={analytics}
              loading={loading}
              error={error}
            />
          </div>
        );
      case "invite":
        return (
          <div className="md:p-10 text-xl">
            <InviteMembers
              onBack={() => setView("default")}
              analytics={analytics}
              loading={loading}
              error={error}
            />
          </div>
        );
      case "reminder":
        return <div className="p-10 text-xl">🔔 Send Reminders View</div>;
      default:
        return (
          <>
            <MyCards
              onCardClick={setView}
              analytics={analytics}
              loading={loading}
              error={error}
              isSubscribedFromAnalytics={isSubscribedFromAnalytics}
            />
            <Plan analytics={analytics} loading={loading} error={error} />
            <BarRevenue analytics={analytics} loading={loading} error={error} />
            <ManualInventoryOrder />
            <DoughnutChart
              analytics={analytics}
              loading={loading}
              error={error}
            />
          </>
        );
    }
  };

  return <div className="my-20 mx-5">{renderContent()}</div>;
};

export default AccountFile;