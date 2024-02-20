import React, { Fragment, useState, useEffect } from "react";

import MetaData from "../layout/MetaData";
import Sidebar from "./Sidebar";

import { useNavigate, useParams } from "react-router-dom";

// Queries and Mutations
import {
  useGetUserDetailsQuery,
  useUpdateUserMutation,
} from "../../slices/userApiSlice";

// NotificationMessage
import { SuccessHandler, ErrorHandler } from "../../utils/NotificationHandler";

const UpdateUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const navigate = useNavigate();

  const { id: userId } = useParams();

  const { data } = useGetUserDetailsQuery(userId);
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  useEffect(() => {
    setName(data?.user.name);
    setEmail(data?.user.email);
    setRole(data?.user.role);
  }, [data?.user]);

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.set("name", name);
    formData.set("email", email);
    formData.set("role", role);

    const userData = {
      userId,
      formData,
    };

    try {
      await updateUser(userData).unwrap();
      SuccessHandler("User updated successfully");
      navigate("/admin/users");
    } catch (err) {
      ErrorHandler(err?.data?.errMessage);
    }
  };

  return (
    <Fragment>
      <MetaData title={`Update User`} />
      <div className="row">
        <div className="col-3 col-md-2 col-lg-2">
          <Sidebar />
        </div>

        <div className="col-9 col-md-10 col-lg-10">
          <div className="row wrapper">
            <div className="col-10 col-lg-5">
              <form className="shadow-lg" onSubmit={submitHandler}>
                <h1 className="mt-2 mb-5">Update User</h1>

                <div className="form-group">
                  <label htmlFor="name_field">Name</label>
                  <input
                    type="name"
                    id="name_field"
                    className="form-control"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email_field">Email</label>
                  <input
                    type="email"
                    id="email_field"
                    className="form-control"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="role_field">Role</label>

                  <select
                    id="role_field"
                    className="form-control"
                    name="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn update-btn btn-block mt-4 mb-3"
                  disabled={isLoading ? true : false}
                >
                  Update
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default UpdateUser;
