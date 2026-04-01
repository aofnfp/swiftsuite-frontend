import { createSlice } from "@reduxjs/toolkit";

const initialData = {
  id: null,
  name: "",
  logo: null,
  address_street1: "",
  address_street2: "",
  city: "",
  state: "",
  zip_code: "",
  country: "",
  description: "",
  api_details: [],
  username: "",
  pos: null,
  ftp_username: "",
  api_access_id: "",
  api_access_key: "",
  password: "",
  ftp_password: "",
  host: "",
  integration_type: "API",
  currentStep: 0,
};

export const newVendorSlice = createSlice({
  name: "newVendor",
  initialState: {
    addNewVendor: { ...initialData },
  },
  reducers: {
    handleNextStep: (state, action) => {
      const { increment, ...rest } = action.payload;
      state.addNewVendor = { ...state.addNewVendor, ...rest };
      if (increment) state.addNewVendor.currentStep++;
    },
    handlePreviousStep: (state) => {
      if (state.addNewVendor.currentStep > 0) {
        state.addNewVendor.currentStep--;
      }
    },
    setCurrentStep: (state, action) => {
      state.addNewVendor.currentStep = action.payload;
    },
    setVendorForEdit: (state, action) => {
      state.addNewVendor = {
        ...state.addNewVendor,
        ...action.payload,
        currentStep: 0,
      };
    },
    clearVendorData: (state) => {
      state.addNewVendor = { ...initialData };
    },
  },
});

export const {
  handleNextStep,
  handlePreviousStep,
  setCurrentStep,
  setVendorForEdit,
  clearVendorData,
} = newVendorSlice.actions;

export default newVendorSlice.reducer;
