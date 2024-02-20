import React, { Fragment, useState } from "react";
import { Link, useParams } from "react-router-dom";

import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader";
import Sidebar from "./Sidebar";

//Queries And Mutations
import { useGetOrderDetailsQuery } from "../../slices/orderApiSlice";
import { useUpdateOrderMutation } from "../../slices/orderApiSlice";

// NotificationMessage
import { SuccessHandler, ErrorHandler } from "../../utils/NotificationHandler";

const ProcessOrder = () => {
  const [status, setStatus] = useState("");

  const { id } = useParams();

  const { data, isLoading } = useGetOrderDetailsQuery(id);
  const [updateOrder] = useUpdateOrderMutation();

  const updateOrderHandler = async (id) => {
    const formData = new FormData();
    formData.set("status", status);

    const data = {
      id,
      formData,
    };

    try {
      await updateOrder(data);
      SuccessHandler("Order updated successfully");
    } catch (err) {
      ErrorHandler(err?.data?.errMessage);
    }
  };

  const shippingDetails = `${data?.order?.shippingInfo.address}, ${data?.order?.shippingInfo.city}, ${data?.order?.shippingInfo.postalCode}, ${data?.order?.shippingInfo.country}`;
  const isPaid = data?.order?.paymentInfo.status === "succeeded" ? true : false;

  return (
    <Fragment>
      <MetaData title={`Process Order # ${data?.order._id}`} />
      <div className="row">
        <div className="col-3 col-md-2 col-lg-2">
          <Sidebar />
        </div>

        <div className="col-9 col-md-10 col-lg-10">
          <Fragment>
            {isLoading ? (
              <Loader />
            ) : (
              <div className="row d-flex justify-content-around">
                <div className="col-12 col-lg-7 order-details">
                  <h2 className="my-5">Order # {data?.order?._id}</h2>

                  <h4 className="mb-4">Shipping Info</h4>
                  <p>
                    <b>Name:</b> {data?.order?.user.name}
                  </p>
                  <p>
                    <b>Phone:</b> {data?.order?.shippingInfo.phoneNo}
                  </p>
                  <p className="mb-4">
                    <b>Address:</b>
                    {shippingDetails}
                  </p>
                  <p>
                    <b>Amount:</b> ${data?.order?.totalPrice}
                  </p>

                  <hr />

                  <h4 className="my-4">Payment</h4>
                  <p className={isPaid ? "greenColor" : "redColor"}>
                    <b>{isPaid ? "PAID" : "NOT PAID"}</b>
                  </p>

                  <h4 className="my-4">Stripe ID</h4>
                  <p>
                    <b>{data?.order?.paymentInfo.id}</b>
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
                    {data?.order?.orderItems &&
                      data?.order?.orderItems.map((item) => (
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
                            <Link to={`/products/${item.product}`}>
                              {item.name}
                            </Link>
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

                <div className="col-12 col-lg-3 mt-5">
                  <h4 className="my-4">Status</h4>

                  <div className="form-group">
                    <select
                      className="form-control"
                      name="status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>

                  <button
                    className="btn btn-primary btn-block"
                    onClick={() => updateOrderHandler(data?.order._id)}
                  >
                    Update Status
                  </button>
                </div>
              </div>
            )}
          </Fragment>
        </div>
      </div>
    </Fragment>
  );
};

export default ProcessOrder;
