import React, { useEffect, useState } from "react";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";
import { BsThreeDots } from "react-icons/bs";
import { MdDateRange } from "react-icons/md";
import { FaCheckCircle, FaClock, FaTimesCircle } from "react-icons/fa";
import { Toaster, toast } from "sonner";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const token = localStorage.getItem("token");
  const PAGE_SIZE = 10;

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://service.swiftsuite.app/accounts/payment-history/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;
      setPayments(data.results || []);
    } catch (err) {
      setError("Failed to load payment history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const verifyCheckout = async (sessionId) => {
    try {
      setSelectedId(sessionId);
      setVerifying(true);
      await axios.get(
        `https://service.swiftsuite.app/accounts/verify-checkout/${sessionId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Verification successful!");
    } catch (err) {
      toast.error("Failed to verify checkout.");
    } finally {
      setVerifying(false);
      setSelectedId(null);
    }
  };

  const totalPages = Math.ceil(payments.length / PAGE_SIZE);
  const paginatedPayments = payments.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPlanName = (payment) => {
    if (payment.tier === 1) return "Starter";
    if (payment.tier === 2) return "Growth";
    if (payment.tier === 3) return "Premium";
    if (payment.tier === 4) return "Enterprise";

    if (payment.amount === "149.00" || payment.amount === 149) return "Starter";
    if (payment.amount === "249.00" || payment.amount === 249) return "Growth";
    if (payment.amount === "399.00" || payment.amount === 399) return "Enterprise";
    return "Custom";
  };

  const getPlanClass = (plan) => {
    if (plan === "Starter") return "bg-[#BB8232] font-semibold";
    if (plan === "Growth") return "bg-[#005D68] font-semibold";
    if (plan === "Premium") return "bg-[#027840] font-semibold";
    if (plan === "Enterprise") return "bg-[#000000] font-semibold";
    return "bg-gray-100";
  };

  const renderStatus = (status) => {
    if (status === "paid") {
      return (
        <span className="flex items-center justify-center text-[#027840] font-semibold">
          <FaCheckCircle className="mr-1" /> Paid
        </span>
      );
    }
    if (status === "pending") {
      return (
        <span className="flex items-center justify-center text-[#005D68] opacity-50 font-semibold">
          <FaClock className="mr-1" /> Pending
        </span>
      );
    }
    if (status === "failed") {
      return (
        <span className="flex items-center justify-center text-[#BB8232] font-semibold">
          <FaTimesCircle className="mr-1" /> Failed
        </span>
      );
    }
    return status;
  };

  const formatDateTime = (dateString) => {
    const dateObj = new Date(dateString);
    const date = dateObj.toLocaleDateString(); // Default color
    const time = dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); // No seconds
    return { date, time };
  };

  return (
    <div className="p-4 sm:p-6 min-h-screen">
      <Toaster position="top-right" />
      <h2 className="text-2xl font-bold mt-14">Payment History</h2>
{loading ? (
  <div className="flex justify-center items-center h-32">
    <ThreeDots height="50" width="50" color="#027840" />
  </div>
) : error ? (
  <p className="text-red-500">{error}</p>
) : payments.length === 0 ? (
  <div className="flex justify-center items-center h-32">
    <p className="text-gray-500 text-lg">No Payment found</p>
  </div>
) : (
  <div className="rounded-lg overflow-x-auto">
    <table className="w-full border-separate border-spacing-y-4 text-sm sm:text-base">
      <thead>
        <tr className="text-center">
          <th className="p-3 w-1/5">Subscription</th>
          <th className="p-3 w-1/5">Price</th>
          <th className="p-3 w-1/5">Status</th>
          <th className="p-3 w-1/5">Time Stamp</th>
          <th className="p-3 w-1/5">Action</th>
        </tr>
      </thead>
      <tbody>
        {paginatedPayments.map((payment) => {
          const planName = getPlanName(payment);
          const { date, time } = formatDateTime(payment.created_at);
          return (
            <tr
              key={payment.stripe_session_id}
              className="text-center bg-white py-2 border-2 border-separate border-spacing-y-4"
            >
              <td className="text-white flex justify-center items-center">
                <p
                  className={`px-2 py-1 rounded-[10px] w-[110px] ${getPlanClass(
                    planName
                  )}`}
                >
                  {planName}
                </p>
              </td>
              <td className="p-3">${payment.amount}</td>
              <td className="p-3">{renderStatus(payment.status)}</td>
              <td className="p-3 flex items-center justify-center">
                <MdDateRange className="mr-1 text-gray-600" />
                <span>{date}</span>
                <span className="ml-2 text-green-600 font-semibold">{time}</span>
              </td>
              <td className="p-3">
                <div className="flex justify-center">
                  <div
                    className="relative group cursor-pointer"
                    onClick={() => verifyCheckout(payment.stripe_session_id)}
                  >
                    <BsThreeDots className="text-green-600 hover:text-green-800 text-xl" />
                    <span className="absolute top-full left-full ml-1 mt-1 px-2 py-2 text-xs text-white bg-[#027840] rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      Requery
                    </span>
                  </div>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>

    {/* ✅ Pagination only shows if there are transactions */}
    <div className="flex justify-center items-center py-4 space-x-2 bg-white">
      <button
        className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
      >
        Prev
      </button>
      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i + 1}
          className={`px-3 py-1 border rounded ${
            currentPage === i + 1 ? "bg-[#027840] text-white" : ""
          }`}
          onClick={() => handlePageChange(i + 1)}
        >
          {i + 1}
        </button>
      ))}
      <button
        className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        Next
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default PaymentHistory;
