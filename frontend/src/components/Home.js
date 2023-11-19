import React, { Fragment, useState, useEffect } from "react";
import Pagination from "react-js-pagination";

import { useGetProductsQuery } from "../slices/productsApiSlice";

import MetaData from "./layout/MetaData";
import Product from "./product/Product";
import HomeLoader from "./Loader/HomeLoader";
import Search from "./layout/Search";

import { useLocation, useParams } from "react-router-dom";
import DesktopFilterBar from "./HomeFilter/DesktopFilterBar";
import MobileFilterBar from "./HomeFilter/MobileFilterBar";
import { addSearchItem } from "../slices/searchKeywordSlice";
import { useDispatch } from "react-redux";

const Home = () => {
  const { keyword } = useParams();
  const { pathname } = useLocation();

  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([1, 1000]); //sets initial value of slider
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState(0);

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
    if (pathname === "/") {
      setCategory("");
      setPrice([1, 1000]);
      setRating(0);
    }
    if (pathname !== "" && pathname !== "/") {
      dispatch(addSearchItem(keyword));
    }
  }, [pathname]);
  return (
    <Fragment>
      <div className="container container-fluid">
        <MetaData title={"Buy Best Products Online"} />

        <div className="d-lg-none  my-5">
          <Search />
        </div>

        {keyword ? (
          ""
        ) : (
          <h1 id="products_heading" className="text-lg-left text-center ">
            Latest Products
          </h1>
        )}

        <section id="products" className="container mt-5">
          {keyword ? (
            <>
              <DesktopFilterBar
                price={price}
                setPrice={setPrice}
                currentCategory={category}
                currentRating={rating}
                setCurrentCategory={setCategory}
                setCurrentRating={setRating}
                isFetching={isFetching}
                data={data}
              />
              <MobileFilterBar
                price={price}
                setPrice={setPrice}
                currentCategory={category}
                currentRating={rating}
                setCurrentCategory={setCategory}
                setCurrentRating={setRating}
                isFetching={isFetching}
                data={data}
              />
            </>
          ) : isFetching ? (
            <div className="row">
              <HomeLoader col={3} />
            </div>
          ) : (
            <div className="row">
              {data?.products.map((product) => (
                <Product key={product._id} product={product} col={3} />
              ))}
            </div>
          )}
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
