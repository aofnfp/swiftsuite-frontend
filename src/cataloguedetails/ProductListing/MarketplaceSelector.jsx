import React from "react";
import { Image } from "@heroui/react";
import { Checkbox } from "@nextui-org/react";

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
  return (
    <div className="bg-gray-100 p-4 my-5 rounded-lg space-y-4">
       <div className="space-y-2">
        {hasMarketplace("Ebay") && (
          <div className="flex items-center space-x-2 border border-gray-300 p-2 rounded">
            <Checkbox isSelected={isEbay} onValueChange={(checked) => setIsEbay(checked)} color="success">
              <Image isZoomed src="https://i.postimg.cc/3xZSgy9Z/ebay.png" alt="eBay" className="w-20 h-8 -z-1" />
            </Checkbox>
          </div>
        )}
        {hasMarketplace("Shopify") && (
          <div className="flex items-center space-x-2 border border-gray-300 p-2 rounded">
            <Checkbox isSelected={isShopify} onValueChange={(checked) => setIsShopify(checked)} color="success">
              <Image isZoomed src="https://i.postimg.cc/ZqRGnFZN/shopify.png" alt="shopify" className="w-20 h-8 -z-1" />
            </Checkbox>
          </div>
        )}
        {hasMarketplace("Woocommerce") && (
          <div className="flex items-center space-x-2 border border-gray-300 p-2 rounded">
            <Checkbox isSelected={isWoocommerce} onValueChange={(checked) => setIsWoocommerce(checked)} color="success">
              <Image isZoomed src="https://i.postimg.cc/Wbfbs7QB/woocommerce.png" alt="woocommerce" className="w-20 h-8 -z-1" />
            </Checkbox>
          </div>
        )}
        {hasMarketplace("Walmart") && (
          <div className="flex items-center space-x-2 border border-gray-300 p-2 rounded">
            <Checkbox isSelected={isWalmart} onValueChange={(checked) => setIsWalmart(checked)} color="success">
              <Image isZoomed src="https://i.postimg.cc/vZpK8RPJ/walmart.png" alt="walmart" className="w-20 h-8 -z-1" />
            </Checkbox>
          </div>
        )}
        {hasMarketplace("Amazon") && (
          <div className="flex items-center space-x-2 border border-gray-300 p-2 rounded">
            <Checkbox isSelected={isAmazon} onValueChange={(checked) => setIsAmazon(checked)} color="success">
              <Image isZoomed src="https://i.postimg.cc/JzYvBDpB/amazon.png" alt="amazon" className="w-20 h-8 -z-1" />
            </Checkbox>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketplaceSelector;
