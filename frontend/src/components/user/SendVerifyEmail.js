import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";

import MetaData from "../layout/MetaData";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

//queries and mutations
import { useSendVerifyEmailMutation } from "../../slices/userApiSlice";

const SendVerifyEmail = () => {
  const verifyEmailValidation = Yup.object().shape({
    email: Yup.string()
      .required("Email address is required")
      .email("Please enter a valid email address"),
  });
  const { user } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const [sendVerifyEmail, { isLoading }] = useSendVerifyEmailMutation();

  const submitHandler = async ({ email }, { setSubmitting }) => {
    const formData = new FormData();
    formData.set("email", email);

    try {
      const data = await sendVerifyEmail(formData).unwrap();
      setSubmitting(false);
      toast.success(data?.message);
    } catch (err) {
      toast.error(err?.data?.errMessage);
    }
  };
  useEffect(() => {
    if (user.isVerified) {
      navigate("/me");
    }
  }, [user]);
  return (
    <div className="container container-fluid">
      <MetaData title={"Send Verify Email"} />
      <Formik
        enableReinitialize
        initialValues={{
          email: "",
        }}
        validationSchema={verifyEmailValidation}
        onSubmit={submitHandler}
      >
        {({
          values,
          handleChange,
          handleSubmit,
          errors,
          touched,
          handleBlur,
          isSubmitting,
        }) => {
          return (
            <div className="row wrapper">
              <div className="col-10 col-lg-5">
                <form className="shadow-lg" onSubmit={handleSubmit}>
                  <h1 className="mb-3">Send Verify Email</h1>
                  <div className="form-group">
                    <label htmlFor="email_field">Enter Email</label>
                    <input
                      type="email"
                      id="email_field"
                      className="form-control"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="email"
                      disabled={isSubmitting}
                      placeholder="Email"
                    />
                    {errors.email && touched.email && (
                      <p className="text-danger">{errors.email}</p>
                    )}
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
          );
        }}
      </Formik>
    </div>
  );
};

export default SendVerifyEmail;
