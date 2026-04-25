import axiosInstance from "../utils/axiosInstance";

// Account Tier
export const accountTier = async () => {
  const response = await axiosInstance.get("/accounts/account-tier/")
  return response;
}
// Signup
export const signup = async (userData) => {
  const response = await axiosInstance.post("/accounts/register/", userData);
  return response.data;
};

  // Send OTP
  export const sendOtpEndpoint = async (email) => {
    const response = await axiosInstance.post("/accounts/send-otp/", { email });
    return response.data;
  };

// Signin
export const signin = async (credentials) => {
  const response = await axiosInstance.post("/accounts/login/", credentials);
  return response.data;
};

// Forgot Password
export const forgotPassword = async (email) => {
  const response = await axiosInstance.post("/accounts/password_reset/", { email });
  return response.data;
};

// Reset Password
export const resetPassword = async (uidb64, token, password, confirm_password) => {
  const response = await axiosInstance.patch(`/accounts/set_new_password/`, { uidb64, token, password, confirm_password });
  return response.data;
};

// Send OTP
export const sendotp = async (email) => {
  const response = await axiosInstance.post("/accounts/send-otp/", { email });
  return response.data;
};

// Verify Email
export const verifyEmail = async (otp) => {
  const response = await axiosInstance.post(`/accounts/verify_email/`, { otp });
  return response.data;
};

// Dashboard
export const dashboard = async () => {
  const response = await axiosInstance.get("/user/dashboard/");
  return response.data;
};

// ✅ Fetch All Vendor Enrolled
export const fetchVendorEnrolled = async () => {
  const response = await axiosInstance.get("/api/v2/all-enrolled-vendors/");
  return response.data;
};

// Vendor Enrolment
export const fetchAllVendors = async () => {
  const response = await axiosInstance.get("/api/v2/vendor/");
  return response.data;
};

// Upload Image
export const uploadImage = async (formData) => {
  const response = await axiosInstance.put(`/accounts/user-profile/`, formData);
  return response.data;
};

// Get Image
export const getImage = async (payload) => {
  const response = await axiosInstance.get(`/accounts/user-profile/`);
  return response.data;
};

// Vendor Selection
export const vendorSelection = async (vendorId) => {
  const response = await axiosInstance.get("/api/v2/vendor-account/", { params: { vendor_id: vendorId } });
  return response.data;
}

// Fpi Credential
export const fpiCredential = async (payload) => {
  const response = await axiosInstance.post(`/api/v2/vendor-test/`, payload);
  return response;
};

// Enrolment
export const enrolment = async (formData) => {
  const response = await axiosInstance.post('/api/v2/enrollment/', formData);
  return response;
};

// Update Enrolment
export const updateEnrolment = async (identifier, formData) => {
  const response = await axiosInstance.put(`/api/v2/update-enrollment/${identifier}/`, formData);
  return response;
}

// Marketplace Enrolment
export const marketplaceEnrolment = async (userId, marketplacePlatform, payload = {}) => {
  const response = await axiosInstance.put(`/marketplaceApp/complete_enrolment_or_update/${userId}/${marketplacePlatform}/`, payload);
  return response;
};

// Marketplace OAuth Callback
export const marketplaceOAuthCallback = async (userId, marketplacePlatform, authorization_code) => {
  const response = await axiosInstance.post(`/marketplaceApp/oauth/callback/${userId}/${marketplacePlatform}/`, { authorization_code });
  return response;
}

// WooCommerce Enrolment
export const woocommerceEnrolment = async (userId, payload) => {
  const response = await axiosInstance.post(`/marketplaceApp/woocommerce_enrolment/${userId}/`, payload);
  return response;
};

// Test WooCommerce Connection
export const testWoocommerceConnection = async (userId) => {
  const response = await axiosInstance.get(`/marketplaceApp/test_woocommerce_connection/${userId}/woocommerce/`);
  return response;
};

// Product Modal
export const productModal = async (userId, selectedProductId, productChange, selectedProductCatalogue) => {
  const response = await axiosInstance.put(`/api/v2/add-to-product/${userId}/${selectedProductId}/${productChange}/${selectedProductCatalogue}/`);
  return response.data;
};

// Product Click Request
export const productClickRequest = async (userId, productId, productChange) => {
  const response = await axiosInstance.get(`/api/v2/add-to-product/${userId}/${productId}/${productChange}/`);
  return response.data;
};

