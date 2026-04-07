import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Ebay from './Ebaydata/Ebay';
import Amazon from './Amazondata/Amazon';
import Walmart from './Walmartdata/Walmart';
import Shopify from './Shopifydata/Shopify';
import Woocommerce from './Woocommercedata/Woocommerce';
import { useMarketplaceStore } from '../stores/marketplaceStore';

const MarketParent = () => {
  const { state } = useLocation();
  const marketPlace = useMarketplaceStore((state) => state.marketPlace);
  const setMarketPlace = useMarketplaceStore((state) => state.setMarketPlace);

  useEffect(() => {
    if (state?.marketPlace) { 
      setMarketPlace(state.marketPlace);
    }
  }, [state, setMarketPlace]);

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
