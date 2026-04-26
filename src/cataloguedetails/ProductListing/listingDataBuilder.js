// Helper function to convert object to single-quoted Python dict string format
const convertToPythonDictString = (obj) => {
  if (!obj) return "{}";
  if (typeof obj === "string") return obj;
  
  try {
    const pairs = Object.entries(obj).map(([key, value]) => {
      const escapedValue = String(value)
        .replace(/'/g, "\\'")
        .replace(/\n/g, "\\n");
      return `'${key}': '${escapedValue}'`;
    });
    return `{${pairs.join(", ")}}`;
  } catch {
    return "{}";
  }
};

const buildItemSpecificPayload = (itemSpecificFields = {}, selectedValues = {}) => {
  if (!itemSpecificFields || typeof itemSpecificFields !== "object") return {};
  return Object.keys(itemSpecificFields).reduce((acc, fieldName) => {
    acc[fieldName] = selectedValues[fieldName] ?? "";
    return acc;
  }, {});
};

// Utility function to build listing data object
export const buildListingData = (productListing, title, bestOfferEnabled, enableCharity, market_logos, id, itemSpecificFields = {}, selectedValues = {}) => {
  const itemSpecificPayload = buildItemSpecificPayload(itemSpecificFields, selectedValues);
  return {
    title: title || "",
    description: productListing?.detailed_description || productListing?.description || "" || "Null",
    start_price: productListing?.selling_price || productListing?.start_price || "" || "Null",
    category: productListing?.category || "" || "Null",
    postal_code: productListing?.zip_code || productListing?.postal_code || "" || "Null",
    location: productListing?.region || productListing?.location || "" || "Null",
    sku: productListing?.sku || "" || "Null",
    quantity: productListing?.quantity || "" || "Null",
    picture_detail: productListing?.image || productListing?.picture_detail || "" || "Null",
    product: id || null,
    country: productListing?.country || "" || "Null",
    city: productListing?.city || "" || "Null",
    bestOfferEnabled: bestOfferEnabled || false,
    enable_charity: enableCharity || "" || false,
    charity_id: enableCharity ? productListing?.charity_id : null,
    donation_percentage: enableCharity ? productListing?.donation_percentage : null,
    market_logos: JSON.stringify(market_logos) || "" || "Null",
    listingType: productListing?.listingType || "FixedPriceItem" || "Null",
    MPN: productListing?.mpn || "" || "Null",
    upc: productListing?.upc || "" || "Null",
    minimum_quantity: productListing?.minimum_quantity || "" || "Null",
    maximum_quantity: productListing?.maximum_quantity || "" || "Null",
    fixed_percentage_markup: productListing?.fixed_percentage_markup || "" || "Null",
    percentage_markup: productListing?.percentage_markup || "" || "Null", 
    Brand: productListing?.brand || productListing?.manufacturer || "" || "Null",
    cost: productListing?.cost || productListing?.total_product_cost || "" || "Null",
    fixed_markup: productListing?.fixed_markup || "" || "Null",
    shipping_height: productListing?.shipping_height || "" || "Null",
    shipping_width: productListing?.shipping_width || "" || "Null",
    us_size: productListing?.us_size || "" || "Null",
    model: productListing?.model || "" || "Null",
    shipping_weight: productListing?.shipping_weight || "" || "Null",
    shipping_length: productListing?.shipping_length || "" || "Null",
    mode: productListing?.mode || "" || "Null",
    min_profit_mergin: productListing?.min_profit_mergin || "" || "Null",
    profit_margin: productListing?.profit_margin || "" || "Null",
    send_min_price: productListing?.send_min_price || "" || "Null",
    map: productListing?.map || "" || "Null",
    msrp: productListing?.msrp || "" || "Null",
    shipping_cost: productListing?.shipping_cost || "" || "Null",
    price: productListing?.price || "" || "Null",
    total_product_cost: productListing?.total_product_cost || "" || "Null",
    payment_profileName: productListing?.payment_profileName || productListing?.payment_profilename || productListing?.payment_policy?.name || "" || "Null",
    payment_profileID: productListing?.payment_profileID || productListing?.payment_profileid || productListing?.payment_policy?.id || "" || "Null",
    shipping_profileName: productListing?.shipping_profileName || productListing?.shipping_profilename || productListing?.shipping_policy?.name || "" || "Null",
    shipping_profileID: productListing?.shipping_profileID || productListing?.shipping_profileid || productListing?.shipping_policy?.id || "" || "Null",
    return_profileName: productListing?.return_profileName || productListing?.return_profilename || productListing?.return_policy?.name || "" || "Null",
    return_profileID: productListing?.return_profileID || productListing?.return_profileid || productListing?.return_policy?.id || "" || "Null",
    return_profileID: productListing?.return_profileID || productListing?.return_profileid || productListing?.return_policy?.id || "",
    vendor_name: productListing?.name || productListing?.vendor_name || "" || "Null",
    item_specific_fields: JSON.stringify(itemSpecificPayload),
    ...itemSpecificPayload,
  };
};

// Utility function to build WooCommerce specific data
export const buildWoocommerceData = (productListing, title, selectedWooCategories, thumbnailImage, convertWcAttributesToObject, wcAttributes, id, market_logos) => {
  return {
    title: title || null,
    description: productListing?.detailed_description || productListing?.description || null,
    sku: productListing?.sku || null,
    location: productListing?.location || "" || null,
    category_id: productListing?.category_id || "" || "Null",
    start_price: productListing?.selling_price || productListing?.start_price || "Null",
    picture_detail: productListing?.image || productListing?.picture_detail || null,
    brand: productListing?.brand || productListing?.manufacturer || "" || null,
    postal_code: productListing?.postal_code || "" || "Null",
    quantity: productListing?.quantity || "" || "Null",
    return_profileID: productListing?.return_profileID || "" || "Null",
    quantity: productListing?.quantity || "Null",
    return_profileID: productListing?.return_profileID || "" || "Null",
    return_profileName: productListing?.return_profileName || "" || "Default",
    payment_profileID: productListing?.payment_profileID || "" || "Null",
    payment_profileName: productListing?.payment_profileName || "" || "Default",
    shipping_profileID: productListing?.shipping_profileID || "" || "Null",
    shipping_profileName: productListing?.shipping_profileName || "" || "Default",
    bestOfferEnabled: productListing?.bestOfferEnabled || false,
    listingType: productListing?.listingType || "" || "Null",
    gift: productListing?.gift || "" || "Null",
    categoryMappingAllowed: productListing?.categoryMappingAllowed || "" || "Null",
    product: id || "" || "Null",
    total_product_cost: productListing?.total_product_cost || "" || "Null",
    upc: productListing?.upc || "" || "Null",
    MPN: productListing?.MPN || "" || "Null",
    us_size: productListing?.us_size || "" || "Null",
    send_min_price: productListing?.send_min_price || "" || "Null",
    profit_margin: productListing?.profit_margin || "" || "Null",
    min_profit_mergin: productListing?.min_profit_mergin || "" || "Null",
    shipping_weight: productListing?.shipping_weight || "" || "Null",
    shipping_width: productListing?.shipping_width || "" || "Null",
    shipping_cost: productListing?.shipping_cost || "" || "Null",
    shipping_height: productListing?.shipping_height || "" || "Null", 
    shipping_length: productListing?.shipping_length || "" || "Null",
    maximum_quantity: productListing?.maximum_quantity || "" || "Null",
    minimum_quantity: productListing?.minimum_quantity || "" || "Null",
    total_product_cost: productListing?.total_product_cost || "" || "Null",
    model: productListing?.model || "" || "Null",
    msrp: productListing?.msrp || "" || "Null",
    enable_charity: productListing?.enable_charity || "" || false,
    donation_percentage: enableCharity ? productListing?.donation_percentage : null,
    charity_id: enableCharity ? productListing?.charity_id : null,
    fixed_markup: productListing?.fixed_markup || "" || "Null",
    fixed_percentage_markup: productListing?.fixed_percentage_markup || "" || "Null",
    city: productListing?.city || "" || "Null",
    cost: productListing?.cost || "" || "Null",
    country: productListing?.country || "" || "Null",
    category: productListing?.category || "" || "Null",
    mode: productListing?.mode || "" || "Null",
    price: productListing?.price || "" || "Null", 
    percentage_markup: productListing?.percentage_markup || "" || "Null",
    thumbnailImage: Array.isArray(thumbnailImage) && thumbnailImage.length > 0 ? JSON.stringify(thumbnailImage) : "[]",
    market_logos: JSON.stringify(market_logos) || "Null", 
    vendor_name: productListing?.vendor_name || "" || "Null",
    "California Prop 65 Warning": productListing?.CaliforniaProp65Warning || "" || "Null",
    "Expiration Date": productListing?.ExpirationDate || "" || "Null",
    "Unit Quantity": productListing?.UnitQuantity || "" || "Null",
    "Unit Type": productListing?.UnitType || "" || "Null",
     "Personalization Instructions": productListing?.PersonalizationInstructions || "" || "Null",
    mpn: productListing?.mpn || "" || "Null",
    woo_category_name: selectedWooCategories.join(","),
    item_specific_fields: JSON.stringify(convertWcAttributesToObject(wcAttributes)) || null,
  };
};

// Utility function to build WooCommerce update data
export const buildWoocommerceUpdate = (productListing, title, selectedWooCategories, thumbnailImage, convertWcAttributesToObject, wcAttributes, id, bestOfferEnabled, enableCharity, market_logos) => {
  return {
  title: title || null,
  description:productListing?.detailed_description || productListing?.description || null,
  sku: productListing?.sku || null,
  location: productListing?.location || "Null",
  category_id: productListing?.category_id || "Null",
  start_price: productListing?.selling_price || productListing?.start_price || null,
  picture_detail: productListing?.image || productListing?.picture_detail || null,
  postal_code: productListing?.postal_code || "Null",
  quantity: productListing?.quantity || "Null",
  return_profileID: productListing?.return_profileID || "Null",
  return_profileName: productListing?.return_profileName || "Default",
  payment_profileID: productListing?.payment_profileID || "Null",
  payment_profileName: productListing?.payment_profileName || "Default",
  shipping_profileID: productListing?.shipping_profileID || "Null",
  shipping_profileName: productListing?.shipping_profileName || "Default",
  bestOfferEnabled: productListing?.bestOfferEnabled ?? false,
  listingType: productListing?.listingType || null,
  gift: productListing?.gift ?? false,
  categoryMappingAllowed: productListing?.categoryMappingAllowed ?? true,
  product: productListing?.id || null,
  // product: productListing?.product_id || null,
  total_product_cost: productListing?.total_product_cost || null,
  upc: productListing?.upc || "Null",
  mpn: productListing?.mpn || null,
  us_size: productListing?.us_size ?? null,
  send_min_price: productListing?.send_min_price ?? null,
  profit_margin: productListing?.profit_margin || null,
  min_profit_mergin: productListing?.min_profit_mergin || null,
  shipping_weight: productListing?.shipping_weight ?? null,
  shipping_width: productListing?.shipping_width ?? null,
  shipping_cost: productListing?.shipping_cost || null,
  shipping_height: productListing?.shipping_height ?? null,
  shipping_length: productListing?.shipping_length ?? null,
  maximum_quantity: productListing?.maximum_quantity || null,
  minimum_quantity: productListing?.minimum_quantity ?? null,
  model: productListing?.model ?? null,
  msrp: productListing?.msrp || null,
  enable_charity: productListing?.enable_charity ?? false,
  donation_percentage: productListing?.donation_percentage || null,
  charity_id: productListing?.charity_id || null,
  fixed_markup: productListing?.fixed_markup || null,
  fixed_percentage_markup: productListing?.fixed_percentage_markup || null,
  city: productListing?.city || null,
  cost: productListing?.cost || null,
  country: productListing?.country || null,
  category: productListing?.category || null,
  mode: productListing?.mode || null,
  price: productListing?.price || null,
  percentage_markup: productListing?.percentage_markup || null,
  thumbnailImage: Array.isArray(thumbnailImage) && thumbnailImage.length > 0 ? JSON.stringify(thumbnailImage) : "Null",
  vendor_name: productListing?.vendor_name,
  woo_category_name: selectedWooCategories.join(","),
  "California Prop 65 Warning": productListing?.CaliforniaProp65Warning || "" || "Null",
    "Expiration Date": productListing?.ExpirationDate || "" || "Null",
    "Unit Quantity": productListing?.UnitQuantity || "" || "Null",
    "Unit Type": productListing?.UnitType || "" || "Null",
     "Personalization Instructions": productListing?.PersonalizationInstructions || "" || "Null",
  item_specific_fields: JSON.stringify(convertWcAttributesToObject(wcAttributes)),
  market_logos: JSON.stringify(market_logos),
  };
};

// Utility function to build update data
export const buildUpdateData = (productListing, title, bestOfferEnabled, enableCharity, market_logos, thumbnailImage, itemSpecificFields = {}, selectedValues = {}) => {
  const itemSpecificPayload = buildItemSpecificPayload(itemSpecificFields, selectedValues);
  return {
    title: title || productListing?.title || "",
    description: productListing?.detailed_description || productListing?.description || "",
    bestOfferEnabled: bestOfferEnabled || productListing?.bestOfferEnabled || false,
    brand: productListing?.brand || productListing?.manufacturer || "",
    upc: productListing?.upc || "Null",
    category: productListing?.category || "",
    category_id: productListing?.category_id || "",
    categoryMappingAllowed: productListing?.categoryMappingAllowed ? true : false,
    charity_id: enableCharity ? productListing?.charity_id : null,
    city: productListing?.city || "",
    cost: productListing?.cost || productListing?.total_product_cost || "",
    country: productListing?.country || "",
    donation_percentage: enableCharity ? productListing?.donation_percentage : null,
    enable_charity: enableCharity || productListing?.enable_charity || false,
    fixed_markup: productListing?.fixed_markup || null,
    fixed_percentage_markup: productListing?.fixed_percentage_markup || null,
    gift: productListing?.gift || null,
    listingType: productListing?.listingType || "FixedPriceItem",
    location: productListing?.location || "US",
    map: productListing?.map || "0.00",
    market_item_id: productListing?.market_item_id || "",
    market_logos: typeof market_logos === "string" ? market_logos : JSON.stringify(market_logos) || "",
    market_name: productListing?.market_name || "",
    min_profit_mergin: productListing?.min_profit_mergin || 0,
<<<<<<< Updated upstream
    item_specific_fields: JSON.stringify(itemSpecificPayload),
=======
    item_specific_fields: convertToPythonDictString(itemSpecificPayload),
>>>>>>> Stashed changes
    percentage_markup: productListing?.percentage_markup || null,
    picture_detail: productListing?.image || productListing?.picture_detail || "",
    postal_code: productListing?.postal_code || "",
    price: productListing?.price || "",
    product_id: productListing?.id || productListing?.product_id || "",
    profit_margin: productListing?.profit_margin || 0,
    quantity: productListing?.quantity || "0",
    payment_profileID: productListing?.payment_profileID || productListing?.payment_profileid || "",
    return_profileID: productListing?.return_profileID || productListing?.return_profileid || "",
    shipping_profileID: productListing?.shipping_profileID || productListing?.shipping_profileid || "",
    return_profileName: productListing?.return_profileName || productListing?.return_profileName || "Default",
    payment_profileName: productListing?.payment_profileName || productListing?.payment_profilename || "Default",
    shipping_profileName: productListing?.shipping_profilename || productListing?.shipping_profileName || "Default",
    shipping_cost: productListing?.shipping_cost || "0",
    shipping_height: productListing?.shipping_height || null,
    shipping_width: productListing?.shipping_width || null,
    sku: productListing?.sku || "",
    start_price: productListing?.selling_price || productListing?.start_price || "",
    thumbnailImage:
      Array.isArray(thumbnailImage) && thumbnailImage.length > 0
        ? JSON.stringify(thumbnailImage)
        : "[]",
    total_product_cost: productListing?.total_product_cost || "",
    vendor_name: productListing?.vendor_name || productListing?.name || "",
    woo_category_name: productListing?.woo_category_name || null,
    // ...itemSpecificPayload,
  }
};
