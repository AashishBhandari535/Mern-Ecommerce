import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";

import MetaData from "../layout/MetaData";
import { ImEye, ImEyeBlocked } from "react-icons/im";
import { toast } from "react-toastify";

//Queries and Mutation
import { useResetPasswordMutation } from "../../slices/userApiSlice";

const NewPassword = () => {
  const [showPassword, setShowPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState("");
  const resetPasswordValidation = Yup.object().shape({
    password: Yup.string()
      .required(" Password is required")
      .min(6, "Must be 6 characters or more"),
    confirmPassword: Yup.string()
      .required(" Password is required")
      .min(6, "Must be 6 characters or more"),
  });

  const { token } = useParams();

  const navigate = useNavigate();

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const submitHandler = async (
    { password, confirmPassword },
    { setSubmitting }
  ) => {
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
      setSubmitting(false);
      toast.success("Password updated Successfully");
      navigate("/login");
    } catch (err) {
      toast.error(err?.data?.errMessage);
    }
  };

  return (
    <div className="container container-fluid">
      <MetaData title={"New Password Reset"} />
      <Formik
        enableReinitialize
        initialValues={{
          password: "",
          confirmPassword: "",
        }}
        validationSchema={resetPasswordValidation}
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
                  <h1 className="mb-3">New Password</h1>
                  <div className="form-group">
                    <label htmlFor="password_field"> Password</label>
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

                  <div className="form-group">
                    <label htmlFor="password_field">Confirm Password</label>
                    <div className="position-relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="password_field"
                        className="form-control"
                        value={values.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name="confirmPassword"
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
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                      >
                        {showConfirmPassword ? <ImEye /> : <ImEyeBlocked />}
                      </div>
                    </div>
                    {errors.confirmPassword && touched.confirmPassword && (
                      <p className="text-danger">{errors.confirmPassword}</p>
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

export default NewPassword;
