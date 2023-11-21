import React from "react";

import { ImCross } from "react-icons/im";
import { useDispatch, useSelector } from "react-redux";
import { removeSearchItem } from "../../../slices/searchKeywordSlice";
import { useNavigate } from "react-router-dom";

export default function SearchKeyword() {
  const { searchItems } = useSelector((state) => state.search);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <div className="mb-3">
      <h4 className=" text-center">Keywords</h4>
      <ul
        className="d-flex flex-wrap list-unstyled px-lg-4"
        style={{ gap: "6px", flexDirection: "row" }}
      >
        {searchItems?.map((searchItem) => (
          <li
            className="search-keyword"
            onClick={() => navigate(`/search/${searchItem}`)}
          >
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
