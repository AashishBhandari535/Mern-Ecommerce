import React, { Fragment } from "react";
import { Link } from "react-router-dom";

import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader";

import { useParams } from "react-router-dom";

// Queries and Mutations
import { useGetOrderDetailsQuery } from "../../slices/orderApiSlice";

const OrderDetails = () => {
  const { id } = useParams();

  const { data, isLoading } = useGetOrderDetailsQuery(id);

  const shippingDetails = `${data?.order.shippingInfo.address}, ${data?.order.shippingInfo.city}, ${data?.order.shippingInfo.postalCode}, ${data?.order.shippingInfo.country}`;

  const isPaid = data?.order.paymentInfo.status === "succeeded" ? true : false;

  return (
    <Fragment>
      <MetaData title={"Order Details"} />

      {isLoading ? (
        <Loader />
      ) : (
        <div className="container container-fluid">
          <div className="row d-flex justify-content-between">
            <div className="col-12 col-lg-8 mt-5 order-details">
              <h1 className="my-5">Order # {data?.order._id}</h1>

              <h4 className="mb-4">Shipping Info</h4>
              <p>
                <b>Name:</b> {data?.order.user.name}
              </p>
              <p>
                <b>Phone:</b> {data?.order.shippingInfo.phoneNo}
              </p>
              <p className="mb-4">
                <b>Address:</b>
                {shippingDetails}
              </p>
              <p>
                <b>Amount:</b> ${data?.order.totalPrice}
              </p>

              <hr />

              <h4 className="my-4">Payment</h4>
              <p className={isPaid ? "greenColor" : "redColor"}>
                <b>{isPaid ? "PAID" : "NOT PAID"}</b>
              </p>

              <h4 className="my-4">Order Status:</h4>
              <p
                className={
                  data?.order?.orderStatus &&
                  String(data?.order?.orderStatus).includes("Delivered")
                    ? "greenColor"
                    : "redColor"
                }
              >
                <b>{data?.order?.orderStatus}</b>
              </p>

              <h4 className="my-4">Order Items:</h4>

              <hr />
              <div className="cart-item my-1">
                {data?.order.orderItems.map((item) => (
                  <div key={item.product} className="row my-5">
                    <div className="col-4 col-lg-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        height="45"
                        width="65"
                      />
                    </div>

                    <div className="col-5 col-lg-5">
                      <Link to={`/products/${item.product}`}>{item.name}</Link>
                    </div>

                    <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                      <p>${item.price}</p>
                    </div>

                    <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                      <p>{item.quantity} Piece(s)</p>
                    </div>
                  </div>
                ))}
              </div>
              <hr />
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default OrderDetails;
