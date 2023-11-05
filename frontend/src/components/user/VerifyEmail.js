import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import MetaData from "../layout/MetaData";

//Queries and Mutation
import { useVerifyEmailMutation } from "../../slices/userApiSlice";

import { toast } from "react-toastify";

const VerifyEmail = () => {
  const { emailVerificationToken, userId } = useParams();

  const [emailVerificationCode, setEmailVerificationCode] = useState(
    emailVerificationToken
  );

  const navigate = useNavigate();

  const [verifyEmail] = useVerifyEmailMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    const verifyEmailData = {
      userId,
      emailVerificationCode,
    };

    try {
      await verifyEmail(verifyEmailData).unwrap();
      toast.success("Email Verfied Successfully");
      navigate("/me");
    } catch (err) {
      toast.error(err?.data?.errMessage);
    }
  };

  return (
    <div className="container container-fluid">
      <MetaData title={" Verify Email"} />

      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form className="shadow-lg" onSubmit={submitHandler}>
            <h1 className="mb-3">Verify Email Token</h1>

            <div className="form-group">
              <label htmlFor="password_field">Email Token</label>
              <input
                type="password"
                id="password_field"
                className="form-control"
                value={emailVerificationCode}
                onChange={(e) => setEmailVerificationCode(e.target.value)}
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

export default VerifyEmail;
