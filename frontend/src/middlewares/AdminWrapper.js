import React, { Fragment } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminWrapper =({ isAdmin }) => {
  const { user } = useSelector((state) => state.auth);
  return (
    <Fragment>
      {isAdmin === true &&
        (user.role === "admin" ? <Outlet /> : <Navigate to="/" />)}
    </Fragment>
  );
};

export default AdminWrapper


