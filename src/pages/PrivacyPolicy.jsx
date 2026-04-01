import React, { useRef } from "react";
import { FaShieldAlt } from "react-icons/fa";

const PrivacyPolicy = () => {
  const sections = [
    {
      title: "Information we collect",
      description:
        "We collect information necessary to provide and improve our dropshipping automation services:",
      items: [
        "Account Information: Name, email address, password, billing details.",
        "Business Data: Store URLs, product catalogs, supplier details, order history.",
        "Usage Data: Log files, device information, browser type, IP addresses, and activity within the platform.",
        "Cookies & Tracking: For analytics, personalization, and authentication.",
      ],
      foot: ""
    },
    {
      title: "How we use your information",
      description: "We use your information to:",
      items: [
        "Provide and maintain the Swift Suite platform.",
        "Sync inventory, product data, and order fulfillment with your suppliers.",
        "Communicate updates, alerts, and customer support.",
        "Improve functionality, security, and user experience.",
        "Comply with legal obligations."
      ],
      foot: "We do not sell your personal or business data to third parties."
    },
    {
      title: "Data Sharing",
      description: "We may share data with:",
      items: [
       "Suppliers/Integrations: Only when you connect them through Swift Suite.",
       "Service Providers: Hosting, analytics, payment processing, and security services.",
       "Legal Authorities: When required by law or to protect rights and safety.",
      ],
      foot:"All third parties are bound by confidentiality and data protection agreements."
    },
    {
      title: "Data Storage & Security",
      items: [
        "Data is encrypted in transit (TLS/SSL) and at rest (AES-256).",
        "Role-based access controls and audit logs protect sensitive data.",
        "We host data in secure, compliant servers (e.g., AWS, GCP).",
        "Backups are performed regularly to prevent data loss."
      ],
      foot: ""
    },
    {
      title: "Your Rights",
      description:
        "Depending on your location (e.g., under GDPR or CCPA), you may have the right to:",
      items: [
      "Access, update, or delete your personal data.",
      "Request a copy of the data we hold.",
      "Opt out of certain processing (e.g., marketing emails).",
      "Restrict or object to how your data is processed.",
      ],
      foot:"To exercise these rights, contact us at privacy@swiftsuite.app.",
    },
    {
      title: "Cookies & Tracking",
      description: "Swift Suite uses cookies and similar technologies for:",
      items: [
        'Session management and authentication.',
        'Personalizing user experience.',
        'Analyzing traffic and usage trends.',
      ],
      foot:'You can control cookies through your browser settings.'
    },
    {
      title: "Data Retention",
      items: [
        "We retain account data for as long as you maintain an active subscription.",
        "Upon cancellation, data may be retained for up to 90 days for recovery and compliance before secure deletion.",
        "Some legal or financial records may be retained longer as required by law.",
      ],
    },
    {
      title: "International Data Transfers",
      items: [
        'As a global SaaS platform, your information may be transferred to and stored in servers outside your country. We ensure such transfers are protected by standard contractual clauses and other safeguards.'
      ],
    },
    {
      title: "Children's Privacy",
      items: [
        'Swift Suite is not directed at individuals under 18. We do not knowingly collect data from minors.'
      ],
    },
    {
      title: "Updates to this Policy",
      items: [
        'We may update this Privacy Policy to reflect changes in our practices or legal requirements. Updates will be posted here with a revised “Effective Date.” Continued use of our platform means you accept the updated terms.'
      ],
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
      <section className="relative border flex bg-white">
        <section className="flex-[7]">
          <div className="bg-[#E0F5E3] flex items-center gap-5 py-3 md:ps-[10rem]">
            <div className="mb-1">
              <FaShieldAlt size={60} className="text-[#02784066]"/>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Privacy Policy</h1>
              <p className="font-semibold">
                This privacy policy explains how we collect, use and protect your
                <br /> information when you use our platform.
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
                  {section.description && <p className="text-gray-700">{section.description}</p>}
                  {section.items && (
                    <ul className="list-disc list-inside space-y-1 text-gray-700 w-3/4 font-[400]">
                      {section.items.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  )}
                  {section.foot && <p>{section.foot}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="flex-[2] bg-white absolute h-[50%] right-0 border border-[#DBD9D9] shadow-[inset_2px_2px_6px_rgba(0,0,0,0.05),inset_-2px_-2px_6px_rgba(255,255,255,0.7)] overflow-y-auto">
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

export default PrivacyPolicy;
