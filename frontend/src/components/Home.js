import React, { Fragment, useState, useEffect } from "react";
import Pagination from "react-js-pagination";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

import { useGetProductsQuery } from "../slices/productsApiSlice";

import MetaData from "./layout/MetaData";
import Product from "./product/Product";
import HomeLoader from "./Loader/HomeLoader";

import { useLocation, useParams } from "react-router-dom";

const { createSliderWithTooltip } = Slider;
const Range = createSliderWithTooltip(Slider.Range);

const Home = () => {
  const { keyword } = useParams();
  const { pathname } = useLocation();

  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([1, 1000]); //sets initial value of slider
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState(0);

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

  const { data, isFetching } = useGetProductsQuery({
    keyword,
    currentPage,
    price,
    category,
    rating,
  });

  function setCurrentPageNo(pageNumber) {
    setCurrentPage(pageNumber);
  }

  let count = data?.productsCount;
  if (keyword) {
    count = data?.filteredProductsCount;
  }
  useEffect(() => {
    if (pathname === "/") setCategory("");
  }, [pathname]);
  return (
    <Fragment>
      <div className="container container-fluid">
        <MetaData title={"Buy Best Products Online"} />

        <h1 id="products_heading">Latest Products</h1>

        <section id="products" className="container mt-5">
          <div className="row">
            {keyword ? (
              <Fragment>
                <div className="col-6 col-md-3 mt-5 mb-5">
                  <div className="px-5">
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
                            }}
                            key={category}
                            onClick={() => setCategory(category)}
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
                            }}
                            key={star}
                            onClick={() => setRating(star)}
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
              </Fragment>
            ) : isFetching ? (
              <HomeLoader col={3} />
            ) : (
              data?.products.map((product) => (
                <Product key={product._id} product={product} col={3} />
              ))
            )}
          </div>
        </section>

        {data?.resPerPage <= count && (
          <div className="d-flex justify-content-center mt-5">
            <Pagination
              activePage={currentPage}
              itemsCountPerPage={data?.resPerPage} //8
              totalItemsCount={data?.productsCount} //9
              onChange={setCurrentPageNo}
              nextPageText={"Next"}
              prevPageText={"Prev"}
              firstPageText={"First"}
              lastPageText={"Last"}
              itemClass="page-item"
              linkClass="page-link"
            />
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default Home;
