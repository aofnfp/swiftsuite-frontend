import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentStep: 0,
  formData: {
    customVendorInformation: {},
    customFtpCredentials: {},
    customApi: {},
  },
};

const customVendorSlice = createSlice({
  name: "customVendor",
  initialState,
  reducers: {
    handleNextStep: (state) => {
      if (state.currentStep < 3) {
        state.currentStep += 1;

        // ✅ Log all form data every time next step is triggered
        console.log("📦 All Form Data:", JSON.stringify(state.formData, null, 2));
      }
    },
    handlePreviousStep: (state) => {
      if (state.currentStep > 0) state.currentStep -= 1;
    },
    updateFormData: (state, action) => {
      const { step, data } = action.payload;
      state.formData[step] = { ...state.formData[step], ...data };

      // Optional: log each update for debugging
      console.log(`📝 Updated ${step}:`, state.formData[step]);
    },
    resetStepper: () => initialState,
  },
});

export const {
  handleNextStep,
  handlePreviousStep,
  updateFormData,
  resetStepper,
} = customVendorSlice.actions;

export default customVendorSlice.reducer;
