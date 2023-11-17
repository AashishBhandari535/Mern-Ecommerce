import { ADMIN_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const salesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //Admin
    last7DaySales: builder.query({
      query: () => {
        return {
          url: `${ADMIN_URL}/sales/week-sales`,
          method: "GET",
        };
      },
    }),
  }),
});

export const { useLast7DaySalesQuery } = salesApiSlice;
