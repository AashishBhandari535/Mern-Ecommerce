import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchItems: JSON.parse(localStorage.getItem("searchItems"))
    ? JSON.parse(localStorage.getItem("searchItems"))
    : [],
};

const searchHistory = createSlice({
  name: "searchKeywords",
  initialState,
  reducers: {
    addSearchItem: (state, { payload }) => {
      const searchItem = payload;

      const isItemExist = state.searchItems.find(
        (item) => searchItem.toLowerCase() === item.toLowerCase()
      );

      if (isItemExist)
        state.searchItems = state.searchItems.map((item) =>
          item.toLowerCase() === isItemExist.toLowerCase() ? searchItem : item
        );
      else state.searchItems.push(searchItem);
      localStorage.setItem("searchItems", JSON.stringify(state.searchItems));
    },
    removeSearchItem: (state, { payload }) => {
      state.searchItems = state.searchItems.filter(
        (item) => item.toLowerCase() !== payload.toLowerCase()
      );
      localStorage.setItem("searchItems", JSON.stringify(state.searchItems));
    },
  },
});

export const { addSearchItem, removeSearchItem } = searchHistory.actions;

export default searchHistory.reducer;
