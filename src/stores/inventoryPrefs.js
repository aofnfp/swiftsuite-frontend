import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useInventoryPrefsStore = create(
  persist(
    (set) => ({
      inventoryProductPerPage: 20,
      inventorySavedProductPerPage: 20,
      inventoryLogSavedProductPerPage: 20,
      viewMode: "list",
      multiSelect: false,
      inventorySearchQuery: "",
      inventorySavedSearchTerm: "",
      inventoryLogSearchTerm: "",
      inventorySortConfig: { key: "", direction: "" },
      inventoryDetailActiveTab: "details",
      setInventoryProductPerPage: (value) =>
        set({ inventoryProductPerPage: Number(value) || 20 }),
      setInventorySavedProductPerPage: (value) =>
        set({ inventorySavedProductPerPage: Number(value) || 20 }),
      setInventoryLogSavedProductPerPage: (value) =>
        set({ inventoryLogSavedProductPerPage: Number(value) || 20 }),
      setViewMode: (mode) => set({ viewMode: mode === "grid" ? "grid" : "list" }),
      setMultiSelect: (value) => set({ multiSelect: !!value }),
      setInventorySearchQuery: (q) => set({ inventorySearchQuery: q || "" }),
      setInventorySavedSearchTerm: (q) => set({ inventorySavedSearchTerm: q || "" }),
      setInventoryLogSearchTerm: (q) => set({ inventoryLogSearchTerm: q || "" }),
      setInventorySortConfig: (config) =>
        set({
          inventorySortConfig: {
            key: config?.key || "",
            direction: config?.direction || "",
          },
        }),
      setInventoryDetailActiveTab: (tab) =>
        set({ inventoryDetailActiveTab: tab || "details" }),
    }),
    {
      name: "inventory-prefs",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        inventoryProductPerPage: state.inventoryProductPerPage,
        inventorySavedProductPerPage: state.inventorySavedProductPerPage,
        inventoryLogSavedProductPerPage: state.inventoryLogSavedProductPerPage,
        viewMode: state.viewMode,
        multiSelect: state.multiSelect,
        inventorySearchQuery: state.inventorySearchQuery,
        inventorySavedSearchTerm: state.inventorySavedSearchTerm,
        inventoryLogSearchTerm: state.inventoryLogSearchTerm,
        inventorySortConfig: state.inventorySortConfig,
        inventoryDetailActiveTab: state.inventoryDetailActiveTab,
      }),
    }
  )
);
