import React, { Fragment, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";

import MetaData from "../layout/MetaData";

import { toast } from "react-toastify";

// queries and mutations
import { useUpdateProfileMutation } from "../../slices/userApiSlice";
import { useSelector } from "react-redux";

const UpdateProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const updateValidation = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .required("Email address is required")
      .email("Please enter a valid email address"),
    avatar: Yup.mixed().nullable().required("Please enter a photo"),
  });

  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const navigate = useNavigate();

  const submitHandler = async ({ name, email, avatar }, { setSubmitting }) => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("avatar", avatar);

    try {
      await updateProfile(formData).unwrap();
      toast.success("Profile Updated Successfully");
      setSubmitting(false);
      navigate("/me");
    } catch (err) {
      toast.error(err?.data?.errMessage.split(":")[2]);
    }
  };
  useEffect(() => {
    if (user.isVerified) {
      navigate("/me");
    }
  }, [user]);
  return (
    <Fragment>
      <MetaData title={"Update Profile"} />
      <Formik
        enableReinitialize
        initialValues={{
          name: "",
          email: "",
          avatar: "",
          avatarPreview: "/images/default_avatar.jpg",
        }}
        validationSchema={updateValidation}
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
                <form
                  className="shadow-lg"
                  onSubmit={handleSubmit}
                  encType="multipart/form-data"
                >
                  <h1 className="mt-2 mb-5">Update Profile</h1>

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
                    type="submit"
                    className="btn update-btn btn-block mt-4 mb-3"
                    disabled={isLoading ? true : false}
                  >
                    Update
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

export default UpdateProfile;
