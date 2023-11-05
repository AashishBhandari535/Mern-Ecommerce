import React, { useState } from "react";

import MetaData from "../layout/MetaData";

//queries and mutations
import { useSendVerifyEmailMutation } from "../../slices/userApiSlice";

// import { useAlert } from "react-alert";
import { toast } from "react-toastify";

const SendVerifyEmail = () => {
  const [email, setEmail] = useState("");

  const [sendVerifyEmail, { isLoading }] = useSendVerifyEmailMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.set("email", email);

    try {
      const data = await sendVerifyEmail(formData).unwrap();
      toast.success(data?.message);
    } catch (err) {
      toast.error(err?.data?.errMessage);
    }
  };

  return (
    <div className="container container-fluid">
      <MetaData title={"Send Verify Email"} />
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form className="shadow-lg" onSubmit={submitHandler}>
            <h1 className="mb-3">Send Verify Email</h1>
            <div className="form-group">
              <label htmlFor="email_field">Enter Email</label>
              <input
                type="email"
                id="email_field"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              id="forgot_password_button"
              type="submit"
              className="btn btn-block py-3"
              disabled={isLoading ? true : false}
            >
              Send Email
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SendVerifyEmail;
