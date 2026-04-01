import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useVendorStore = create(
  persist(
    (set, get) => ({
      vendorName: "",
      vendorId: null,
      newAccount: false,
      currentStep: -1,
      vendorCategoryChecked: [],
      vendorManufacturerChecked: [],
      vendorProductChecked: [],
      vendorBrandChecked: [],
      vendorConnection: null,
      fromVendor: false,
      accountId: null,
      enrolmentResponse: null,
      setVendorContext: (context) =>
        set((state) => ({
          vendorName: context.vendorName !== undefined ? context.vendorName : state.vendorName,
          vendorId: context.vendorId !== undefined ? context.vendorId : state.vendorId,
          newAccount: context.newAccount !== undefined ? !!context.newAccount : state.newAccount,
          fromVendor: context.fromVendor !== undefined ? !!context.fromVendor : state.fromVendor,
          accountId: context.accountId !== undefined ? context.accountId : state.accountId,
        })),
      setVendorConnection: (connection) => set({ vendorConnection: connection || null }),
      setFromVendor: (value) => set({ fromVendor: !!value }),
      setAccountId: (id) => set({ accountId: id || null }),
      setEnrolmentResponse: (response) => set({ enrolmentResponse: response || null }),
      nextStep: () => set((state) => ({ currentStep: (state.currentStep ?? -1) + 1 })),
      setCurrentStep: (step) =>
        set({ currentStep: typeof step === "number" ? step : Number(step) || -1 }),
      resetVendor: () =>
        set({
          vendorName: "",
          vendorId: null,
          newAccount: false,
          currentStep: -1,
          vendorCategoryChecked: [],
          vendorManufacturerChecked: [],
          vendorProductChecked: [],
          vendorBrandChecked: [],
          vendorConnection: null,
          fromVendor: false,
          accountId: null,
          enrolmentResponse: null,
        }),
      setVendorCategoryChecked: (arr) => set({ vendorCategoryChecked: Array.isArray(arr) ? arr : [] }),
      setVendorManufacturerChecked: (arr) => set({ vendorManufacturerChecked: Array.isArray(arr) ? arr : [] }),
      setVendorProductChecked: (arr) => set({ vendorProductChecked: Array.isArray(arr) ? arr : [] }),
      setVendorBrandChecked: (arr) => set({ vendorBrandChecked: Array.isArray(arr) ? arr : [] }),
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
