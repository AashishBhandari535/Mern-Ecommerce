import React, { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import { MDBDataTable } from "mdbreact";

import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader";
import Sidebar from "./Sidebar";

import { toast } from "react-toastify";

//Queries And Mutations
import {
  useAllProductsQuery,
  useDeleteProductMutation,
} from "../../slices/productsApiSlice";
import ButtonWrapper from "./ButtonWrapper";

const ProductsList = () => {
  const { data, isLoading } = useAllProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();

  const setProducts = () => {
    const datas = {
      columns: [
        {
          label: "ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Name",
          field: "name",
          sort: "asc",
        },
        {
          label: "Price",
          field: "price",
          sort: "asc",
        },
        {
          label: "Stock",
          field: "stock",
          sort: "asc",
        },
        {
          label: "Actions",
          field: "actions",
        },
      ],
      rows: [],
    };

    data?.products.forEach((product) => {
      datas.rows.push({
        id: product._id,
        name: product.name,
        price: `$${product.price}`,
        stock: product.stock,
        actions: (
          <ButtonWrapper>
            <Link
              to={`/admin/product/${product._id}`}
              className="btn btn-primary py-1 px-2"
            >
              <i className="fa fa-pencil"></i>
            </Link>
            <button
              className="btn btn-danger py-1 px-2 ml-2"
              onClick={() => deleteProductHandler(product._id)}
            >
              <i className="fa fa-trash"></i>
            </button>
          </ButtonWrapper>
        ),
      });
    });

    return datas;
  };

  const deleteProductHandler = async (id) => {
    try {
      await deleteProduct(id).unwrap();
      toast.success("Product Deleted Successfully");
    } catch (err) {
      toast.error(err?.data?.errMessage);
    }
  };

  return (
    <Fragment>
      <MetaData title={"All Products"} />
      <div className="row">
        <div className="col-3 col-md-2 col-lg-2">
          <Sidebar />
        </div>

        <div className="col-9 col-md-10 col-lg-10">
          <Fragment>
            <h1 className="my-5">All Products</h1>

            {isLoading ? (
              <Loader />
            ) : (
              <MDBDataTable
                data={setProducts()}
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

export default ProductsList;
