import React from "react";
import ListingPreferences from "./ListingPreferences";

const PreferencesSection = ({ productListing, setProductListing, enableCharity, setEnableCharity }) => {
  return (
    <div>
      <ListingPreferences
        productListing={productListing}
        setProductListing={setProductListing}
        enableCharity={enableCharity}
        setEnableCharity={setEnableCharity}
      />
    </div>
  );
};

export default PreferencesSection;
