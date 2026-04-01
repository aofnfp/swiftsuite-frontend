import React from 'react'

const MarketLogos = ({ marketName }) => (  

  <div className="flex space-x-2 mt-2">
    {marketName === "Ebay" && (
      <img src='https://i.postimg.cc/3xZSgy9Z/ebay.png' className="w-10 h-5 cursor-pointer hover:opacity-70 hover:scale-110 transition-all duration-200" />
    )}
    {marketName === "Shopify" && (
      <img src='https://i.postimg.cc/ZqRGnFZN/shopify.png' className="w-10 h-5 cursor-pointer hover:opacity-70 hover:scale-110 transition-all duration-200" />
    )}
    {marketName === "Amazon" && (
      <img src='https://i.postimg.cc/JzYvBDpB/amazon.png' className="w-10 h-5 cursor-pointer hover:opacity-70 hover:scale-110 transition-all duration-200" />
    )}
    {marketName === "Walmart" && (
      <img src='https://i.postimg.cc/vZpK8RPJ/walmart.png' className="w-10 h-5 cursor-pointer hover:opacity-70 hover:scale-110 transition-all duration-200" />
    )}

    {marketName === "Woocommerce" && (
      <img
        src="https://i.postimg.cc/Wbfbs7QB/woocommerce.png"
        className="w-10 h-5 cursor-pointer hover:opacity-70 hover:scale-110 transition-all duration-200"
      />
    )}
  </div>
);

export default MarketLogos