import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";

import MetaData from "../layout/MetaData";

import { ImEye, ImEyeBlocked } from "react-icons/im";

//queries and mutations
import { useRegisterMutation } from "../../slices/userApiSlice";
import SocialLogin from "./SocialLogin";

//NotificationMessages
import { SuccessHandler, ErrorHandler } from "../../utils/NotificationHandler";

const Register = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const registerValidation = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .required("Email address is required")
      .email("Please enter a valid email address"),
    password: Yup.string()
      .required("Please enter a password")
      .min(6, "Must be 6 characters or more"),
    confirmPassword: Yup.string()
      .required("Please re-type your password")
      .min(6, "Must be 6 characters or more")
      .oneOf([Yup.ref("password")], "Passwords does not match"),
    avatar: Yup.mixed().nullable().required("Please enter a photo"),
  });

  const [register, { isLoading }] = useRegisterMutation();

  const submitHandler = async (
    { name, email, password, confirmPassword, avatar },
    { setSubmitting }
  ) => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("passwordConfirm", confirmPassword);
    formData.append("avatar", avatar);

    // for (const value of formData.values()) {
    //   console.log(value);
    // }

    try {
      await register(formData).unwrap();
      setSubmitting(false);
      SuccessHandler("User successfully created");
      navigate("/me");
    } catch (err) {
      ErrorHandler(err?.data?.errMessage);
    }
  };

  return (
    <>
      <MetaData title={"Register User"} />
      <Formik
        enableReinitialize
        initialValues={{
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          avatar: "",
          avatarPreview: "/images/default_avatar.jpg",
        }}
        validationSchema={registerValidation}
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
          setFieldValue,
        }) => {
          return (
            <div className="container container-fluid">
              <div className="row wrapper">
                <div className="col-10 col-lg-5">
                  <form
                    className="shadow-lg"
                    onSubmit={handleSubmit}
                    encType="multipart/form-data"
                  >
                    <h1 className="mb-3">Register</h1>

                    <div className="form-group">
                      <label htmlFor="email_field">Name</label>
                      <input
                        type="name"
                        id="name_field"
                        className="form-control"
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name="name"
                        placeholder="Name"
                        disabled={isSubmitting}
                      />
                      {errors.name && touched.name && (
                        <p className="text-danger">{errors.name}</p>
                      )}
                    </div>

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
                        placeholder="Email"
                        disabled={isSubmitting}
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
                          placeholder="Password"
                          disabled={isSubmitting}
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
                      <label htmlFor="password_field">PasswordConfirm</label>
                      <div className="position-relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          id="password_field"
                          className="form-control"
                          value={values.confirmPassword}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          name="confirmPassword"
                          placeholder="PasswordConfirm"
                          disabled={isSubmitting}
                        />
                        <div
                          className="position-absolute"
                          style={{
                            top: "50%",
                            right: 0,
                            transform: "translate(-50%,-50%)",
                          }}
                          onClick={() =>
                            setShowConfirmPassword((prev) => !prev)
                          }
                        >
                          {showConfirmPassword ? <ImEye /> : <ImEyeBlocked />}
                        </div>
                      </div>
                      {errors.confirmPassword && touched.confirmPassword && (
                        <p className="text-danger">{errors.confirmPassword}</p>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="avatar_upload">Avatar</label>
                      <div className="d-flex align-items-center">
                        <div>
                          <figure className="avatar mr-3 item-rtl">
                            <img
                              src={values.avatarPreview}
                              className="rounded-circle"
                              alt="Avatar Preview"
                            />
                          </figure>
                        </div>
                        <div className="custom-file">
                          <input
                            type="file"
                            name="avatar"
                            className="custom-file-input"
                            id="customFile"
                            accept="images/*"
                            onChange={(e) => {
                              const reader = new FileReader();

                              reader.onload = () => {
                                if (reader.readyState === 2) {
                                  setFieldValue("avatar", reader.result);
                                  setFieldValue("avatarPreview", reader.result);
                                }
                              };

                              reader.readAsDataURL(e.target.files[0]);
                            }}
                          />
                          <label
                            className="custom-file-label"
                            htmlFor="customFile"
                          >
                            Choose Avatar
                          </label>
                        </div>
                      </div>
                      {errors.avatar && touched.avatar && (
                        <p className="text-danger">{errors.avatar}</p>
                      )}
                    </div>

                    <button
                      id="register_button"
                      type="submit"
                      className="btn btn-block py-3"
                      disabled={isLoading ? true : false}
                    >
                      REGISTER
                    </button>
                  </form>
                  <SocialLogin />
                </div>
              </div>
            </div>
          );
        }}
      </Formik>
    </>
  );
};

export default Register;

//https://codesandbox.io/s/formik-file-input-with-validation-pn3vb
//https://www.youtube.com/watch?v=LA5FvWE2_aM
