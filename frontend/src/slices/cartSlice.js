import { createSlice, current } from "@reduxjs/toolkit";

const initialState = localStorage.getItem("cartItems")
  ? {
      cartItems: JSON.parse(localStorage.getItem("cartItems")),
      shippingInfo: JSON.parse(localStorage.getItem("shippingInfo")),
    }
  : { cartItems: [], shippingInfo: {} };

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
  },
});

export const { addItemToCart, removeItemFromCart, saveShippingInfo } =
  cartSlice.actions;

export default cartSlice.reducer;
