import React, { useRef } from "react";
import { GrNotes } from "react-icons/gr";

const TermsOfService = () => {
  const sections = [
    {
      title: "Eligibility",
      items: ["You must be at least 18 years old to use Swift Suite."],
      foot: "By registering, you confirm that all information provided is accurate and complete.",
    },
    {
      title: "Service provided",
      description: "Swift Suite offers tools to:",
      items: [
        "Sync inventory and product data with suppliers.",
        "Automate order routing and fulfillment.",
        "Manage multiple suppliers through one dashboard.",
        "Access analytics and reporting.",
      ],
      foot: "We reserve the right to add, update, or discontinue features at our discretion.",
    },
    {
      title: "User Responsibilities",
      description: "By using Swift Suite, you agree to:",
      items: [
        "Keep your account credentials secure.",
        "Use the platform only for lawful business purposes.",
        "Ensure compliance with your local laws, taxes, and regulations.",
        "Maintain up-to-date and accurate supplier/store data.",
      ],
    },
    {
      title: "Prohibited Users",
      description: "You may not use Swift Suite to:",
      items: [
        "Engage in fraudulent, harmful, or illegal activity.",
        "Infringe on intellectual property rights.",
        "Attempt to disrupt or exploit the platform’s infrastructure.",
        "Share access with unauthorized third parties.",
      ],
    },
    {
      title: "Fees & Payments",
      items: [
        "Swift Suite operates on a subscription model.",
        "Fees are billed according to your plan and payment cycle.",
        "All payments are non-refundable, except as required by law.",
        "Failure to pay may result in account suspension or termination.",
      ],
    },
    {
      title: "Data & Privacy",
      items: [
        "By using Swift Suite, you consent to our Privacy Policy, which outlines how we collect and process your data.",
        "We do not claim ownership of your store or supplier data.",
        "You are responsible for ensuring compliance with GDPR, CCPA, or other applicable laws when handling customer data.",
      ],
    },
    {
      title: "Intellectual Property",
      items: [
        "Swift Suite and its underlying software, trademarks, and content are our exclusive property.",
        "You are granted a limited, non-exclusive, non-transferable license to use the platform solely for your business.",
      ],
    },
    {
      title: "Service Availabilty",
      items: [
        "We strive for 99.9% uptime, but do not guarantee uninterrupted service.",
        "Planned maintenance or unforeseen downtime may temporarily affect access.",
        "We are not liable for losses caused by downtime, delays, or third-party service failures.",
      ],
    },
    {
      title: "Termination",
      description: "We may suspend or terminate your account if you:",
      items: [
        "Violate these Terms.",
        "Fail to pay subscription fees.",
        "Misuse or attempt to exploit the platform.",
      ],
      foot: "Upon termination, your access will end immediately, but certain obligations (e.g., outstanding payments, data responsibilities) will continue.",
    },
    {
      title: "Limitation of Liability",
      description: "To the fullest extent permitted by law:",
      items: [
        "Swift Suite is not responsible for indirect, incidental, or consequential damages, including lost profits, data loss, or supplier errors.",
        "Our maximum liability is limited to the amount paid by you in the last 12 months of service.",
      ],
    },
    {
      title: "Changes to Terms",
      description:
        "We may update these Terms at any time. Updates will be posted with a revised effective date. Continued use of Swift Suite constitutes acceptance of the updated Terms.",
    },
    {
      title: "Governing Law",
      description:
        "These Terms are governed by the laws of [Insert Country/State], without regard to conflict of law principles.",
    },
  ];

  const sectionRefs = useRef([]);

  const handleScroll = (index) => {
    const el = sectionRefs.current[index];
    if (el) {
      const headerOffset = 80;
      const elementPosition = el.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <div className="md:px-10 py-5 bg-[#E7F2ED]">
      <section className="relative flex bg-white">
        <section className="flex-[7]">
          <div className="bg-[#E0F5E3] flex items-center gap-5 py-3 md:ps-[10rem]">
            <div className="mb-1">
              <GrNotes size={60} className="text-[#027840]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Terms of Service</h1>
              <p className="font-semibold w-1/2">
                Our Terms of Service govern your use of SwiftSuite and our dropshipping automation platform, accessible at{" "}
                <span className="text-green-600">swiftsuite.app</span>. By creating an account or using our services, you
                agree to these Terms.
              </p>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {sections.map((section, index) => (
              <div
                key={index}
                ref={(el) => (sectionRefs.current[index] = el)}
                className="flex items-start gap-4"
              >
                <span className="text-xl font-bold">{index + 1}.</span>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">{section.title}</h2>
                  {section.description && <p className="text-gray-700 w-3/4">{section.description}</p>}
                  {section.items && (
                    <ul className="list-disc list-inside w-3/4 space-y-1 text-gray-700 font-[400]">
                      {section.items.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  )}
                  {section.foot && <p className="w-3/4">{section.foot}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="flex-[3] bg-white absolute h-[50%] right-0 border border-[#DBD9D9] shadow-[inset_2px_2px_6px_rgba(0,0,0,0.05),inset_-2px_-2px_6px_rgba(255,255,255,0.7)] overflow-y-auto">
          <ol className="list-decimal list-inside space-y-12 text-gray-700 px-7 py-10 font-semibold">
            {sections.map((section, index) => (
              <li
                key={index}
                className="cursor-pointer hover:text-green-700"
                onClick={() => handleScroll(index)}
              >
                {section.title}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div className="bg-[#027840] text-center text-white py-5">
        <h1 className="text-xl font-bold">Contact Us</h1>
        <p>For questions about this Privacy Policy, please contact:</p>
        <span>Email: contact@swiftsuite.app</span>
      </div>
    </div>
  );
};

export default TermsOfService;
