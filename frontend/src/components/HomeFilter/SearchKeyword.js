import React from "react";

import { ImCross } from "react-icons/im";
import { useDispatch, useSelector } from "react-redux";
import { removeSearchItem } from "../../slices/searchKeywordSlice";

export default function SearchKeyword() {
  const { searchItems } = useSelector((state) => state.search);

  const dispatch = useDispatch();
  return (
    <div className="mb-3">
      <h4 className=" text-center">Keywords</h4>
      <ul
        className="d-flex flex-wrap list-unstyled px-lg-5"
        style={{ gap: "6px", flexDirection: "row" }}
      >
        {searchItems?.map((searchItem) => (
          <li className="search-keyword">
            {searchItem}
            <span onClick={() => dispatch(removeSearchItem(searchItem))}>
              <ImCross style={{ width: "8px", height: "8px" }} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
