import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";

import MetaData from "../layout/MetaData";
import { toast } from "react-toastify";

//Queries and Mutation
import { useVerifyEmailMutation } from "../../slices/userApiSlice";

const VerifyEmail = () => {
  const { emailVerificationToken, userId } = useParams();
  const emailVerificationTokenValidation = Yup.object().shape({
    emailVerificationCode: Yup.string().required(
      "Email Verification Token is required"
    ),
  });

  const navigate = useNavigate();

  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();

  const submitHandler = async (
    { emailVerificationCode },
    { setSubmitting }
  ) => {
    const verifyEmailData = {
      userId,
      emailVerificationCode,
    };

    try {
      await verifyEmail(verifyEmailData).unwrap();
      setSubmitting(false);
      toast.success("Email Verfied Successfully");
      navigate("/me");
    } catch (err) {
      toast.error(err?.data?.errMessage);
    }
  };

  return (
    <div className="container container-fluid">
      <MetaData title={" Verify Email"} />

      <Formik
        enableReinitialize
        initialValues={{
          emailVerificationCode: emailVerificationToken,
        }}
        validationSchema={emailVerificationTokenValidation}
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
                  <h1 className="mb-3">Verify Email Token</h1>

                  <div className="form-group">
                    <label htmlFor="password_field">Email Token</label>
                    <input
                      type="text"
                      id="email_field"
                      className="form-control"
                      value={values.emailVerificationCode}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="emailVerificationCode"
                      disabled={isSubmitting}
                      placeholder="Verification Token"
                    />
                    {errors.emailVerificationCode &&
                      touched.emailVerificationCode && (
                        <p className="text-danger">
                          {errors.emailVerificationCode}
                        </p>
                      )}
                  </div>

                  <button
                    id="new_password_button"
                    type="submit"
                    className="btn btn-block py-3"
                    disabled={isLoading ? true : false}
                  >
                    Set Password
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

export default VerifyEmail;
