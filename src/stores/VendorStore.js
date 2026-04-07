import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const initialState = {
  vendorName: "",
  vendorId: null,
  newAccount: false,
  currentStep: 0,
  vendorCategoryChecked: [],
  vendorManufacturerChecked: [],
  vendorProductChecked: [],
  vendorBrandChecked: [],
  vendorConnection: null,
  fromVendor: false,
  accountId: null,
  enrolmentResponse: null,
};

export const useVendorStore = create(
  persist(
    (set) => ({
      ...initialState,

      setVendorContext: (context) =>
        set((state) => {
          const vendorChanged =
            context.vendorName !== undefined &&
            context.vendorName !== state.vendorName;

          return {
            vendorName:
              context.vendorName !== undefined
                ? context.vendorName
                : state.vendorName,
            vendorId:
              context.vendorId !== undefined
                ? context.vendorId
                : state.vendorId,
            newAccount:
              context.newAccount !== undefined
                ? Boolean(context.newAccount)
                : state.newAccount,
            fromVendor:
              context.fromVendor !== undefined
                ? Boolean(context.fromVendor)
                : state.fromVendor,
            accountId:
              context.accountId !== undefined
                ? context.accountId
                : state.accountId,
            currentStep: vendorChanged ? 0 : state.currentStep,
          };
        }),

      setVendorConnection: (connection) =>
        set({ vendorConnection: connection ?? null }),

      setFromVendor: (value) =>
        set({ fromVendor: Boolean(value) }),

      setAccountId: (id) =>
        set({ accountId: id ?? null }),

      setEnrolmentResponse: (response) =>
        set({ enrolmentResponse: response ?? null }),

      nextStep: () =>
        set((state) => ({
          currentStep: state.currentStep + 1,
        })),

      setCurrentStep: (step) =>
        set({
          currentStep: Number.isNaN(Number(step)) ? 0 : Number(step),
        }),

      resetVendor: () => set(initialState),

      setVendorCategoryChecked: (arr) =>
        set({ vendorCategoryChecked: Array.isArray(arr) ? arr : [] }),

      setVendorManufacturerChecked: (arr) =>
        set({ vendorManufacturerChecked: Array.isArray(arr) ? arr : [] }),

      setVendorProductChecked: (arr) =>
        set({ vendorProductChecked: Array.isArray(arr) ? arr : [] }),

      setVendorBrandChecked: (arr) =>
        set({ vendorBrandChecked: Array.isArray(arr) ? arr : [] }),
    }),
    {
      name: "vendor-store",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        vendorName: state.vendorName,
        vendorId: state.vendorId,
        newAccount: state.newAccount,
        currentStep: state.currentStep,
        vendorCategoryChecked: state.vendorCategoryChecked,
        vendorManufacturerChecked: state.vendorManufacturerChecked,
        vendorProductChecked: state.vendorProductChecked,
        vendorBrandChecked: state.vendorBrandChecked,
        vendorConnection: state.vendorConnection,
        fromVendor: state.fromVendor,
        accountId: state.accountId,
        enrolmentResponse: state.enrolmentResponse,
      }),
    }
  )
);