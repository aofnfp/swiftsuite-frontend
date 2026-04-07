import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useMarketplaceStore = create(
  persist(
    (set) => ({
      // General Market States
      marketPlace: null,
      submittedMarketPlace: null,
      marketList: false,
      marketPerPage: 10,
      hasResponse: false,
      isSubmitting: false,
      selectedCountry: "",

      // eBay Connection States
      connectClicked: false,
      connectTime: null,
      ebayConnected: false,
      policiesLoaded: false,
      showAccessCodeButton: false,
      authorizationCode: "",
      
      // eBay UI States
      refreshIcon: false,
      isRotate: false,
      isRotating: false,
      modal2Open: false,
      
      // eBay Policy Toggles
      shipPolicyToggle: false,
      returnPolicyToggle: false,
      paymentPolicyToggle: false,
      
      // eBay Policy Data
      shipPolicyArray: [],
      returnPolicyArray: [],
      paymentPolicyArray: [],
      
      // eBay Selected Values
      storeDetails: "",
      shipName: "",
      returnName: "",
      paymentName: "",

      // WooCommerce States
      wcPriceUpdate: false,
      wcQuantityUpdate: false,
      wcMapEnforcement: false,
      wcAutoPopulateMsrp: false,
      wcSendMinPrice: false,
      wcProductStatus: "Publish",
      wcStatusDropdownOpen: false,
      wcLoading: false,
      wcApiKeysLoading: false,
      wcConnectStoreLoading: false,
      wcInitialLoading: true,
      wcHasExistingEnrolment: false,

      // Actions
      setMarketPlace: (marketPlace) => set({ marketPlace: marketPlace }),
      setSubmittedMarketPlace: (marketPlace) => set({ submittedMarketPlace: marketPlace }),
      setMarketList: (value) => set({ marketList: !!value }),
      setMarketPerPage: (value) => set({ marketPerPage: Number(value) || 10 }),
      setHasResponse: (value) => set({ hasResponse: !!value }),
      setIsSubmitting: (value) => set({ isSubmitting: !!value }),
      setSelectedCountry: (country) => set({ selectedCountry: country || "" }),

      // eBay Actions
      setConnectClicked: (value) => set({ connectClicked: !!value }),
      setConnectTime: (value) => set({ connectTime: value }),
      setEbayConnected: (value) => set({ ebayConnected: !!value }),
      setPoliciesLoaded: (value) => set({ policiesLoaded: !!value }),
      setShowAccessCodeButton: (value) => set({ showAccessCodeButton: !!value }),
      setAuthorizationCode: (code) => set({ authorizationCode: code || "" }),
      setRefreshIcon: (value) => set({ refreshIcon: !!value }),
      setIsRotate: (value) => set({ isRotate: !!value }),
      setIsRotating: (value) => set({ isRotating: !!value }),
      setModal2Open: (value) => set({ modal2Open: !!value }),
      setShipPolicyToggle: (value) => set({ shipPolicyToggle: !!value }),
      setReturnPolicyToggle: (value) => set({ returnPolicyToggle: !!value }),
      setPaymentPolicyToggle: (value) => set({ paymentPolicyToggle: !!value }),
      setShipPolicyArray: (arr) => set({ shipPolicyArray: Array.isArray(arr) ? arr : [] }),
      setReturnPolicyArray: (arr) => set({ returnPolicyArray: Array.isArray(arr) ? arr : [] }),
      setPaymentPolicyArray: (arr) => set({ paymentPolicyArray: Array.isArray(arr) ? arr : [] }),
      setStoreDetails: (details) => set({ storeDetails: details || "" }),
      setShipName: (name) => set({ shipName: name || "" }),
      setReturnName: (name) => set({ returnName: name || "" }),
      setPaymentName: (name) => set({ paymentName: name || "" }),

      // WooCommerce Actions
      setWcPriceUpdate: (value) => set({ wcPriceUpdate: !!value }),
      setWcQuantityUpdate: (value) => set({ wcQuantityUpdate: !!value }),
      setWcMapEnforcement: (value) => set({ wcMapEnforcement: !!value }),
      setWcAutoPopulateMsrp: (value) => set({ wcAutoPopulateMsrp: !!value }),
      setWcSendMinPrice: (value) => set({ wcSendMinPrice: !!value }),
      setWcProductStatus: (status) => set({ wcProductStatus: status || "Publish" }),
      setWcStatusDropdownOpen: (value) => set({ wcStatusDropdownOpen: !!value }),
      setWcLoading: (value) => set({ wcLoading: !!value }),
      setWcApiKeysLoading: (value) => set({ wcApiKeysLoading: !!value }),
      setWcConnectStoreLoading: (value) => set({ wcConnectStoreLoading: !!value }),
      setWcInitialLoading: (value) => set({ wcInitialLoading: !!value }),
      setWcHasExistingEnrolment: (value) => set({ wcHasExistingEnrolment: !!value }),

      resetEbayStore: () =>
        set({
          connectClicked: false,
          connectTime: null,
          ebayConnected: false,
          policiesLoaded: false,
          showAccessCodeButton: false,
          authorizationCode: "",
          refreshIcon: false,
          isRotate: false,
          isRotating: false,
          modal2Open: false,
          shipPolicyToggle: false,
          returnPolicyToggle: false,
          paymentPolicyToggle: false,
          shipPolicyArray: [],
          returnPolicyArray: [],
          paymentPolicyArray: [],
          storeDetails: "",
          shipName: "",
          returnName: "",
          paymentName: "",
        }),

      resetWcStore: () =>
        set({
          wcPriceUpdate: false,
          wcQuantityUpdate: false,
          wcMapEnforcement: false,
          wcAutoPopulateMsrp: false,
          wcSendMinPrice: false,
          wcProductStatus: "Publish",
          wcStatusDropdownOpen: false,
          wcLoading: false,
          wcApiKeysLoading: false,
          wcConnectStoreLoading: false,
          wcInitialLoading: true,
          wcHasExistingEnrolment: false,
        }),
    }),
    {
      name: "marketplace-store",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        marketPlace: state.marketPlace,
        submittedMarketPlace: state.submittedMarketPlace,
        marketList: state.marketList,
        marketPerPage: state.marketPerPage,
        selectedCountry: state.selectedCountry,
        connectClicked: state.connectClicked,
        connectTime: state.connectTime,
        ebayConnected: state.ebayConnected,
        policiesLoaded: state.policiesLoaded,
        showAccessCodeButton: state.showAccessCodeButton,
        storeDetails: state.storeDetails,
        shipName: state.shipName,
        returnName: state.returnName,
        paymentName: state.paymentName,
        shipPolicyArray: state.shipPolicyArray,
        returnPolicyArray: state.returnPolicyArray,
        paymentPolicyArray: state.paymentPolicyArray,
        wcPriceUpdate: state.wcPriceUpdate,
        wcQuantityUpdate: state.wcQuantityUpdate,
        wcMapEnforcement: state.wcMapEnforcement,
        wcAutoPopulateMsrp: state.wcAutoPopulateMsrp,
        wcSendMinPrice: state.wcSendMinPrice,
        wcProductStatus: state.wcProductStatus,
        wcHasExistingEnrolment: state.wcHasExistingEnrolment,
      }),
    }
  )
);
