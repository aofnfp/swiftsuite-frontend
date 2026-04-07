import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useListingStore = create(
  persist(
    (set) => ({
      productListing: "",
      title: "",
      bestOfferEnabled: false,
      enableCharity: false,
      isMappingChecked: false,
      isGiftChecked: false,
      description: "",
      selectedWooCategories: [],
      wcAttributes: [],
      selectedValues: {},
      thumbnailImage: "",
      setProductListing: (listing) => set({ productListing: listing || "" }),
      setTitle: (value) => set({ title: value || "" }),
      setBestOfferEnabled: (value) => set({ bestOfferEnabled: !!value }),
      setEnableCharity: (value) => set({ enableCharity: !!value }),
      setIsMappingChecked: (value) => set({ isMappingChecked: !!value }),
      setIsGiftChecked: (value) => set({ isGiftChecked: !!value }),
      setDescription: (value) => set({ description: value || "" }),
      setSelectedWooCategories: (update) =>
        set((state) => ({
          selectedWooCategories:
            typeof update === "function"
              ? update(state.selectedWooCategories)
              : Array.isArray(update)
              ? update
              : [],
        })),
      setWcAttributes: (update) =>
        set((state) => ({
          wcAttributes:
            typeof update === "function"
              ? update(state.wcAttributes)
              : Array.isArray(update)
              ? update
              : [],
        })),
      setSelectedValues: (update) =>
        set((state) => ({
          selectedValues:
            typeof update === "function"
              ? update(state.selectedValues)
              : update && typeof update === "object"
              ? update
              : {},
        })),
      setThumbnailImage: (value) => set({ thumbnailImage: value || "" }),
    }),
    {
      name: "listing-store",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        productListing: state.productListing,
        title: state.title,
        bestOfferEnabled: state.bestOfferEnabled,
        enableCharity: state.enableCharity,
        isMappingChecked: state.isMappingChecked,
        isGiftChecked: state.isGiftChecked,
        description: state.description,
        selectedWooCategories: state.selectedWooCategories,
        wcAttributes: state.wcAttributes,
        selectedValues: state.selectedValues,
        thumbnailImage: state.thumbnailImage,
      }),
    }
  )
);
