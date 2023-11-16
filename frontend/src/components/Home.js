import React, { Fragment, useState, useEffect } from "react";
import Pagination from "react-js-pagination";

import { useGetProductsQuery } from "../slices/productsApiSlice";

import MetaData from "./layout/MetaData";
import Product from "./product/Product";
import HomeLoader from "./Loader/HomeLoader";
import Search from "./layout/Search";

import { useLocation, useParams } from "react-router-dom";
import DesktopFilterBar from "./DesktopFilterBar";

const Home = () => {
  const { keyword } = useParams();
  const { pathname } = useLocation();

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
  }, [pathname]);
  return (
    <Fragment>
      <div className="container container-fluid">
        <MetaData title={"Buy Best Products Online"} />

        <div className="d-lg-none  my-5">
          <Search />
        </div>

        <h1 id="products_heading" className="text-lg-left text-center">
          Latest Products
        </h1>

        <section id="products" className="container mt-5">
          <div className="row">
            {keyword ? (
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
