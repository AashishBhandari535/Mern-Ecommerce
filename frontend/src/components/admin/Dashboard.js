import React, { Fragment } from "react";
import { Link } from "react-router-dom";

// Layout
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader";
import Sidebar from "./Sidebar";
import CategoriesBar from "./charts/CategoriesBar";
import ItemStockPie from "./charts/ItemStockPie";
import OrderStatusPie from "./charts/OrderStatusPie";
import YearlySales from "./charts/YearlySales";
import Last7Days from "./charts/Last7Days";

//Queries and Mutations
import { useAllProductsQuery } from "../../slices/productsApiSlice";
import { useGetAllUsersQuery } from "../../slices/userApiSlice";
import { useGetAllOrdersQuery } from "../../slices/orderApiSlice";

const Dashboard = () => {
  const { data: AdminProducts } = useAllProductsQuery();
  const { data: AllUsers } = useGetAllUsersQuery();
  const { data: AllOrders, isLoading } = useGetAllOrdersQuery();

  let outOfStock = 0;
  AdminProducts?.products?.forEach((product) => {
    if (product.stock === 0) {
      outOfStock += 1;
    }
  });

  return (
    <Fragment>
      <div className="row">
        <div className="col-4 col-md-2">
          <Sidebar />
        </div>

        <div className="col-8 col-md-10">
          <h1 className="my-4">Dashboard</h1>

          {isLoading ? (
            <Loader />
          ) : (
            <Fragment>
              <MetaData title={"Admin Dashboard"} />

              <div className="row pr-4 ">
                <div className="col-xl-12 col-sm-12 mb-3">
                  <div className="card text-white bg-primary o-hidden h-100">
                    <div className="card-body">
                      <div className="text-center card-font-size">
                        Total Amount
                        <br /> <b>${AllOrders?.totalAmount?.toFixed(2)}</b>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row pr-4 ">
                <div className="col-xl-3 col-sm-6 mb-3">
                  <div className="card text-white bg-success o-hidden h-100">
                    <div className="card-body">
                      <div className="text-center card-font-size">
                        Products
                        <br /> <b>{AdminProducts?.products?.length}</b>
                      </div>
                    </div>
                    <Link
                      className="card-footer text-white clearfix small z-1"
                      to="/admin/products"
                    >
                      <span className="float-left">View Details</span>
                      <span className="float-right">
                        <i className="fa fa-angle-right"></i>
                      </span>
                    </Link>
                  </div>
                </div>

                <div className="col-xl-3 col-sm-6 mb-3">
                  <div className="card text-white bg-danger o-hidden h-100">
                    <div className="card-body">
                      <div className="text-center card-font-size">
                        Orders
                        <br /> <b>{AllOrders?.orders?.length}</b>
                      </div>
                    </div>
                    <Link
                      className="card-footer text-white clearfix small z-1"
                      to="/admin/orders"
                    >
                      <span className="float-left">View Details</span>
                      <span className="float-right">
                        <i className="fa fa-angle-right"></i>
                      </span>
                    </Link>
                  </div>
                </div>

                <div className="col-xl-3 col-sm-6 mb-3">
                  <div className="card text-white bg-info o-hidden h-100">
                    <div className="card-body">
                      <div className="text-center card-font-size">
                        Users
                        <br /> <b>{AllUsers?.users?.length}</b>
                      </div>
                    </div>
                    <Link
                      className="card-footer text-white clearfix small z-1"
                      to="/admin/users"
                    >
                      <span className="float-left">View Details</span>
                      <span className="float-right">
                        <i className="fa fa-angle-right"></i>
                      </span>
                    </Link>
                  </div>
                </div>

                <div className="col-xl-3 col-sm-6 mb-3">
                  <div className="card text-white bg-warning o-hidden h-100">
                    <div className="card-body">
                      <div className="text-center card-font-size">
                        Out of Stock
                        <br /> <b>{outOfStock}</b>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row pr-4 mb-4">
                <div className="col-12 col-md-4 ">
                  <Last7Days />
                </div>

                <div className="col-12 col-md-4 ">
                  <YearlySales orders={AllOrders?.orders} />
                </div>

                <div className="col-12 col-md-4 ">
                  <CategoriesBar products={AdminProducts?.products} />
                </div>

                <div className="col-12 col-md-4 chart d-flex justify-content-center">
                  <ItemStockPie products={AdminProducts?.products} />
                </div>

                <div className="col-12 col-md-4 chart d-flex justify-content-center">
                  <OrderStatusPie orders={AllOrders?.orders} />
                </div>
              </div>
            </Fragment>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default Dashboard;
