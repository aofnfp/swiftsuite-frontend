import { createSlice } from "@reduxjs/toolkit";

const initialData =  {
  // const item = window.localStorage.getItem("editVendor");
  // return item ? JSON.parse(item) : { currentStep: 0 };
  
    "id": null,
    "vendor": null,
    "user": null,
    "account": null,
    "identifier": null,
    "created_at": null,
    "updated_at": null,
    "percentage_markup": null,
    "fixed_markup": null,
    "shipping_cost": null,
    "shipping_cost_average": false,
    "stock_minimum": null,
    "stock_maximum": null,
    "update_inventory": false,
    "send_orders": false,
    "update_tracking": false,
    "product_filter": [],
    "product_category": [],
    "brand": [],
    "manufacturer": [],
    "shippable": [],
    "serialized": false,
    "truck_freight": false,
    "oversized": false,
    "third_party_marketplaces": false,
    "returnable": false
   
};

export const editSlice = createSlice({
  name: "editVendor",
  initialState: {
    enrolmentUpdate:  { ...initialData, currentStep: 0 },
    updateVendor: {},
    currentStep: 0,
  },
  reducers: {
    handleNextStep: (state, action) => {
      state.enrolmentUpdate = { ...state.enrolmentUpdate, ...action.payload };

      const { currentStep, vendor } = state.enrolmentUpdate;

      // if ((vendor === 1 || vendor === 5) && currentStep === 0) {
      //   state.enrolmentUpdate.currentStep += 2; // Skip a step
      // } else {
      // }
      state.enrolmentUpdate.currentStep++;
      console.log(state.enrolmentUpdate);
      // localStorage.setItem("editVendor", JSON.stringify(state.enrolmentUpdate));
    },

    handlePreviousStep: (state) => {
      const { currentStep, vendor } = state.enrolmentUpdate;

      // if ((vendor === 1 || vendor === 5) && currentStep === 2) {
      //   state.enrolmentUpdate.currentStep -= 2; // Skip a step back
      // } else {
      // }
      state.enrolmentUpdate.currentStep--;

      localStorage.setItem("editVendor", JSON.stringify(state.enrolmentUpdate));
    },

    setVendorName: (state, action) => {
      state.enrolmentUpdate.vendor_name = action.payload; // Update the vendor name
      localStorage.setItem("vendor_name", action.payload);
    },

    matchedVendor: (state, action) => {
      state.updateVendor = action.payload; // Update vendor data
      localStorage.setItem("matchedVendor", JSON.stringify(action.payload));
    },
  },
});

export const { handleNextStep, handlePreviousStep, setVendorName, matchedVendor } = editSlice.actions;

export default editSlice.reducer;
