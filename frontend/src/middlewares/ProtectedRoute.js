import React, { Fragment } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  return (
    <Fragment>
      {loading === false &&
        (isAuthenticated === false ? <Navigate to="/login" /> : <Outlet />)}
    </Fragment>
  );
};

export default ProtectedRoute;
