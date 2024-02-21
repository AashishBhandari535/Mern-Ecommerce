import React, { Fragment, useState } from "react";
import { MDBDataTable } from "mdbreact";

import MetaData from "../layout/MetaData";
import Sidebar from "./Sidebar";

// Queries and Mutations
import {
  useDeleteReviewMutation,
  useLazyGetProductReviewsQuery,
} from "../../slices/productsApiSlice";

// services
import { deleteProductReviewService } from "../../services/productService";
// notificationMessage
import { errorHandler } from "../../utils/notificationHandler";

const ProductReviews = () => {
  const [productId, setProductId] = useState("");

  const [trigger, { data }] = useLazyGetProductReviewsQuery();
  const [deleteReview, { isLoading }] = useDeleteReviewMutation();

  const deleteReviewHandler = async (id) => {
    const data = {
      id,
      productId,
    };

    deleteProductReviewService(data, deleteReview);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await trigger(productId).unwrap();
    } catch (err) {
      errorHandler(err?.data?.errMessage);
    }
  };

  const setReviews = () => {
    const datas = {
      columns: [
        {
          label: "Review ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Rating",
          field: "rating",
          sort: "asc",
        },
        {
          label: "Comment",
          field: "comment",
          sort: "asc",
        },
        {
          label: "User",
          field: "user",
          sort: "asc",
        },
        {
          label: "Actions",
          field: "actions",
        },
      ],
      rows: [],
    };

    data?.reviews.forEach((review) => {
      datas.rows.push({
        id: review._id,
        rating: review.rating,
        comment: review.comment,
        user: review.name,

        actions: (
          <button
            className="btn btn-danger py-1 px-2 ml-2"
            onClick={() => deleteReviewHandler(review._id)}
            disabled={isLoading ? true : false}
          >
            <i className="fa fa-trash"></i>
          </button>
        ),
      });
    });

    return datas;
  };

  return (
    <Fragment>
      <MetaData title={"Product Reviews"} />
      <div className="row">
        <div className="col-3 col-md-2 col-lg-2">
          <Sidebar />
        </div>

        <div className="col-9 col-md-10 col-lg-10">
          <Fragment>
            <div className="row justify-content-center mt-5">
              <div className="col-5">
                <form onSubmit={submitHandler}>
                  <div className="form-group">
                    <label htmlFor="productId_field">Enter Product ID</label>
                    <input
                      type="text"
                      id="productId_field"
                      className="form-control"
                      value={productId}
                      onChange={(e) => setProductId(e.target.value)}
                    />
                  </div>

                  <button
                    id="search_button"
                    type="submit"
                    className="btn btn-primary btn-block py-2"
                  >
                    SEARCH
                  </button>
                </form>
              </div>
            </div>

            {data?.reviews.length > 0 ? (
              <MDBDataTable
                data={setReviews()}
                className="px-3"
                bordered
                striped
                hover
              />
            ) : (
              <p className="mt-5 text-center">No Reviews.</p>
            )}
          </Fragment>
        </div>
      </div>
    </Fragment>
  );
};

export default ProductReviews;
