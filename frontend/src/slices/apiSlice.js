import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL, REFRESHTOKEN_URL } from "../constants";
import { setCredentials, logout } from "./authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, api) => {
    const token = localStorage.getItem("userInfo");
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
  credentials: "include",
});

async function baseQueryWithReAuth(args, api, extra) {
  let result = await baseQuery(args, api, extra);
  if (result?.error && result?.error?.status === 403) {
    const response = await baseQuery(`${REFRESHTOKEN_URL}`, api, extra);
    if (response?.data) {
      // Store the new token
      api.dispatch(setCredentials(response?.data?.token));
      // retry original query with new access token
      result = await baseQuery(args, api, extra);
    } else {
      api.dispatch(logout());
    }
  }
  return result;
}

export const apiSlice = createApi({
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({}),
});