// Product Details
export const productDetails = async (userId, selectedProductId, handleCatalogue, selectedProductCatalogue) => {
  const response = await axiosInstance.put(`/vendor/add-to-product/${userId}/${selectedProductId}/${handleCatalogue}/${selectedProductCatalogue}/`);
  return response.data;
};

// Add Single Product
export const addSingleProduct = async (userId, productId, productChange, selectedProductCatalogue) => {
  const response = await axiosInstance.put(`/api/v2/add-to-product/${userId}/${productId}/${productChange}/${selectedProductCatalogue}/`);
  return response.data;
}

// Add All Products
export const addAllProducts = async (userId, productId, productChange) => {
  const response = await axiosInstance.get(`/api/v2/add-to-product/${userId}/${productId}/${productChange}/`);
  return response.data;
}

// Product Update Request
export const productUpdateRequest = async (userId, store, handleCatalogue, selectedProductCatalogue) => {
  const response = await axiosInstance.put(
    `/vendor/add-to-product/${userId}/${store}/${handleCatalogue}/${selectedProductCatalogue}/`
  );
  return response.data;
};

// Account Enrollments
export const accountEnrollments = async () => {
  const response = await axiosInstance.get('/api/v2/account-enrollments/');
  return response.data;
}

// View Enrollment with Identifier
export const viewEnrollmentWithIdentifier = async (enrollmentId) => {
  const response = await axiosInstance.get(`/api/v2/view-enrollment-with-identifier/${enrollmentId}/`);
  return response.data;
};

// Get Vendor Enrolled Identifier
export const getVendorEnrolledIdentifeir = async (userId) => {
  const response = await axiosInstance.get(`/inventoryApp/get_all_vendor_enrolled/${userId}/`);
  return response.data;
};

// Delete Enrollment
export const deleteEnrollment = async (identifier) => {
  const response = await axiosInstance.delete(`/api/v2/delete-enrollment/${identifier}/`);
  return response.data;
};

// Delete Vendor Account
export const deleteVendorAccount = async (accountId) => {
  const response = await axiosInstance.delete(`/api/v2/vendor-account/${accountId}/`);
  return response.data;
}

// Refresh Ebay Connection
export const refreshEbaySilentConnection = async (userId) => {
  const response = await axiosInstance.get(`/marketplaceApp/refresh_connection/${userId}/Ebay/`);
  return response.data;
};

// Refresh Ebay Connection
export const refreshEbayConnection = async (userId) => {
  const response = await axiosInstance.get(`/marketplaceApp/refresh_connection/${userId}/Ebay/`);
  return response.data;
}

// Listing image
export const uploadListingImage = async (userId, productId, product_name, formData) => {
  const response = await axiosInstance.post(`/marketplaceApp/upload_multiple_product_image/${productId}/${product_name}/${userId}/`, formData);
  return response.data;
};

// Get Listing image
export const getListingImage = async (userId, productId) => {
  const response = await axiosInstance.get(`/marketplaceApp/get_uploaded_images/${productId}/frangranxrollup/${userId}/`);
  return response.data;
};

// Delte Listing image
export const deleteListingImage = async (imageName, imageId) => {
  const response = await axiosInstance.get(`/marketplaceApp/delete_uploaded_images/${imageName}/${imageId}/`);
  return response.data;
}

// Order
export const orderProduct = async (selectedOrderPerPage, page, search, filters = {}, sortConfig = null) => {
  const params = { search, ...filters };
  if (sortConfig?.key === 'creationDate') {
    params.ordering = sortConfig.direction === 'ascending' ? 'creationDate' : '-creationDate';
  }
  const response = await axiosInstance.get(`/orderApp/orders/?limit=${selectedOrderPerPage}&page=${page}`, { params });
  return response.data;
};

// Get Order Details
export const getOrderDetails = async (orderId) => {
  const response = await axiosInstance.get(`/orderApp/orders/${orderId}/`);
  return response.data;
};

// Check RSRS Order
export const checkRsrOrder = async (marketplacePlatform, orderId) => {
  const response = await axiosInstance.post(`/orderApp/check_order_rsr/${marketplacePlatform}/${orderId}/`);
  return response.data;
};

