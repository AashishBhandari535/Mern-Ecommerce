import React, { Fragment } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function VerifiedRoute() {
  const { loading, user } = useSelector((state) => state.auth);

  return (
    <Fragment>
      {loading === false &&
        (user.isVerified === false ? <Navigate to="/me" /> : <Outlet />)}
    </Fragment>
  );
}
