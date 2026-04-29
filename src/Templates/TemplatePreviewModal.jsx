import React from "react";
import { X, RefreshCw } from "lucide-react";

const TemplatePreviewModal = ({ template, selected, onToggle, onClose }) => {
  if (!template) return null;

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-6 lg:p-10">
     <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-5 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-black">{template.name}</h2>
            <p className="text-xs text-gray-500">by SwiftSuite</p>
          </div>

          <div className="flex items-center gap-4">
            <button className="h-10 px-4 border border-gray-200 rounded-lg text-sm text-gray-500 flex items-center gap-2">
              <RefreshCw size={15} />
              Replace Product
            </button>

            <span className="text-sm font-semibold text-[#027840]">
              {selected ? "Active" : "Inactive"}
            </span>

            <button
              onClick={() => onToggle(template.id)}
              className={`w-14 h-8 rounded-full p-1 transition ${
                selected ? "bg-[#027840]" : "bg-gray-300"
              }`}
            >
              <span
                className={`block w-6 h-6 rounded-full bg-white transition ${
                  selected ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>

            <button onClick={onClose}>
              <X size={22} />
            </button>
          </div>
        </div>

        <div className="p-5">
          <div className="border-2 border-blue-500 bg-white">
            <div
              className="px-6 py-4 flex items-center justify-between text-white"
              style={{ backgroundColor: template.color }}
            >
              <h1 className="text-xl font-bold">AOF EBAY STORE</h1>

              <div className="flex items-center gap-10 text-sm">
                <span>About Us</span>
                <span>Contact</span>
                <span>Feedback</span>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8">
                <div
                  className="h-[330px] rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${template.accent}20` }}
                >
                  <div
                    className="w-44 h-44 rounded-lg"
                    style={{ backgroundColor: template.accent }}
                  />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-black leading-tight">
                    Lattafa Jasoor by Lattafa Eau De Parfum Spray 3.4 oz/100ml
                    for Men Fragrance
                  </h2>

                  <h3
                    className="text-4xl font-bold mt-4"
                    style={{ color: template.color }}
                  >
                    US $42.54
                  </h3>

                  <div
                    className="h-px my-6"
                    style={{ backgroundColor: `${template.accent}80` }}
                  />

                  {[
                    ["Brand:", "Lattafa"],
                    ["Type:", "Eau De Parfum"],
                    ["Size:", "3.4oz (100ml)"],
                    ["Fragrance Family:", "Spicy, Woody, Oriental"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between py-3 text-sm"
                    >
                      <span className="text-gray-400">{label}</span>
                      <span
                        className="font-bold"
                        style={{ color: template.color }}
                      >
                        {value}
                      </span>
                    </div>
                  ))}

                  <div
                    className="h-px mt-4"
                    style={{ backgroundColor: `${template.accent}80` }}
                  />
                </div>
              </div>

              <div className="mt-8">
                <h3
                  className="text-xl font-bold mb-3"
                  style={{ color: template.color }}
                >
                  Item Description
                </h3>

                <div className="bg-gray-100 rounded-lg p-5 text-sm leading-relaxed text-black">
                  <p>
                    Lattafa Jasoor is a bold and captivating fragrance for men
                    that exudes strength, sophistication, and a touch of
                    mystery.
                  </p>
                  <p className="mt-4">
                    This Eau De Parfum features a dynamic blend of warm, spicy,
                    and woody notes, creating a powerful and long-lasting aroma.
                  </p>
                  <p className="mt-4">
                    The scent opens with rich, invigorating top notes, followed
                    by an intense heart of exotic spices and floral undertones,
                    resting on a deep and musky base.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                <div>
                  <h3
                    className="text-xl font-bold mb-3"
                    style={{ color: template.color }}
                  >
                    Key Features
                  </h3>

                  <div
                    className="rounded-lg p-5 text-white text-sm space-y-4"
                    style={{ backgroundColor: template.color }}
                  >
                    <p>• Bold and captivating spicy-woody fragrance</p>
                    <p>• Long-lasting scent that evolves through the day</p>
                    <p>• Suitable for evening wear or special occasions</p>
                    <p>• High-quality formulation with a rich aroma</p>
                  </div>
                </div>

                <div>
                  <h3
                    className="text-xl font-bold mb-3"
                    style={{ color: template.color }}
                  >
                    Ideal for
                  </h3>

                  <div className="rounded-lg p-5 bg-gray-300 text-sm space-y-4 text-black">
                    <p>• Men who enjoy bold, rich fragrances with depth</p>
                    <p>• Those looking for a signature scent for evenings</p>
                    <p>• Cooler weather when warmer scents are favored</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <div className="grid grid-cols-4 text-sm text-gray-400 border-b">
                  <button
                    className="text-left pb-3 font-bold"
                    style={{ color: template.color }}
                  >
                    Item Category
                  </button>
                  <button className="text-left pb-3">Item Specifics</button>
                  <button className="text-left pb-3">
                    Shipping, Payment & Return
                  </button>
                  <button className="text-left pb-3">Contact</button>
                </div>

                <div className="flex flex-wrap gap-4 mt-5 text-sm">
                  {["SKU: 467574", "UPC: 123245687901", "Brand: Fendi", "Category: Fashion Bag New Edition"].map(
                    (item) => (
                      <span
                        key={item}
                        className="px-4 py-2 rounded-lg"
                        style={{ backgroundColor: `${template.accent}30` }}
                      >
                        {item}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="bg-black text-white p-8 grid grid-cols-1 md:grid-cols-3 gap-10">
              <div>
                <h4 className="font-bold mb-4">Quick Links</h4>
                <p className="text-sm text-gray-300">About SwiftSuite</p>
                <p className="text-sm text-gray-300 mt-2">Contact Us</p>
                <p className="text-sm text-gray-300 mt-2">View All Products</p>
              </div>

              <div>
                <h4 className="font-bold mb-4">Payment Options</h4>
                <p className="text-sm text-gray-300">
                  Swift Suite ensures secure payment options via trusted
                  providers.
                </p>
              </div>

              <div>
                <h4 className="font-bold mb-4">We want to hear from you</h4>
                <p className="text-sm text-gray-300">
                  We value your feedback on our products and services.
                </p>
                <button
                  className="mt-4 px-5 py-2 rounded-lg text-white text-sm"
                  style={{ backgroundColor: template.color }}
                >
                  Submit feedback
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatePreviewModal;