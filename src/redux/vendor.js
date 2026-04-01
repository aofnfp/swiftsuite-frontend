import { createSlice } from "@reduxjs/toolkit";

// Get newAccount properly as a boolean
const newAccount = JSON.parse(localStorage.getItem("newAccount") || "false"); // true or false

const defaultVendorData = {
  vendor: null,
  description: "",
  fixed_markup: null,
  manufacturer: [],
  percentage_markup: null,
  product_category: [],
  product_filter: [],
  brand: [],
  send_orders: "false",
  shipping_cost: null,
  shipping_cost_average: false,
  stock_maximum: null,
  stock_minimum: null,
  truck_freight: false,
  oversized: false,
  third_party_marketplaces: false,
  returnable: false,
  shippable: [],
  identifier: null,
  name: null,
  update_inventory: "false",
  update_tracking: "false",
  currentStep: newAccount ? 1 : 0,
  ...(newAccount
    ? {
        account_data: {
          ftp_username: null,
          ftp_password: null,
          ftp_url: null,
          file_urls: null,
          host: null,
          POS: null,
          apiAccessId: null,
          apiAccessKey: null,
          username: null,
          password: null,
        },
      }
    : { account: null }),
};

export const slice = createSlice({
  name: "vendor",
  initialState: {
    vendorData: { ...defaultVendorData },
    product: [],
    productId: null,
    selectedProductName: "",
    catalogueVendor: [],
    selectedProduct: [],
    order: null,
  },

  reducers: {
    // Move to the next step
    handleNextStep: (state, action) => {
      state.vendorData = { ...state.vendorData, ...action.payload };

      if (action.payload.account_data) {
        state.vendorData.account_data = {
          ...state.vendorData.account_data,
          ...action.payload.account_data,
        };
      }

      const vendor = parseInt(state.vendorData.vendor, 10);
      const { currentStep } = state.vendorData;

      // if ((vendor === 1 || vendor === 4) && currentStep === 2) {
      //   state.vendorData.currentStep += 2;
      // } else {
      //   state.vendorData.currentStep += 1;
      // }
      state.vendorData.currentStep += 1;
    },

    // Go back a step
    handlePreviousStep: (state) => {
      const { currentStep, vendor } = state.vendorData;
      const newAccount = JSON.parse(
        localStorage.getItem("newAccount") || "false",
      );
      // if ((vendor === 1 || vendor === 4) && currentStep === 4 ) {
      //   state.vendorData.currentStep -= 2;
      // } else if
      if (!newAccount && currentStep === 2) {
        state.vendorData.currentStep -= 2;
      } else {
        state.vendorData.currentStep -= 1;
      }
    },

    handlePrevStep: (state) => {
      state.vendorData.currentStep -= 2;
      // const { currentStep, vendor } = state.vendorData;
      // if (vendor === 1 || vendor === 5) {
      // } else {
      //   state.vendorData.currentStep -= 1;
      // }
    },

    // Clear vendor data but retain the step
    clearVendorData: (state) => {
      const currentStep = state.vendorData.currentStep;
      state.vendorData = { ...defaultVendorData, currentStep };
    },

    handlePlanLength: (state, action) => {
      state.vendorData.planLength = action.payload;
    },

    handleChange: (state) => {
      state.vendorData.currentStep = 1;
    },

    handleConfirm: (state) => {
      state.vendorData.currentStep += 1;
    },

    // Product Management
    addToProduct: (state, action) => {
      state.product.push(action.payload);
    },

    increment: (state, action) => {
      const productItem = state.product.find(
        (item) => item.id === action.payload,
      );
      if (productItem) productItem.cartQuantity += 1;
    },

    decrement: (state, action) => {
      const productItem = state.product.find(
        (item) => item.id === action.payload,
      );
      if (productItem && productItem.cartQuantity > 1) {
        productItem.cartQuantity -= 1;
      }
    },

    remove: (state, action) => {
      state.product.splice(action.payload, 1);
    },

    setProductId: (state, action) => {
      state.productId = action.payload;
    },

    setProduct: (state, action) => {
      state.selectedProductName = action.payload;
    },

    setSelectedVendorName: (state, action) => {
      state.catalogueVendor = action.payload;
    },

    setVendorAccount: (state, action) => {
      const { accountId, vendorId } = action.payload;
      state.vendorData.account = accountId;
      state.vendorData.vendor = vendorId;
      state.vendorData.currentStep += 1;
    },

    setVendorName: (state, action) => {
      state.vendorData.vendor_name = action.payload;
      localStorage.setItem("vendor_name", action.payload);
    },

    userId: (state, action) => {
      state.vendorData.userId = action.payload;
    },

    selectedCatalogueVendor: (state, action) => {
      state.catalogueVendor = action.payload;
    },
  },
});

// Export actions
export const {
  handleNextStep,
  handlePreviousStep,
  handlePrevStep,
  clearVendorData,
  handlePlanLength,
  handleChange,
  handleConfirm,
  addToProduct,
  increment,
  decrement,
  remove,
  setProductId,
  setProduct,
  setSelectedVendorName,
  setVendorAccount,
  setVendorName,
  userId,
  selectedCatalogueVendor,
} = slice.actions;

// Export reducer
export default slice.reducer;
