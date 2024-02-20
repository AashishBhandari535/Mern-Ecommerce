import React, { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";

import MetaData from "../layout/MetaData";

import { ImEye, ImEyeBlocked } from "react-icons/im";

// queries and mutations
import { useUpdatePasswordMutation } from "../../slices/userApiSlice";

//NotificationMessages
import { SuccessHandler, ErrorHandler } from "../../utils/NotificationHandler";

const UpdatePassword = () => {
  const [showOldPassword, setShowOldPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState("");

  const updatePasswordValidation = Yup.object().shape({
    oldPassword: Yup.string()
      .required("Old Password is required")
      .min(6, "Must be 6 characters or more"),
    newPassword: Yup.string()
      .required("New Password is required")
      .min(6, "Must be 6 characters or more"),
  });

  const navigate = useNavigate();

  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();

  const submitHandler = async (
    { oldPassword, newPassword },
    { setSubmitting }
  ) => {
    const formData = new FormData();
    formData.append("oldPassword", oldPassword);
    formData.append("newPassword", newPassword);

    try {
      await updatePassword(formData).unwrap();
      setSubmitting(false);
      SuccessHandler("Password Updated successfully");
      navigate("/me");
    } catch (err) {
      ErrorHandler(err?.data?.errMessage);
    }
  };
  return (
    <Fragment>
      <MetaData title={"Change Password"} />

      <Formik
        enableReinitialize
        initialValues={{
          oldPassword: "",
          newPassword: "",
        }}
        validationSchema={updatePasswordValidation}
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
            <div className="row wrapper">
              <div className="col-10 col-lg-5">
                <form className="shadow-lg" onSubmit={handleSubmit}>
                  <h1 className="mt-2 mb-5">Update Password</h1>
                  <div className="form-group">
                    <label for="old_password_field">Old Password</label>
                    <div className="position-relative">
                      <input
                        type={showOldPassword ? "text" : "password"}
                        id="old_password_field"
                        className="form-control"
                        value={values.oldPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name="oldPassword"
                        placeholder="OldPassword"
                        disabled={isSubmitting}
                      />
                      <div
                        className="position-absolute"
                        style={{
                          top: "50%",
                          right: 0,
                          transform: "translate(-50%,-50%)",
                        }}
                        onClick={() => setShowOldPassword((prev) => !prev)}
                      >
                        {showOldPassword ? <ImEye /> : <ImEyeBlocked />}
                      </div>
                    </div>
                    {errors.oldPassword && touched.oldPassword && (
                      <p className="text-danger">{errors.oldPassword}</p>
                    )}
                  </div>

                  <div className="form-group">
                    <label for="new_password_field">New Password</label>
                    <div className="position-relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        id="new_password_field"
                        className="form-control"
                        value={values.newPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name="newPassword"
                        placeholder="NewPassword"
                        disabled={isSubmitting}
                      />
                      <div
                        className="position-absolute"
                        style={{
                          top: "50%",
                          right: 0,
                          transform: "translate(-50%,-50%)",
                        }}
                        onClick={() => setShowNewPassword((prev) => !prev)}
                      >
                        {showNewPassword ? <ImEye /> : <ImEyeBlocked />}
                      </div>
                    </div>
                    {errors.newPassword && touched.newPassword && (
                      <p className="text-danger">{errors.newPassword}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="btn update-btn btn-block mt-4 mb-3"
                    disabled={isLoading ? true : false}
                  >
                    Update Password
                  </button>
                </form>
              </div>
            </div>
          );
        }}
      </Formik>
    </Fragment>
  );
};

export default UpdatePassword;