// Place Order
export const placeOrder = async (marketplacePlatform, orderId) => {
  const response = await axiosInstance.post(`/orderApp/place_order/${marketplacePlatform}/${orderId}/`);
  return response.data;
};

// Track Order 
export const trackOrder = async (orderId) => {
  const response = await axiosInstance.post(`/orderApp/track_order/${orderId}/`);
  return response.data;
};

// Tracking FragranceX Order
export const trackingFragranceXOrder = async (orderId) => {
  const response = await axiosInstance.get(`/orderApp/get_tracking_fragranceX/${orderId}/`);
  return response.data;
};

// Push Tracking to Ebay
export const pushTrackingToEbay = async (orderId) => {
  const response = await axiosInstance.post(`/orderApp/push_tracking/${orderId}/`);
  return response.data;
};

// LISTING
// Fetch Product Listing, 
export const fetchProductListing = async (userId, productId) => {
  const response = await axiosInstance.get(`/marketplaceApp/get_product_to_list_details/${userId}/Ebay/${productId}/`);
  return response.data;
};

// Product Update Fetch
export const fetchProductUpdate = async (productId) => {
  const response = await axiosInstance.get(`/inventoryApp/get_saved_product_for_listing/${productId}/`);
  return response.data;
}

// Item Specific Category
export const userCategoriesId = async (userId, userCategoryId) => {
  const response = await axiosInstance.get(`/marketplaceApp/get_item_specific_fields/${userId}/Ebay/${userCategoryId}/`);
  return response.data;
}

// Fetch User Category Id
export const fetchUserCategoryId = async (userId, productId) => {
  const response = await axiosInstance.get(`/marketplaceApp/get_product_to_list_details/${userId}/Ebay/${productId}/`);
  return response.data;
}

// Get Item Leaf Category
export const fetchItemLeafCategory = async (userId, categoryId) => {
  const response = await axiosInstance.get(`/marketplaceApp/get_item_leaf_category/${userId}/Ebay/${categoryId}/`);
  return response.data;
}

// Listing Preferences
export const listingPreferencesDetails = async (userId) => {
  const response = await axiosInstance.get(`/marketplaceApp/refresh_connection/${userId}/Ebay/`);
  return response.data;
};

// Full marketplace enrollment record (includes fixed_markup, profit_margin, etc.).
// Used by detail/modal views to overlay live enrollment values on top of an
// inventory row's frozen-at-write-time copies. The list endpoints return this
// alongside items already; this is for endpoints that don't.
export const getMarketplaceEnrolmentDetail = async (userId, marketName) => {
  const response = await axiosInstance.get(
    `/marketplaceApp/get_enrolment_detail/${userId}/${encodeURIComponent(marketName)}/`
  );
  return response.data;
};

// Cache-first live ItemSpecifics for an existing eBay listing.
//
// First call for an item: backend hits eBay's GetItem and saves to the row,
// returns `{ item_specifics, source: "ebay_live" }`.
// Subsequent calls: backend returns the cached row value, `source: "cache"`.
// Pass refresh=true to force a fresh eBay fetch (e.g. user clicked Refresh).
export const getLiveItemSpecifics = async (userId, inventoryId, refresh = false) => {
  const url = `/inventoryApp/get_live_item_specifics/${userId}/${inventoryId}/${
    refresh ? "?refresh=1" : ""
  }`;
  const response = await axiosInstance.get(url);
  return response.data;
};

// Product Listing 
export const marketplaceProductListing = async (userId, marketplacePlatform, category_id, listingData) => {
  const response = await axiosInstance.post(`/marketplaceApp/marketplace_product_listing/${userId}/${marketplacePlatform}/${category_id}/`, listingData);
  return response.data;
}

// Product Saving
export const marketplaceProductSaving = async (userId, marketplacePlatform, category_id, savingData) => {
  const response = await axiosInstance.post(`/marketplaceApp/save_product_before_listing/${userId}/${marketplacePlatform}/${category_id}/`, savingData);
  return response.data;
}

// marketPlace Product Update
export const marketPlaceProductUpdate = async (userId, marketplacePlatform, inventory_id, updateData) => {
  const response = await axiosInstance.put(`/inventoryApp/update_item_details_on_marketplace/${userId}/${marketplacePlatform}/${inventory_id}/`, updateData);
  return response.data;
};

