import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useProductStore = create(
  persist(
    (set) => ({
      viewMode: "list",
      selectProductPerPage: 20,
      searchQuery: "",
      debouncedQuery: "",
      page: 1,
      productChange: "",
      isFilterApplied: false,
      selectedProductIds: [],

      // Actions
      setViewMode: (mode) => set({ viewMode: mode }),
      setSelectProductPerPage: (count) => set({ selectProductPerPage: Number(count) }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setDebouncedQuery: (query) => set({ debouncedQuery: query }),
      setPage: (page) => set({ page: Number(page) }),
      setProductChange: (value) => set({ productChange: value }),
      setIsFilterApplied: (applied) => set({ isFilterApplied: !!applied }),
      setSelectedProductIds: (ids) => set({ selectedProductIds: Array.isArray(ids) ? ids : [] }),

      resetProduct: () =>
        set({
          viewMode: "list",
          selectProductPerPage: 20,
          searchQuery: "",
          debouncedQuery: "",
          page: 1,
          productChange: "",
          isFilterApplied: false,
          selectedProductIds: [],
        }),
    }),
    {
      name: "product-store",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        viewMode: state.viewMode,
        selectProductPerPage: state.selectProductPerPage,
        searchQuery: state.searchQuery,
        debouncedQuery: state.debouncedQuery,
        page: state.page,
        productChange: state.productChange,
        isFilterApplied: state.isFilterApplied,
        selectedProductIds: state.selectedProductIds,
      }),
    }
  )
);
