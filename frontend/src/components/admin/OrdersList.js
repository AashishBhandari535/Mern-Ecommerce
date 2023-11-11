import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { MDBDataTable } from "mdbreact";

import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader";
import Sidebar from "./Sidebar";

//Queries and mutations
import {
  useGetAllOrdersQuery,
  useDeleteOrderMutation,
} from "../../slices/orderApiSlice";

import { toast } from "react-toastify";
import ButtonWrapper from "./ButtonWrapper";

const OrdersList = () => {
  const { data, isLoading } = useGetAllOrdersQuery();
  const [deleteOrder] = useDeleteOrderMutation();

  const deleteOrderHandler = async (id) => {
    try {
      await deleteOrder(id).unwrap();
      toast.success("Order deleted successfully");
    } catch (err) {
      toast.error(err?.data?.errMessage);
    }
  };

  const setOrders = () => {
    const datas = {
      columns: [
        {
          label: "Order ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "No of Items",
          field: "numofItems",
          sort: "asc",
        },
        {
          label: "Amount",
          field: "amount",
          sort: "asc",
        },
        {
          label: "Status",
          field: "status",
          sort: "asc",
        },
        {
          label: "Actions",
          field: "actions",
        },
      ],
      rows: [],
    };

    data?.orders.forEach((order) => {
      datas.rows.push({
        id: order._id,
        numofItems: order.orderItems.length,
        amount: `$${order.totalPrice}`,
        status:
          order.orderStatus &&
          String(order.orderStatus).includes("Delivered") ? (
            <p style={{ color: "green" }}>{order.orderStatus}</p>
          ) : (
            <p style={{ color: "red" }}>{order.orderStatus}</p>
          ),
        actions: (
          <ButtonWrapper>
            <Link
              to={`/admin/order/${order._id}`}
              className="btn btn-primary py-1 px-2"
            >
              <i className="fa fa-eye"></i>
            </Link>
            <button
              className="btn btn-danger py-1 px-2 ml-2"
              onClick={() => deleteOrderHandler(order._id)}
            >
              <i className="fa fa-trash"></i>
            </button>
          </ButtonWrapper>
        ),
      });
    });

    return datas;
  };

  return (
    <Fragment>
      <MetaData title={"All Orders"} />
      <div className="row">
        <div className="col-3 col-md-2 col-lg-2">
          <Sidebar />
        </div>

        <div className="col-9 col-md-10 col-lg-10">
          <Fragment>
            <h1 className="my-5">All Orders</h1>

            {isLoading ? (
              <Loader />
            ) : (
              <MDBDataTable
                data={setOrders()}
                className="px-3"
                bordered
                striped
                hover
              />
            )}
          </Fragment>
        </div>
      </div>
    </Fragment>
  );
};

export default OrdersList;
