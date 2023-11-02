import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: true,
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, { payload }) => {
      localStorage.setItem("userInfo", payload);
    },
    setUser: (state, { payload }) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = payload;
    },
    logout: (state, { payload }) => {
      localStorage.removeItem("userInfo");
      state.isAuthenticated = false;
      state.user = null;
      state.loading = false;
    },
  },
});

export const { setCredentials, logout, setUser } = authSlice.actions;

export default authSlice.reducer;
