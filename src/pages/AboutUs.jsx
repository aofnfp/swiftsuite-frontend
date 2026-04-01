import React from "react";
import img1 from "../Images/about1.jpg";
import img2 from "../Images/about2.jpg";
import img3 from "../Images/about3.jpg";
import { AiFillAppstore } from "react-icons/ai";
import { BiSync } from "react-icons/bi";
import { MdIntegrationInstructions } from "react-icons/md";
import { ListChecks } from "lucide-react";

const AboutUs = () => {
  const card = [
    {
      heading: "Automated Inventory Updates",
      details:
        "Real-time syncing to ensure you never oversell or miss out on stock changes.",
      icon: <AiFillAppstore />,
      color: "bg-[#027840]",
    },
    {
      heading: "Seamless Supplier Integrations",
      details:
        "Integrate your store with multiple vendors quickly and effortlessly.",
      icon: <MdIntegrationInstructions />,
      color: "bg-[#005D68]",
    },
    {
      heading: "Smart Order Management",
      details:
        "Automatically route orders to the right supplier based on cost, availability, or location.",
      icon: <ListChecks />,
      color: "bg-[#BB8232]",
    },
    {
      heading: "Product Data Sync",
      details:
        "Keep your product descriptions, images, and pricing always up to date.",
      icon: <BiSync />,
      color: "bg-[#005D6866]",
    },
    {
      heading: "One-Stop Dashboard",
      details:
        "Manage all your operations from a single, intuitive interface.",
      icon: <AiFillAppstore />,
      color: "bg-[#000000]",
    },
  ];

  return (
    <div className="bg-[#E7F2ED] flex flex-col gap-3">
      {/* Header Section */}
      <div className="py-5 bg-white px-4">
        <h1 className="text-center font-[700] text-[24px]">About Us</h1>
        <p className="text-center font-[400] text-[13px]">
          Hear more about why we at Swift Suite pursue excellent <br /> dropshipping.
        </p>
      </div>

      {/* Who We Are */}
      <div className="flex flex-col md:flex-row justify-between border px-4 md:px-20 py-10 bg-white gap-6 md:gap-0">
        <div className="flex-1 flex flex-col justify-center">
          <p className="font-[700] text-[20px] md:text-[24px] mb-3">
            Who We Are
          </p>
          <p className="md:w-2/3 text-[13px] font-[400] leading-relaxed">
            At Swift Suite, we are on a mission to remove the headaches from
            dropshipping. We understand that managing inventory, keeping products
            updated, and handling supplier integration can be overwhelming. That’s
            why we built Swift Suite – a powerful, one-stop solution designed to
            automate and simplify dropshipping operations for businesses of all
            sizes. Our platform seamlessly integrates your online store with
            suppliers, automatically updating inventory, syncing product data, and
            streamlining order fulfillment. With Swift Suite, you can focus on
            growing your business while we handle the complexities behind.
          </p>
        </div>
        <div className="flex justify-center">
          <img
            src={img1}
            alt="Who We Are"
            className="w-[280px] h-[280px] md:w-[305px] md:h-[328px] rounded-[20px] object-cover"
          />
        </div>
      </div>

      {/* Our Mission */}
      <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-20 px-4 md:px-20 py-10 bg-white">
        <div className="flex justify-center">
          <img
            src={img2}
            alt="Our Mission"
            className="w-full max-w-[400px] md:w-[434px] md:h-[302px] rounded-[20px] object-cover"
          />
        </div>
        <div className="flex flex-1 flex-col max-w-2xl justify-center">
          <p className="font-bold text-xl md:text-2xl mb-4">Our Mission</p>
          <p className="text-[14px] md:text-base font-normal leading-relaxed">
            To empower dropshippers worldwide by providing smart, reliable, and
            scalable solutions that eliminate inefficiencies and maximize
            profitability. We believe in making e-commerce easier, faster, and
            stress-free for every entrepreneur.
          </p>
        </div>
      </div>

      {/* Our Vision */}
      <div className="flex flex-col md:flex-row justify-between px-4 md:px-20 py-10 bg-white gap-6 md:gap-0">
        <div className="flex-1 flex flex-col justify-center">
          <p className="font-[700] text-[20px] md:text-[24px] mb-3">
            Our Vision
          </p>
          <p className="md:w-2/3 text-[13px] font-[400] leading-relaxed">
            To become the leading global platform that transforms dropshipping into
            a seamless, <br /> automated, and highly profitable business model,
            helping entrepreneurs build businesses without boundaries.
          </p>
        </div>
        <div className="flex justify-center">
          <img
            src={img3}
            alt="Our Vision"
            className="w-[280px] h-[280px] md:w-[340px] md:h-[350px] rounded-[20px] object-cover"
          />
        </div>
      </div>

      {/* What We Do */}
      <section className="py-10 bg-white mb-3 px-4">
        <h1 className="font-bold text-xl md:text-2xl text-center mb-5">
          What We Do
        </h1>
        <div className="flex justify-center items-center">
          <div className="flex flex-wrap justify-center items-center gap-6 lg:max-w-6xl">
            {card.map((item, index) => (
              <div
                key={index}
                className="flex flex-col bg-white rounded-xl border p-6 w-full sm:w-[300px] md:w-[330px] h-auto min-h-[200px] shadow-[0_4px_20px_0_#00000005]"
              >
                <div
                  className={`w-12 h-12 flex items-center justify-center rounded-[10px] ${item.color} text-white text-3xl mb-4`}
                >
                  {item.icon}
                </div>
                <h3 className="font-bold text-lg mb-2">{item.heading}</h3>
                <p className="text-[#00000099] text-sm">{item.details}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