// Get Marketplaces Enrolled
export const enrolledMarketplaces = async (userId) => {
  const response = await axiosInstance.get(`/inventoryApp/get_all_marketplaces_enrolled/${userId}/`);
  return response.data;
};

// Get WooCommerce Category
export const getWooCommerecCategoryName = async (userId) => {
  const response = await axiosInstance.get(`/marketplaceApp/get_product_category/${userId}/Woocommerce/`);
  return response.data;
};

// Get Marketplace Activities Log
export const getMarketplaceActivitiesLog = async (page, selectedProductPerPage) => {
  const response = await axiosInstance.get(`/inventoryApp/get_marketplace_activities_log/${page}/${selectedProductPerPage}/`);
  return response.data;
};

// Get Inventory Price Quantity Update Log
export const getQuantityUpdateLog = async (page, selectedProductPerPage) => {
  const response = await axiosInstance.get(`/inventoryApp/get_inventory_price_quantity_update_log/${page}/${selectedProductPerPage}/`);
  return response.data;
};

// Invemtory
export const getInventoryProducts = async (userId, page, selectedProductPerPage, marketplaceParam = "") => {
  const url = `/inventoryApp/get_all_inventory_items/${userId}/${page}/${selectedProductPerPage}/${marketplaceParam}`;
  const response = await axiosInstance.get(url);
  return response.data;
};

// Inventory - get details
export const getInventoryProductDetails = async (userId, inventoryId) => {
  const response = await axiosInstance.get(`/inventoryApp/get_inventory_item_details/${userId}/${inventoryId}/`);
  return response.data;
}
// Inventory - search endpoint (by SKU/UPC/keyword)
export const searchInventoryProducts = async (userId, page, selectedProductPerPage, search_query) => {
  const response = await axiosInstance.get(`/inventoryApp/search_query_inventory_items/${userId}/${page}/${selectedProductPerPage}/?search_query=${encodeURIComponent(search_query)}`);
  return response.data;
};

// 
export const getInventoryProductsSortedByLastUpdated = async (userId, page, selectedProductPerPage) => {
  const response = await axiosInstance.get(`/inventoryApp/get_inventory_items_sorted_by_last_updated/${userId}/${page}/${selectedProductPerPage}/`);
  return response.data;
}

export const searchUnmappedInventoryProducts = async (userId, page, selectedProductPerPage, search_query) => {
  const response = await axiosInstance.get(`/inventoryApp/search_query_unmapped_inventory_items/${userId}/${page}/${selectedProductPerPage}/?search_query=${encodeURIComponent(search_query)}`);
  return response.data;
};

// unmapped inventory products
export const  getUnmappedInventoryProducts = async (userId, page, selectedProductPerPage, marketplaceParam = "") => {
  const response = await axiosInstance.get(`/inventoryApp/get_all_unmapped_items/${userId}/${page}/${selectedProductPerPage}${marketplaceParam}`);
  return response.data;
};
export const getSavedInventoryProducts = async (userId, page, selectedProductPerPage) => {
  const response = await axiosInstance.get(`/inventoryApp/get_all_saved_inventory_items/${userId}/${page}/${selectedProductPerPage}`);
  return response.data;
};

// Update product details
export const updateInventoryProductDetails = async (userId, inventoryId, editDetails) => {
  const response = await axiosInstance.put(`/inventoryApp/update_ebay_item_details/${inventoryId}/${userId}/`, editDetails);
  return response.data;
};

// Map Inventory Items
export const mapInventoryItems = async (userId, marketplacePlatform, payload) => {
  const response = await axiosInstance.put(`/inventoryApp/map_inventory_item_to_vendor/${userId}/${marketplacePlatform}/`, payload);
  return response.data;
};

// Delete product (local inventory or eBay)
export const deleteProduct = async (userId, id, endOnEbay = false) => {
  const endpoint = endOnEbay ? `/inventoryApp/end_and_delete_product_from_ebay/${userId}/${id}/` : `/inventoryApp/delete_product_from_inventory/${id}/`;
  return axiosInstance.get(endpoint);
};

// Delete product from Inventory
export const deleteProductFromInventory = async (id) => {
  const response = await axiosInstance.get(`/inventoryApp/delete_product_from_inventory/${id}/`);
  return response.data;
};

