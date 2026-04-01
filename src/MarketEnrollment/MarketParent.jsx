import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Ebay from './Ebaydata/Ebay';
import Amazon from './Amazondata/Amazon';
import Walmart from './Walmartdata/Walmart';
import Shopify from './Shopifydata/Shopify';
import Woocommerce from './Woocommercedata/Woocommerce';

const MarketParent = () => {
  const { state } = useLocation();
  const [marketPlace, setMarketPlace] = useState('');

  useEffect(() => {
    if (state?.marketPlace) { 
      setMarketPlace(state.marketPlace);
      localStorage.setItem(
        'marketPlace',
        JSON.stringify({ name: state.marketPlace })
      );
    } else {
      try {
        const stored = JSON.parse(localStorage.getItem('marketPlace'));
        if (stored?.name) {
          setMarketPlace(stored.name);
        }
      } catch (err) {
        console.error('Error parsing marketPlace from localStorage:', err);
      }
    }
  }, [state]);

  const marketplaceComponents = {
    shopify: Shopify,
    ebay: Ebay,
    amazon: Amazon,
    walmart: Walmart,
    woocommerce: Woocommerce,
  };

  const SelectedMarketplace =
    marketplaceComponents[marketPlace?.toLowerCase()] || (() => <p>No marketplace selected</p>);

  return (
    <section className="bg-[#E7F2ED]">
      <div className="pb-10 my-14 lg:mx-[10%] md:mx-10 mx-5">
        <SelectedMarketplace />
      </div>
    </section>
  );
};

export default MarketParent;
