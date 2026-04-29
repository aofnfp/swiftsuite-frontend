// hooks/useVendorProducts.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";
import axiosInstance from "../utils/axiosInstance";

export const useGetVendorProducts = ({
  userId,
  productChange,
  page,
  selectedProductPerPage,
  token,
  catalogue,
  formFilters = {},
  paginationContext,
  searchQuery = "",
  filterApplied,
  selectedIdentifier,
}) => {
  const isFiltering = paginationContext === "filter";
  const isSearching = paginationContext === "search";

  const selectedProduct = catalogue.find((item) => item.name === productChange);

  const cleanFilters = Object.fromEntries(
    Object.entries(formFilters).filter(([_, v]) => v !== "")
  );

  const queryParams = new URLSearchParams({
    ...cleanFilters,
    ...(isSearching && searchQuery ? { search: searchQuery } : {}),
  }).toString();

  const endpoint = selectedProduct
    ? (() => {
        const endpointUrl = new URL(selectedProduct.endpoint);
        endpointUrl.searchParams.set("page", page.toString());
        endpointUrl.searchParams.set("limit", selectedProductPerPage.toString());

        if (isSearching && searchQuery) {
          endpointUrl.searchParams.set("search", searchQuery);
        } else {
          endpointUrl.searchParams.delete("search");
        }

        Object.entries(cleanFilters).forEach(([key, value]) => {
          endpointUrl.searchParams.set(key, value);
        });

        return endpointUrl.toString();
      })()
    : "";
  return useQuery({
    queryKey: [
      "vendorProducts",
      userId,
      productChange,
      page,
      selectedProductPerPage,
      isFiltering ? cleanFilters : {},
      isSearching ? searchQuery : "",
      selectedIdentifier || "",
    ],
    enabled: !!userId && !!token && !!productChange && !!paginationContext && !!selectedProduct,
    queryFn: async () => {
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const rawResults = response.data.results || [];
      const transformed = rawResults.map((item) => ({
        ...item,
        product: {
          ...item.product,
          price: item.price,
          quantity: item.quantity,
        },
      }));

      return {
        products: transformed,
        identifiers: response.data.all_identifiers || [],
        count: response.data.count || 0,
      };
    },
    staleTime: 10 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    keepPreviousData: true,
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to fetch products");
    },
  });
};

export const useGetProducts = ({
  userId,
  page,
  selectProductPerPage,
  token,
  formFilters = {},
  searchQuery = "",
  filterProduct = [],
  productChange,
  isFilterApplied = false,
}) => {
  const safePage = Number.isFinite(Number(page)) && Number(page) > 0 ? Math.floor(Number(page)) : 1;
  const safeLimit = Number.isFinite(Number(selectProductPerPage)) && Number(selectProductPerPage) > 0 ? Math.floor(Number(selectProductPerPage)) : 20;
  const selectedProduct = filterProduct.find((item) => item.name === productChange);
  const cleanFilters = Object.fromEntries(
    Object.entries(formFilters).filter(([_, v]) => v !== "")
  );
  const queryParams = new URLSearchParams({
    page: safePage.toString(),
    limit: safeLimit.toString(),
    ...(formFilters && isFilterApplied ? cleanFilters : {}),
    ...(searchQuery ? { search: searchQuery } : {}),
    ...(selectedProduct ? { vendor: selectedProduct.name } : {}),
  }).toString();

  const url = `/api/v2/view-all-products/?${queryParams}`;

  return useQuery({
    queryKey: [
      "getVendorProducts",
      userId,
      page,
      selectProductPerPage,
      searchQuery,
      isFilterApplied ? cleanFilters : {},
      productChange,
    ],
    queryFn: async () => {
      const response = await axiosInstance.get(url);
      return response.data;
    },
    enabled: !!filterProduct.length,
    staleTime: 10 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    keepPreviousData: true,
     retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
  });
};

export const useDeleteProduct = () => {
  return useMutation({
    mutationFn: async ({ userId, token, productId }) => {
      return await axiosInstance.delete(`/api/v2/delete-product/${productId}/`);
    },
  });
};

export const useAddSingleProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      productId,
      productChange,
      selectedProductCatalogue,
    }) => {
      return await axiosInstance.put(
        `/api/v2/add-to-product/${userId}/${productId}/${productChange}/${selectedProductCatalogue}/`
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["vendorProducts", variables.userId],
        exact: false,
      });
    },
  });
};
