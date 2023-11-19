import React from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

import Product from "../product/Product";
import HomeLoader from "../Loader/HomeLoader";

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

export default function MobileFilterBar({
  price,
  setPrice,
  currentCategory,
  setCurrentCategory,
  currentRating,
  setCurrentRating,
  isFetching,
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
    <div className="d-md-none">
      <div className=" row">
        <div className="col-6 col-md-3 mt-5 mb-5">
          <div className="px-lg-5">
            <Range
              marks={{
                1: `$1`,
                1000: `$1000`,
              }}
              min={1} //minimum value of the slider
              max={1000} //maximum value of the slider
              // defaultValue={[2, 100]}//We dont need it
              tipFormatter={(value) => `$${value}`} //function format tooltip's overlay
              tipProps={{
                placement: "top",
                visible: true,
              }}
              value={price} //Sets current value of slider
              onChange={(price) => setPrice(price)}
            />

            <hr className="my-5" />

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
            </div>

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
              <HomeLoader />
            ) : (
              data?.products.map((product) => (
                <Product key={product._id} product={product} col={4} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
