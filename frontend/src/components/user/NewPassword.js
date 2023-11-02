import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import MetaData from "../layout/MetaData";

//Queries and Mutation
import { useResetPasswordMutation } from "../../slices/userApiSlice";

import { toast } from "react-toastify";

const NewPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { token } = useParams();

  const navigate = useNavigate();

  const [resetPassword] = useResetPasswordMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);

    for (const value of formData.values()) {
      console.log(value);
    }
    const resetData = {
      token,
      formData,
    };

    try {
      await resetPassword(resetData).unwrap();
      toast.success("Password updated Successfully");
      navigate("/login");
    } catch (err) {
      toast.error(err?.data?.errMessage.split(":")[2]);
    }
  };

  return (
    <div className="container container-fluid">
      <MetaData title={"New Password Reset"} />

      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form className="shadow-lg" onSubmit={submitHandler}>
            <h1 className="mb-3">New Password</h1>

            <div className="form-group">
              <label htmlFor="password_field">Password</label>
              <input
                type="password"
                id="password_field"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirm_password_field">Confirm Password</label>
              <input
                type="password"
                id="confirm_password_field"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              id="new_password_button"
              type="submit"
              className="btn btn-block py-3"
            >
              Set Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewPassword;
