import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { useNavigate } from "react-router-dom";
import { addSearchItem } from "../../slices/searchKeywordSlice";

const Search = () => {
  const [keyword, setKeyword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchHandler = (e) => {
    e.preventDefault();

    if (keyword.trim()) {
      dispatch(addSearchItem(keyword));
      navigate(`/search/${keyword}`);
    } else {
      navigate("/");
    }
  };
  return (
    <form onSubmit={searchHandler}>
      <div className="input-group mx-auto">
        <input
          type="text"
          id="search_field"
          className="form-control"
          placeholder="Enter Product Name ..."
          onChange={(e) => {
            setKeyword(e.target.value);
          }}
        />
        <div className="input-group-append">
          <button id="search_btn" className="btn">
            <i className="fa fa-search" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </form>
  );
};

export default Search;
