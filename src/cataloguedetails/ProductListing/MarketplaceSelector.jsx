import React from "react";
import { Checkbox } from "antd";

const MarketplaceSelector = ({
  hasMarketplace,
  isEbay,
  setIsEbay,
  isShopify,
  setIsShopify,
  isWoocommerce,
  setIsWoocommerce,
  isWalmart,
  setIsWalmart,
  isAmazon,
  setIsAmazon,
}) => {
  const marketplaces = [
    {
      key: "Ebay",
      checked: isEbay,
      onChange: setIsEbay,
      image: "https://i.postimg.cc/3xZSgy9Z/ebay.png",
      alt: "eBay",
    },
    {
      key: "Shopify",
      checked: isShopify,
      onChange: setIsShopify,
      image: "https://i.postimg.cc/ZqRGnFZN/shopify.png",
      alt: "Shopify",
    },
    {
      key: "Woocommerce",
      checked: isWoocommerce,
      onChange: setIsWoocommerce,
      image: "https://i.postimg.cc/Wbfbs7QB/woocommerce.png",
      alt: "WooCommerce",
    },
    {
      key: "Walmart",
      checked: isWalmart,
      onChange: setIsWalmart,
      image: "https://i.postimg.cc/vZpK8RPJ/walmart.png",
      alt: "Walmart",
    },
    {
      key: "Amazon",
      checked: isAmazon,
      onChange: setIsAmazon,
      image: "https://i.postimg.cc/JzYvBDpB/amazon.png",
      alt: "Amazon",
    },
  ];

  return (
    <div className="marketplace-selector bg-gray-100 p-4 my-5 rounded-lg space-y-4">
      <div className="space-y-3">
        {marketplaces
          .filter((market) => hasMarketplace(market.key))
          .map((market) => (
            <label
              key={market.key}
              className={`flex h-10 items-center justify-between gap-3 rounded-lg border px-3 py-1 bg-white transition-all cursor-pointer ${
                market.checked
                  ? "border-[#089451] shadow-sm"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={market.checked}
                  onChange={(e) => market.onChange(e.target.checked)}
                />
                <span className="text-sm font-medium text-gray-700">{market.key}</span>
              </div>
              <img
                src={market.image}
                alt={market.alt}
                className="h-14 w-auto object-contain p-2"
              />
            </label>
          ))}
      </div>
    </div>
  );
};

export default MarketplaceSelector;
