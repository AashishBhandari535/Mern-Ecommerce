import {
  ORDER_URL,
  ORDERS_URL,
  ADMIN_URL,
  STRIPE_URL,
  PAYMENT_PROCESS_URL,
} from "../constants";
import { emptyCart, emptyShippingInfo } from "./cartSlice";
import { apiSlice } from "./apiSlice";

export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => {
        return {
          url: `${ORDER_URL}/new`,
          method: "POST",
          body: order,
        };
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(emptyCart());
          dispatch(emptyShippingInfo());
        } catch (error) {
          console.log(error);
        }
      },
    }),
    myOrders: builder.query({
      query: () => {
        return {
          url: `${ORDERS_URL}/me`,
          method: "GET",
        };
      },
    }),
    getOrderDetails: builder.query({
      query: (id) => {
        console.log(id);
        return {
          url: `${ORDER_URL}/${id}`,
          method: "GET",
        };
      },
      providesTags: ["Order"],
    }),
    getStripeKey: builder.query({
      query: () => {
        return {
          url: `${STRIPE_URL}`,
          method: "GET",
        };
      },
    }),
    paymentProcess: builder.mutation({
      query: (paymentData) => {
        return {
          url: `${PAYMENT_PROCESS_URL}`,
          method: "POST",
          body: paymentData,
        };
      },
    }),
    //Admin
    getAllOrders: builder.query({
      query: () => {
        return {
          url: `${ADMIN_URL}/orders`,
          method: "GET",
        };
      },
      providesTags: ["Orders"],
    }),
    updateOrder: builder.mutation({
      query: (data) => {
        const { id, formData: orderData } = data;
        return {
          url: `${ADMIN_URL}/order/${id}`,
          method: "PUT",
          body: orderData,
        };
      },
      invalidatesTags: ["Orders", "Order"],
    }),
    deleteOrder: builder.mutation({
      query: (id) => {
        return {
          url: `${ADMIN_URL}/order/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Orders"],
    }),
    last7DaySales: builder.query({
      query: () => {
        return {
          url: `/api/v1/week-sales`,
          method: "GET",
        };
      },
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useMyOrdersQuery,
  useGetOrderDetailsQuery,
  useGetStripeKeyQuery,
  usePaymentProcessMutation,
  useGetAllOrdersQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useLast7DaySalesQuery,
} = ordersApiSlice;
