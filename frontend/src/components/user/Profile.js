import React, { Fragment } from "react";
import { Link } from "react-router-dom";

import Loader from "../layout/Loader";
import MetaData from "../layout/MetaData";

import { useSelector } from "react-redux";

const Profile = () => {
  const { loading, user } = useSelector((state) => state.auth);
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <div className="container container-fluid">
          <MetaData title={"Your Profile"} />
          <h2 className="mt-5 ml-md-5 text-center text-md-left">My Profile</h2>
          <div className="row justify-content-around mt-5 user-info">
            <div className="col-12 col-md-3 text-center">
              <figure className="avatar avatar-profile ">
                <img
                  className="rounded-circle img-fluid"
                  src={user.avatar.url}
                  alt={user.name}
                />
              </figure>
              {user.socialLogin === false && (
                <Link
                  to="/me/update"
                  id="edit_profile"
                  className="btn btn-primary btn-block my-5"
                >
                  Edit Profile
                </Link>
              )}
            </div>

            <div className="col-12 col-md-5">
              <h4>Full Name</h4>
              <p>{user.name}</p>

              <h4>Email Address</h4>
              <p>{user.email}</p>

              <h4>Joined On</h4>
              <p>{String(user.createdAt).substring(0, 10)}</p>

              {user.role !== "admin" && (
                <Link to="#" className="btn btn-danger btn-block mt-5">
                  My Orders
                </Link>
              )}

              {user.socialLogin === false && (
                <Link
                  to="/password/update"
                  className="btn btn-primary btn-block mt-3"
                >
                  Change Password
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default Profile;
