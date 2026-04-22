import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useOrderStore = create(
  persist(
    (set) => ({
      selectedOrderPerPage: 20,
      searchQuery: "",
      debouncedQuery: "",
      page: 1,
      sortConfig: { key: null, direction: null },

      // Actions
      setSelectedOrderPerPage: (count) => set({ selectedOrderPerPage: Number(count) || 20 }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setDebouncedQuery: (query) => set({ debouncedQuery: query }),
      setPage: (value) => set({ page: Number(value) || 1 }),
      setSortConfig: (config) => set({ sortConfig: config }),
      setProductChange: (value) => set({ productChange: value }),

      resetOrder: () =>
        set({
          selectedOrderPerPage: 20,
          searchQuery: "",
          debouncedQuery: "",
          page: 1,
        }),
    }),
    {
      name: "order-store",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        selectedOrderPerPage: state.selectedOrderPerPage,
        searchQuery: state.searchQuery,
        debouncedQuery: state.debouncedQuery,
        page: state.page,
        sortConfig: state.sortConfig,
      }),
    },
  ),
);
