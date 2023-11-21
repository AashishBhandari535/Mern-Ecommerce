import {
  PRODUCTS_URL,
  PRODUCT_URL,
  ADMIN_URL,
  REVIEW_URL,
  REVIEWS_URL,
} from "../constants";
import { apiSlice } from "./apiSlice";

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({
        keyword = "",
        currentPage = 1,
        price = [0, 1000],
        category,
        rating = 0,
      }) => {
        let link = `${PRODUCTS_URL}?keyword=${keyword}&page=${currentPage}&price[lte]=${price[1]}&price[gte]=${price[0]}&ratings[gte]=${rating}`;
        if (category) {
          link = `${PRODUCTS_URL}?keyword=${keyword}&page=${currentPage}&price[lte]=${price[1]}&price[gte]=${price[0]}&category=${category}&ratings[gte]=${rating}`;
        }
        return {
          url: link,
          method: "GET",
        };
      },
      providesTags: ["Products"],
    }),
    getProductDetails: builder.query({
      query: (id) => {
        return {
          url: `${PRODUCT_URL}/${id}`,
          method: "GET",
        };
      },
      keepUnusedDataFor: 5,
      providesTags: ["Product"],
    }),
    getProductReviews: builder.query({
      query: (id) => {
        return {
          url: `${REVIEWS_URL}?id=${id}`,
          method: "GET",
        };
      },
    }),
    newReview: builder.mutation({
      query: (reviewData) => {
        return {
          url: `${REVIEW_URL}`,
          method: "PUT",
          body: reviewData,
        };
      },
      invalidatesTags: ["Product"],
    }),
    deleteReview: builder.mutation({
      query: (reviewData) => {
        const { id, productId } = reviewData;
        return {
          url: `${REVIEWS_URL}?id=${id}&productId=${productId}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Product"],
    }),
    //Admin
    allProducts: builder.query({
      query: () => {
        return {
          url: `${ADMIN_URL}/products`,
          method: "GET",
        };
      },
      providesTags: ["AdminProducts"],
    }),
    newProduct: builder.mutation({
      query: (productData) => {
        return {
          url: `${ADMIN_URL}/product/new`,
          method: "POST",
          body: productData,
        };
      },
      invalidatesTags: ["Products", "AdminProducts"],
    }),
    updateProduct: builder.mutation({
      query: (data) => {
        const { productId, formData: productData } = data;
        return {
          url: `${ADMIN_URL}/product/${productId}`,
          method: "PUT",
          body: productData,
        };
      },
      invalidatesTags: ["Product", "AdminProduct"],
    }),
    deleteProduct: builder.mutation({
      query: (id) => {
        return {
          url: `${ADMIN_URL}/product/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Products", "AdminProducts"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useLazyGetProductReviewsQuery,
  useNewReviewMutation,
  useDeleteReviewMutation,
  useAllProductsQuery,
  useNewProductMutation,
  useDeleteProductMutation,
  useUpdateProductMutation,
} = productsApiSlice;
