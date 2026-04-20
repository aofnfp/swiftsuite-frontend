import React, { useRef, useState } from "react";
import { SlPicture } from "react-icons/sl";
import { FiChevronDown } from "react-icons/fi";
import { Select } from "antd";

const SupportTicket = () => {
  const fileInput = useRef(null);

  const [formData, setFormData] = useState({
    requestType: "",
    remarks: "",
    file: null,
  });

  const [attachmentPreview, setAttachmentPreview] = useState("");
  const [openFaq, setOpenFaq] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = "";

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    setFormData((prev) => ({ ...prev, file }));

    const reader = new FileReader();
    reader.onloadend = () => setAttachmentPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    alert("Ticket Submitted Successfully!");
  };

  const supportHistory = [
    {
      regNo: "#23ADFGD",
      requestType: "Technical Support",
      date: "2026-01-10",
      status: "Open",
      color: "text-gray-900",
    },
    {
      regNo: "#AH3H221",
      requestType: "Billing & Payment",
      date: "2026-01-06",
      status: "Closed",
      color: "text-green-600",
    },
    {
      regNo: "#WED4198",
      requestType: "General Enquiry",
      date: "2025-12-29",
      status: "Pending",
      color: "text-red-500",
    },
  ];

  const faqs = [
    {
      id: "faq1",
      q: "How do I open a ticket?",
      a: "Go to Support Tickets, select a request type, add your remarks, attach an image if needed, then click “Submit Ticket”. You’ll see the ticket in your Support History.",
    },
    {
      id: "faq2",
      q: "Can I get a refund?",
      a: "Refund eligibility depends on the plan and payment type. Open a Billing & Payment ticket and include your transaction details so our team can review and respond.",
    },
    {
      id: "faq3",
      q: "Who handles ticket support?",
      a: "Tickets are handled by Swiftsuite’s support team. Technical issues go to the technical unit, and billing issues go to the billing unit for faster resolution.",
    },
    {
      id: "faq4",
      q: "Can I contact Swiftsuite admin?",
      a: "For security and tracking, we recommend using tickets. If escalation is required, support will route your issue to the appropriate admin internally.",
    },
  ];

  const toggleFaq = (id) => {
    setOpenFaq((prev) => (prev === id ? null : id));
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-20">
      <header className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Support Tickets
        </h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">
          Open a support ticket and our team will get back to you.
        </p>
      </header>

      <section className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-700">
            Create a new ticket
          </h2>
          <p className="text-sm text-gray-500">
            Fill up the information, then click the submit button
          </p>
        </div>

        <form onSubmit={handleSubmit} className="py-6 px-4 sm:px-6 lg:px-20">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
            <div className="w-full lg:w-1/2 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Request Type
                </label>
                <Select
                  className="w-1/2"
                  value={formData.requestType || ""}
                  onChange={(value) =>
                    setFormData({ ...formData, requestType: value })
                  }
                  options={[
                    { value: "", label: "Select type"},
                    { value: "General Enquiry", label: "General Enquiry" },
                    { value: "Technical Support", label: "Technical Support" },
                    { value: "Billing & Payment", label: "Billing & Payment" },
                    { value: "Account Management", label: "Account Management" },
                    { value: "Feedback & Suggestions", label: "Feedback & Suggestions" },
                  ]}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  File Upload
                </label>

                <div
                  className={`shadow-lg rounded-3xl border-2 border-dotted ${attachmentPreview ? "border-green-500" : "border-gray-300"
                    } flex flex-col items-center justify-center w-full sm:w-2/3 lg:w-[70%] h-[140px] sm:h-[160px] relative overflow-hidden cursor-pointer`}
                  onClick={() => fileInput.current?.click()}
                >
                  {attachmentPreview ? (
                    <img
                      src={attachmentPreview}
                      alt="Attachment"
                      className="absolute inset-0 w-full h-full object-contain rounded-3xl"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-1">
                      <SlPicture className="text-2xl" />
                      <span className="text-base sm:text-lg text-gray-500">
                        Add Images
                      </span>
                    </div>
                  )}

                  <input
                    type="file"
                    ref={fileInput}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Remarks
              </label>
              <textarea
                required
                rows={8}
                className="block p-2.5 w-full text-sm text-gray-900 bg-white rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
                placeholder="Write your remarks"
                value={formData.remarks}
                onChange={(e) =>
                  setFormData({ ...formData, remarks: e.target.value })
                }
              />
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-2.5 bg-[#027840] hover:bg-[#026335] text-white font-medium rounded transition-all shadow-sm focus:ring-4 focus:ring-green-200"
            >
              Submit Ticket
            </button>
          </div>
        </form>
      </section>

      <section className="mt-10">
        <div>
          <h1 className="text-lg sm:text-[20px] font-semibold">
            Latest Support History
          </h1>
          <p className="my-2 text-sm sm:text-base text-gray-700">
            Here is your most recent history
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              {supportHistory.map((item, idx) => (
                <div
                  key={item.regNo}
                  className={`px-4 sm:px-6 py-5 ${idx !== supportHistory.length - 1
                      ? "border-b border-gray-200"
                      : ""
                    }`}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    <div className="flex flex-col items-start">
                      <span className="text-base font-semibold text-gray-900">
                        {item.regNo}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        Support Req. No.
                      </span>
                    </div>

                    <div className="flex flex-col items-start">
                      <span className="text-base font-semibold text-gray-900">
                        {item.requestType}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        Request Type
                      </span>
                    </div>

                    <div className="flex flex-col items-start">
                      <span className="text-base font-semibold text-gray-900">
                        {item.date}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">Date</span>
                    </div>

                    <div className="flex flex-col items-start">
                      <span className={`text-base font-semibold ${item.color}`}>
                        {item.status}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        Support Status
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-5">
              <h2 className="text-lg font-semibold text-gray-900">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Quick answers to common questions.
              </p>

              <div className="mt-4 space-y-3">
                {faqs.map((f) => {
                  const isOpen = openFaq === f.id;

                  return (
                    <div
                      key={f.id}
                      className="border border-gray-200 rounded-xl overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(f.id)}
                        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-gray-50"
                      >
                        <span className="text-sm font-medium text-gray-900">
                          {f.q}
                        </span>

                        <FiChevronDown
                          className={`text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""
                            }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="px-4 pb-4 text-sm text-gray-600 bg-[#FBF7F7]">
                          {f.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SupportTicket;
