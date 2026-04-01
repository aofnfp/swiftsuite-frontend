import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import img from "../Images/Faqs.jpg";

const Faqs = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const location = useLocation();

  const faqs = [
    {
      question: "Can I change my billing plan?",
      answer:
        "Yes, you can upgrade, downgrade, or cancel your plan anytime from the Billing section in your account settings. Changes take effect at the end of your current billing cycle.",
    },
    {
      question: "How will I be billed for my subscription?",
      answer:
        "You’ll be billed automatically based on the plan you selected monthly. Charges are processed using the payment method saved in your account.",
    },
    {
      question: "What payment methods are accepted?",
      answer:
        "We accept major credit/debit cards and PayPal. Additional payment options may be available depending on your region.",
    },
    {
      question: "Are there any hidden fees?",
      answer:
        "No. All fees are clearly displayed during checkout. You’ll only be charged based on your selected subscription and any add-ons you explicitly choose.",
    },
    {
      question: "Is my billing information secure?",
      answer:
        "Absolutely. We use industry-standard encryption and PCI-compliant processors to ensure your payment data is secure at all times.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="mx-auto bg-[#E7F2ED]">
      {/* Show header only on /faqs */}
      {location.pathname === "/faqs" && (
        <section className="text-center w-full mb-3 py-10 bg-white">
          <h1 className="font-bold text-2xl">Frequently Asked Questions</h1>
          <p className="text-xs">
            Let us assure you of our services at Swift Suite.
          </p>
        </section>
      )}

      <section className="py-12 grid grid-cols-1 md:grid-cols-12 gap-8 bg-white px-6 md:px-[10rem]">
        {/* FAQ Section */}
        <div className="col-span-12 md:col-span-6 flex flex-col">
          <h1 className="text-xl font-bold text-center md:text-left mb-10">
            Frequently Asked Questions
          </h1>
          <div className="space-y-4 flex-1 max-w-5xl mx-auto md:mx-0">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-300 pb-4">
                {/* Question */}
                <button
                  className="font-semibold cursor-pointer flex items-center justify-between w-full focus:outline-none"
                  onClick={() => toggleFAQ(index)}
                >
                  <div className="flex items-center gap-2 text-left">
                    <span
                      className={`inline-block text-xl font-bold transform transition-transform duration-300 ${
                        openIndex === index ? "rotate-45" : ""
                      }`}
                    >
                      +
                    </span>
                    {faq.question}
                  </div>
                </button>

                {/* Answer */}
                <div
                  className={`overflow-hidden transition-all duration-500 ${
                    openIndex === index ? "max-h-40 mt-3" : "max-h-0"
                  }`}
                >
                  <p className="text-gray-600 text-sm md:text-base">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Image Section */}
        <div className="col-span-12 md:col-span-6 flex items-center justify-center">
          <img
            src={img}
            alt="FAQs illustration"
            className="max-w-[16rem] md:max-w-[20rem] w-full object-contain rounded-[10px]"
          />
        </div>
      </section>
    </div>
  );
};

export default Faqs;
