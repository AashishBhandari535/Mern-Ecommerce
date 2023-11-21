import React from "react";

import HomeLoader from "../Loader/HomeLoader";
import Product from "../product/Product";
import SearchKeyword from "./FilterComponents/SearchKeyword";
import PriceFilter from "./FilterComponents/PriceFilter";
import CategoryFilter from "./FilterComponents/CategoryFilter";

export default function DesktopFilterBar({
  setPrice,
  currentCategory,
  setCurrentCategory,
  currentRating,
  setCurrentRating,
  isFetching,
  changePrice,
  setChangePrice,
  data,
}) {
  const categories = [
    "Electronics",
    "Cameras",
    "Laptops",
    "Accessories",
    "Headphones",
    "Food",
    "Books",
    "Clothes/Shoes",
    "Beauty/Health",
    "Sports",
    "Outdoor",
    "Home",
  ];
  return (
    <>
      <div className="d-md-block d-none">
        <SearchKeyword />
        <CategoryFilter
          currentCategory={currentCategory}
          setCurrentCategory={setCurrentCategory}
        />

        <div className="row">
          <div className="col-6 col-md-3 mt-5 mb-5">
            <div className="px-lg-4">
              <PriceFilter
                changePrice={changePrice}
                setPrice={setPrice}
                setChangePrice={setChangePrice}
              />

              {/* <hr className="my-5" />

              <div className="mt-5">
                <h4 className="mb-3">Categories</h4>

                <ul className="pl-0">
                  {categories?.map((category) => (
                    <li
                      style={{
                        cursor: "pointer",
                        listStyleType: "none",
                        border:
                          currentCategory === category
                            ? "solid 1px #febd69"
                            : " ",
                      }}
                      className="category-option"
                      key={category}
                      onClick={(e) => {
                        setCurrentCategory(category);
                      }}
                    >
                      {category}
                    </li>
                  ))}
                </ul>
              </div> */}

              <hr className="my-3" />

              <div className="mt-5">
                <h4 className="mb-3">Ratings</h4>

                <ul className="pl-0">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <li
                      style={{
                        cursor: "pointer",
                        listStyleType: "none",
                        border:
                          star === currentRating ? "solid 1px #febd69" : " ",
                      }}
                      key={star}
                      onClick={() => {
                        setCurrentRating(star);
                      }}
                    >
                      <div className="rating-outer">
                        <div
                          className="rating-inner"
                          style={{
                            width: `${star * 20}%`,
                          }}
                        ></div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="col-6 col-md-9">
            <div className="row">
              {isFetching ? (
                <HomeLoader col={4} />
              ) : (
                data?.products.map((product) => (
                  <Product key={product._id} product={product} col={4} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
