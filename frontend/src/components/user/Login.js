import React, { Fragment, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";

import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader";
import { ImEye, ImEyeBlocked } from "react-icons/im";

import { toast } from "react-toastify";

// queries and mutations
import { useLoginMutation } from "../../slices/userApiSlice";
import SocialLogin from "./SocialLogin";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const loginValidation = Yup.object().shape({
    email: Yup.string()
      .required("Email address is required")
      .email("Please enter a valid email address"),
    password: Yup.string().required("Please enter a password"),
  });

  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const submitHandler = async ({ email, password }, { setSubmitting }) => {
    try {
      await login({ email, password }).unwrap();
      setSubmitting(false);
      toast.success("Successfully LoggedIn");
      navigate("/");
    } catch (err) {
      toast.error(err?.data?.errMessage);
    }
  };

  return (
    <Fragment>
      {isLoading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={"Login"} />
          <Formik
            enableReinitialize
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={loginValidation}
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
                <div className="container container-fluid">
                  <div className="row wrapper">
                    <div className="col-10 col-lg-5">
                      <form className="shadow-lg" onSubmit={handleSubmit}>
                        <h1 className="mb-3">Login</h1>
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

                        <div className="form-group">
                          <label htmlFor="password_field">Password</label>
                          <div className="position-relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              id="password_field"
                              className="form-control"
                              value={values.password}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              name="password"
                              disabled={isSubmitting}
                              placeholder="Password"
                            />
                            <div
                              className="position-absolute"
                              style={{
                                top: "50%",
                                right: 0,
                                transform: "translate(-50%,-50%)",
                              }}
                              onClick={() => setShowPassword((prev) => !prev)}
                            >
                              {showPassword ? <ImEye /> : <ImEyeBlocked />}
                            </div>
                          </div>
                          {errors.password && touched.password && (
                            <p className="text-danger">{errors.password}</p>
                          )}
                        </div>

                        <Link
                          to="/password/forgot"
                          className="float-right mb-4"
                        >
                          ForgotPassword?
                        </Link>
                        <button
                          id="login_button"
                          type="submit"
                          className="btn btn-block py-3"
                        >
                          LOGIN
                        </button>

                        <Link to="/register" className="float-right mt-3">
                          New User?
                        </Link>
                      </form>
                      <SocialLogin />
                    </div>
                  </div>
                </div>
              );
            }}
          </Formik>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Login;
