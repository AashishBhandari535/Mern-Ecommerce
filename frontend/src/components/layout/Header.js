import React, { Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";

import Search from "./Search";

//queries and mutations
import { useLogOutMutation } from "../../slices/userApiSlice";

// NotificationMessage
import { SuccessHandler, ErrorHandler } from "../../utils/NotificationHandler";

import "./../../App.css";

const Header = () => {
  const navigate = useNavigate();

  const { cartItems } = useSelector((state) => state.cart);
  const { user, loading } = useSelector((state) => state.auth);

  const [userLogOut] = useLogOutMutation();

  const logoutHandler = async () => {
    try {
      await userLogOut().unwrap();
      SuccessHandler("Successfully LoggedOut");
      navigate("/");
    } catch (err) {
      ErrorHandler(err?.data?.errMessage);
    }
  };

  return (
    <Fragment>
      <nav className="navbar row">
        <div className=" col-6 col-lg-3">
          <div className="navbar-brand">
            <Link to="/">
              <img src="/images/shopit_logo.png" />
            </Link>
          </div>
        </div>

        <div className="col-12 col-lg-6 mt-2 mt-md-0 d-none d-lg-block">
          <Search />
        </div>

        <div className=" col-lg-3 col-6   text-right d-flex align-items-center d-md-block ">
          <Link to="/cart" style={{ textDecoration: "none" }}>
            <span id="cart" className="ml-3">
              Cart
            </span>
            <span className="ml-1" id="cart_count">
              {cartItems?.length}
            </span>
          </Link>

          {user ? (
            <div className="ml-2 ml-md-4 dropdown d-inline">
              <Link
                to="#!"
                className="btn dropdown-toggle text-white mr-4"
                type="button"
                id="dropDownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <figure className="avatar avatar-nav">
                  <img
                    src={user.avatar && user.avatar.url}
                    alt={user && user.name}
                    className="rounder-circle"
                  />
                </figure>
                <span className="d-none d-md-inline-block">
                  {user && user.name.split(" ")[0]}
                </span>
              </Link>
              <div
                className="dropdown-menu"
                aria-labelledby="dropDownMenuButton"
              >
                {user && user.role === "admin" && (
                  <Link className="dropdown-item" to="/dashboard">
                    Dashboard
                  </Link>
                )}
                <Link className="dropdown-item" to="/orders/me">
                  Orders
                </Link>
                <Link className="dropdown-item" to="/me">
                  Profile
                </Link>
                <Link
                  className="dropdown-item text-danger"
                  to="/"
                  onClick={logoutHandler}
                >
                  Logout
                </Link>
              </div>
            </div>
          ) : (
            !loading && (
              <Link to="/login" className="btn ml-4" id="login_btn">
                Login
              </Link>
            )
          )}
        </div>
      </nav>
    </Fragment>
  );
};

export default Header;
