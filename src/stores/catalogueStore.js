import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useCatalogueStore = create(
  persist(
    (set) => ({
      viewMode: "list",
      selectedProductPerPage: 20,
      searchQuery: "",
      debouncedQuery: "",
      page: 1,
      paginationContext: "vendor",
      productChange: "all",
      filterApplied: false,
      selectedVendor: null,
      selectedVendorIdentifier: null,
      multiSelect: false,
      showActionsLg: false,
      selectedProductIds: [],

      // Actions
      setViewMode: (mode) => set({ viewMode: mode }),
      setMultiSelect: (value) => set({ multiSelect: !!value }),
      setShowActionsLg: (value) => set({ showActionsLg: !!value }),
      setSelectedProductPerPage: (count) => set({ selectedProductPerPage: Number(count) }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setDebouncedQuery: (query) => set({ debouncedQuery: query }),
      setPage: (page) => set({ page: Number(page) }),
      setPaginationContext: (context) => set({ paginationContext: context }),
      setProductChange: (value) => set({ productChange: value }),
      setFilterApplied: (applied) => set({ filterApplied: !!applied }),
      setSelectedVendor: (vendor) => set({ selectedVendor: vendor }),
      setSelectedVendorIdentifier: (id) => set({ selectedVendorIdentifier: id }),
      setSelectedProductIds: (ids) => set({ selectedProductIds: Array.isArray(ids) ? ids : [] }),

      resetCatalogue: () =>
        set({
          viewMode: "list",
          selectedProductPerPage: 20,
          searchQuery: "",
          debouncedQuery: "",
          page: 1,
          paginationContext: "vendor",
          productChange: "all",
          filterApplied: false,
          multiSelect: false,
          showActionsLg: false,
          selectedVendor: null,
          selectedVendorIdentifier: null,
          selectedProductIds: [],
        }),
    }),
    {
      name: "catalogue-store",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        viewMode: state.viewMode,
        selectedProductPerPage: state.selectedProductPerPage,
        searchQuery: state.searchQuery,
        debouncedQuery: state.debouncedQuery,
        page: state.page,
        paginationContext: state.paginationContext,
        productChange: state.productChange,
        filterApplied: state.filterApplied,
        selectedVendor: state.selectedVendor,
        selectedVendorIdentifier: state.selectedVendorIdentifier,
      multiSelect: state.multiSelect,
      showActionsLg: state.showActionsLg,
      selectedProductIds: state.selectedProductIds,
    }),
    }
  )
);
