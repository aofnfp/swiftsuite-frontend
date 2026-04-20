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
      // The vendor name string (e.g. "fragrancex", "all"). The full vendor
      // object is derived at runtime from the live catalogue array.
      productChange: "all",
      filterApplied: false,
      // Only the identifier key string is persisted. The full identifier object
      // is derived at runtime from the live identifiers returned by the API.
      vendorIdentifierKey: null,
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
      setVendorIdentifierKey: (key) => set({ vendorIdentifierKey: key }),
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
          vendorIdentifierKey: null,
          multiSelect: false,
          showActionsLg: false,
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
        // Only persist the key strings, never the full objects
        vendorIdentifierKey: state.vendorIdentifierKey,
        multiSelect: state.multiSelect,
        showActionsLg: state.showActionsLg,
        selectedProductIds: state.selectedProductIds,
      }),
    }
  )
);
