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
    return "Custom vendor";
  };

  const getPlanColor = (plan) => {
    if (plan === "Starter") return "bg-[#BB8232] text-white";
    if (plan === "Growth") return "bg-[#005D68] text-white";
    if (plan === "Premium") return "bg-[#000000] text-white";
    if (plan === "Enterprise") return "bg-[#027840] text-white";
    return "bg-gray-200 text-gray-900";
  };

  const renderStatus = (status) => {
    if (status === "paid") {
      return (
        <div className="flex items-center justify-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span className="text-emerald-700 font-medium text-sm">Paid</span>
        </div>
      );
    }
    if (status === "pending") {
      return (
        <div className="flex items-center justify-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
          <span className="text-amber-700 font-medium text-sm">Pending</span>
        </div>
      );
    }
    if (status === "failed") {
      return (
        <div className="flex items-center justify-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <span className="text-red-700 font-medium text-sm">Failed</span>
        </div>
      );
    }
    return <span className="text-gray-700 font-medium text-sm">{status}</span>;
  };

  const formatDateTime = (dateString) => {
    const dateObj = new Date(dateString);
    const date = dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    const time = dateObj.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return { date, time };
  };

  const SkeletonLoader = () => (
    <div className="space-y-3">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-xl p-4 border border-gray-100 flex items-center justify-between animate-pulse"
        >
          <div className="flex items-center gap-4 flex-1">
            <div className="h-8 w-24 bg-gray-200 rounded-lg"></div>
            <div className="h-6 w-16 bg-gray-200 rounded"></div>
          </div>
          <div className="h-6 w-20 bg-gray-200 rounded"></div>
          <div className="h-6 w-32 bg-gray-200 rounded"></div>
          <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-20 md:px-6 md:py-18 lg:px-8 lg:py-20">
        <Toaster position="top-right" />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
          <p className="text-gray-600 mt-2 text-sm">
            View and manage all your subscription payments
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <SkeletonLoader />
        ) : error ? (
          <div className="bg-white rounded-xl border border-red-200 p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <FaTimesCircle className="text-red-600 text-xl" />
            </div>
            <p className="text-red-700 font-medium">{error}</p>
            <button
              onClick={fetchPayments}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Try Again
            </button>
          </div>
        ) : payments.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <MdDateRange className="text-gray-400 text-2xl" />
            </div>
            <p className="text-gray-700 font-medium text-lg">
              No payments found
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Your payment history will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Desktop View */}
            <div className="hidden lg:block">
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Subscription
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {paginatedPayments.map((payment) => {
                        const planName = getPlanName(payment);
                        const { date, time } = formatDateTime(
                          payment.created_at
                        );
                        return (
                          <tr
                            key={payment.stripe_session_id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex items-center px-3 py-1.5 rounded-lg font-semibold text-sm ${getPlanColor(
                                  planName
                                )}`}
                              >
                                {planName}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-semibold text-gray-900">
                              ${parseFloat(payment.amount).toFixed(2)}
                            </td>
                            <td className="px-6 py-4">
                              {renderStatus(payment.status)}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <MdDateRange className="text-gray-400 text-lg flex-shrink-0" />
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {date}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {time}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <button
                                onClick={() =>
                                  verifyCheckout(payment.stripe_session_id)
                                }
                                disabled={
                                  verifying &&
                                  selectedId === payment.stripe_session_id
                                }
                                className="inline-flex items-center justify-center p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed group relative"
                                title="Verify payment"
                              >
                                {verifying &&
                                selectedId === payment.stripe_session_id ? (
                                  <ThreeDots
                                    height="16"
                                    width="16"
                                    color="#059669"
                                    radius="2"
                                  />
                                ) : (
                                  <BsThreeDots className="text-lg" />
                                )}
                                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                  Requery
                                </span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Mobile View */}
            <div className="lg:hidden space-y-4">
              {paginatedPayments.map((payment) => {
                const planName = getPlanName(payment);
                const { date, time } = formatDateTime(payment.created_at);
                return (
                  <div
                    key={payment.stripe_session_id}
                    className="bg-white rounded-xl border border-gray-100 p-4 hover:border-gray-200 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-lg font-semibold text-xs ${getPlanColor(
                          planName
                        )}`}
                      >
                        {planName}
                      </span>
                      <button
                        onClick={() =>
                          verifyCheckout(payment.stripe_session_id)
                        }
                        disabled={
                          verifying &&
                          selectedId === payment.stripe_session_id
                        }
                        className="text-gray-600 hover:text-emerald-600 disabled:opacity-50"
                      >
                        {verifying &&
                        selectedId === payment.stripe_session_id ? (
                          <ThreeDots
                            height="16"
                            width="16"
                            color="#059669"
                            radius="2"
                          />
                        ) : (
                          <BsThreeDots className="text-lg" />
                        )}
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 text-sm">Price</span>
                        <span className="font-semibold text-gray-900">
                          ${parseFloat(payment.amount).toFixed(2)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 text-sm">Status</span>
                        <div>{renderStatus(payment.status)}</div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 text-sm">Date</span>
                        <div className="text-right">
                          <div className="font-medium text-gray-900 text-sm">
                            {date}
                          </div>
                          <div className="text-xs text-gray-500">{time}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-sm transition-colors"
                  >
                    Previous
                  </button>

                  <div className="flex gap-2">
                    {[...Array(totalPages)].map((_, i) => {
                      const pageNum = i + 1;
                      const isCurrentPage = currentPage === pageNum;
                      const isNearCurrent =
                        Math.abs(pageNum - currentPage) <= 1;
                      const isFirstOrLast =
                        pageNum === 1 || pageNum === totalPages;

                      if (
                        !isCurrentPage &&
                        !isNearCurrent &&
                        !isFirstOrLast
                      ) {
                        if (pageNum === 2) {
                          return (
                            <span
                              key="ellipsis-left"
                              className="px-2 text-gray-400"
                            >
                              ...
                            </span>
                          );
                        }
                        if (pageNum === totalPages - 1) {
                          return null;
                        }
                        return null;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
                            isCurrentPage
                              ? "bg-emerald-600 text-white"
                              : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-sm transition-colors"
                  >
                    Next
                  </button>
                </div>

                <div className="text-center text-sm text-gray-600 mt-4">
                  Page{" "}
                  <span className="font-semibold text-gray-900">
                    {currentPage}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-900">
                    {totalPages}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;