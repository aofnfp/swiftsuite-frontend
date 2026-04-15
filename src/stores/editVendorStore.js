import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useEditVendorStore = create(
  persist(
    (set) => ({
      // Data States
      enrollmentData: [],
      loader: false,
      actionLoading: {},
      popoverStates: {},
      expandedVendors: {},
      dataLoaded: false,
      
      // Pagination & Filter States
      searchTerm: "",
      entriesPerPage: 6,
      currentPage: 1,
      view: "custom",
      
      // Editing Vendor States
      matchedVendor: null,
      editingVendorName: "Unknown Vendor",
      editingIdentifier: "N/A",
      editingEnrollmentId: null,
      currentStep: 0,
      connection: null,

      // Actions
      setEnrollmentData: (data) => set({ enrollmentData: Array.isArray(data) ? data : [] }),
      setLoader: (value) => set({ loader: !!value }),
      setActionLoading: (update) => 
        set((state) => ({ 
          actionLoading: typeof update === "function" ? update(state.actionLoading) : update 
        })),
      setPopoverStates: (update) => 
        set((state) => ({ 
          popoverStates: typeof update === "function" ? update(state.popoverStates) : update 
        })),
      setExpandedVendors: (update) => 
        set((state) => ({ 
          expandedVendors: typeof update === "function" ? update(state.expandedVendors) : update 
        })),
      setDataLoaded: (value) => set({ dataLoaded: !!value }),
      
      setSearchTerm: (value) => set({ searchTerm: value || "" }),
      setEntriesPerPage: (value) => set({ entriesPerPage: Number(value) || 6 }),
      setCurrentPage: (value) => set({ currentPage: Number(value) || 1, searchTerm: "" }),
      setView: (value) => set({ view: value || "custom", currentPage: 1, searchTerm: "" }),
      
      setEditingVendor: (data, vendorName, identifier, enrollmentId) => 
        set({
          matchedVendor: data,
          editingVendorName: vendorName || "Unknown Vendor",
          editingIdentifier: identifier || "N/A",
          editingEnrollmentId: enrollmentId,
          currentStep: 0,
        }),
      
      setCurrentStep: (step) => set({ currentStep: step }),
      setConnection: (data) => set({ connection: data }),
      
      resetEditVendorStore: () =>
        set({
          enrollmentData: [],
          loader: false,
          actionLoading: {},
          popoverStates: {},
          expandedVendors: {},
          dataLoaded: false,
          searchTerm: "",
          entriesPerPage: 6,
          currentPage: 1,
          view: "custom",
          matchedVendor: null,
          editingVendorName: "Unknown Vendor",
          editingIdentifier: "N/A",
          editingEnrollmentId: null,
          currentStep: 0,
          connection: null,
        }),
    }),
    {
      name: "edit-vendor-store",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        entriesPerPage: state.entriesPerPage,
        matchedVendor: state.matchedVendor,
        editingVendorName: state.editingVendorName,
        editingIdentifier: state.editingIdentifier,
        editingEnrollmentId: state.editingEnrollmentId,
      }),
    }
  )
);
