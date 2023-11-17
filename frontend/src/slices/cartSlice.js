import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
  cartItems: JSON.parse(localStorage.getItem("cartItems"))
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [],
  shippingInfo: JSON.parse(localStorage.getItem("shippingInfo"))
    ? JSON.parse(localStorage.getItem("shippingInfo"))
    : {},
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemToCart: (state, { payload }) => {
      const item = payload;

      const isItemExist = state.cartItems.find((i) => {
        return i.product === item.product;
      });

      if (isItemExist)
        state.cartItems = state.cartItems.map((i) =>
          i.product === isItemExist.product ? item : i
        );
      else state.cartItems.push(item);
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    removeItemFromCart: (state, { payload }) => {
      state.cartItems = state.cartItems.filter((i) => i.product !== payload);
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    saveShippingInfo: (state, { payload }) => {
      state.shippingInfo = payload;
      localStorage.setItem("shippingInfo", JSON.stringify(payload));
    },
    emptyCart: (state, { payload }) => {
      state.cartItems = [];
      localStorage.removeItem("cartItems");
    },
    emptyShippingInfo: (state, { payload }) => {
      state.shippingInfo = {};
      localStorage.removeItem("shippingInfo");
    },
  },
});

export const {
  addItemToCart,
  removeItemFromCart,
  saveShippingInfo,
  emptyCart,
  emptyShippingInfo,
} = cartSlice.actions;

export default cartSlice.reducer;
