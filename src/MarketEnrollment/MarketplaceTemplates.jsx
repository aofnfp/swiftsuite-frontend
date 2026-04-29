import React, { useState } from "react";
import { ChevronDown, Info } from "lucide-react";
import { marketPlaces } from "../MarketEnrollment/Data";

const templateOptions = [
  { name: "Fragrance and Beauty", color: "#112B52" },
  { name: "Sports & Outdoors", color: "#3E6B34" },
  { name: "Electronics & Tech", color: "#12365A" },
  { name: "Home & Garden", color: "#B06C4F" },
  { name: "Tools & Hardware", color: "#DB5B21" },
//   { name: "Jewelry & Watches", color: "#6B2BD9" },
//   { name: "Pet Supplies", color: "#89D6E2" },
//   { name: "Office Business", color: "#70D59A" },
//   { name: "Automotive & Parts", color: "#0D6836" },
//   { name: "Fashion & Apparel", color: "#286B73" },
//   { name: "Toys & Collectibles", color: "#F2FF00" },
//   { name: "Health & Wellness", color: "#02A91F" },
];

const marketplaceTemplateData = [
  {
    id: 1,
    name: "eBay",
    template: "Fragrance and Beauty",
    enabled: true,
  },
  {
    id: 2,
    name: "WooCommerce",
    template: "Fragrance and Beauty",
    enabled: false,
  },
];

const MarketplaceTemplates = () => {
  const [items, setItems] = useState(marketplaceTemplateData);
  const [openDropdown, setOpenDropdown] = useState(null);

  const handleToggle = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  const handleTemplateChange = (id, value) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, template: value } : item
      )
    );
    setOpenDropdown(null);
  };

  const getMarketplaceImage = (name) => {
    return marketPlaces.find(
      (market) => market.name?.toLowerCase() === name.toLowerCase()
    )?.image;
  };

  const getSelectedTemplate = (name) => {
    return templateOptions.find((template) => template.name === name);
  };

  return (
    <div className="space-y-8">
      {items.map((market) => {
        const image = getMarketplaceImage(market.name);
        const selectedTemplate = getSelectedTemplate(market.template);

        return (
          <div key={market.id} className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              {image && (
                <img
                  src={image}
                  alt={market.name}
                  className="w-[55px] h-[35px] object-contain"
                />
              )}

              <h3 className="font-bold text-black">{market.name}</h3>
            </div>

            <div className="flex justify-between gap-5">
              <div className="flex-1">
                <h4 className="font-semibold text-sm">Listing Template</h4>
                <p className="text-xs text-gray-400 mt-1">
                  Apply a template to all listings on this store
                </p>

                <div className="relative mt-3 w-full">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenDropdown(openDropdown === market.id ? null : market.id)
                    }
                    className="w-full h-14 border border-gray-200 rounded-lg px-4 flex items-center justify-between bg-white"
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className="w-9 h-9 rounded-lg shrink-0"
                        style={{
                          backgroundColor: selectedTemplate?.color || "#027840",
                        }}
                      />

                      <span className="text-sm font-bold text-black">
                        {market.template}
                      </span>
                    </div>

                    <ChevronDown
                      size={20}
                      className={`text-gray-500 transition ${
                        openDropdown === market.id ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {openDropdown === market.id && (
                    <div className="absolute left-0 top-[62px] z-30 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                      {templateOptions
                        .filter((template) => template.name !== market.template)
                        .map((template) => (
                          <button
                            key={template.name}
                            type="button"
                            onClick={() =>
                              handleTemplateChange(market.id, template.name)
                            }
                            className="w-full h-14 px-4 flex items-center gap-4 hover:bg-[#027840]/5 transition text-left"
                          >
                            <span
                              className="w-9 h-9 rounded-lg shrink-0"
                              style={{ backgroundColor: template.color }}
                            />

                            <span className="text-sm font-bold text-gray-500">
                              {template.name}
                            </span>
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end gap-4 pt-1 min-w-[240px]">
                <button className="bg-[#027840] text-white text-xs font-semibold px-4 py-2 rounded-lg">
                  Save changes
                </button>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggle(market.id)}
                    className={`w-14 h-8 rounded-full p-1 transition ${
                      market.enabled ? "bg-[#027840]" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`block w-6 h-6 rounded-full bg-white transition ${
                        market.enabled ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>

                  <span
                    className={`text-sm font-semibold ${
                      market.enabled ? "text-[#027840]" : "text-gray-400"
                    }`}
                  >
                    {market.enabled ? "Enabled" : "Disabled"}
                  </span>
                </div>

                <button className="border border-gray-200 text-gray-400 text-sm px-4 py-2 rounded-lg">
                  Preview
                </button>
              </div>
            </div>

            <div className="mt-5 border-t border-gray-100 pt-3 flex items-center gap-2 text-xs text-gray-500">
              <Info size={15} />
              <span>
                This template applies to all new listings by default. You can
                override the template per listing during the listing creation
                flow.
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MarketplaceTemplates;