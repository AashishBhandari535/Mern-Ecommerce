import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";

import MetaData from "../layout/MetaData";

//queries and mutations
import { useForgotPasswordMutation } from "../../slices/userApiSlice";
import { forgotPasswordService } from "../../services/authService";

const ForgotPassword = () => {
  const emailValidation = Yup.object().shape({
    email: Yup.string()
      .required("Email address is required")
      .email("Please enter a valid email address"),
  });

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const submitHandler = async ({ email }, { setSubmitting }) => {
    const formData = new FormData();
    formData.set("email", email);

    forgotPasswordService(formData, forgotPassword, setSubmitting);
  };

  return (
    <>
      <div className="container container-fluid">
        <MetaData title={"Forgot Password"} />
        <Formik
          enableReinitialize
          initialValues={{
            email: "",
          }}
          validationSchema={emailValidation}
          onSubmit={submitHandler}
          className="shadow-lg"
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
                    <h1 className="mb-3">Forgot Password</h1>
                    <div className="form-group">
                      <label htmlFor="email_field">Email</label>
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
    </>
  );
};

export default ForgotPassword;
