import { catchAsyncError } from "../utils/catchAsyncError"; //chains catchblock to catch error returned by async function
import { successHandler } from "../utils/notificationHandler";

export const signInService = (
  loginData,
  loginFunction,
  setSubmitting,
  navigate
) =>
  catchAsyncError(loginData, async (loginData) => {
    const { email, password } = loginData;
    await loginFunction({ email, password }).unwrap();
    setSubmitting(false);
    successHandler();
    navigate("/");
  });

export const signUpService = (
  registerFormData,
  registerFunction,
  setSubmitting,
  navigate
) =>
  catchAsyncError(registerFormData, async (registerFormData) => {
    await registerFunction(registerFormData).unwrap();
    setSubmitting(false);
    successHandler("User successfully created");
    navigate("/me");
  });

export const signOutService = (logoutFunction, navigate) =>
  catchAsyncError(async () => {
    await logoutFunction().unwrap();
    successHandler("Successfully LoggedOut");
    navigate("/");
  });

export const forgotPasswordService = (
  forgotPasswordFormData,
  forgotPasswordFunction,
  setSubmitting
) =>
  catchAsyncError(forgotPasswordFormData, async (forgotPasswordFormData) => {
    const data = await forgotPasswordFunction(forgotPasswordFormData).unwrap();
    setSubmitting(false);
    successHandler(data?.message);
  });

export const resetPasswordService = (
  resetPasswordFormData,
  resetPasswordFunction,
  setSubmitting,
  navigate
) =>
  catchAsyncError(resetPasswordFormData, async (resetPasswordFormData) => {
    await resetPasswordFunction(resetPasswordFormData).unwrap();
    setSubmitting(false);
    successHandler("Password updated Successfully");
    navigate("/login");
  });

export const sendVerifyEmailService = (
  sendVerifyEmailFormData,
  sendVerifyEmailFunction,
  setSubmitting
) =>
  catchAsyncError(sendVerifyEmailFormData, async (sendVerifyEmailFormData) => {
    const data = await sendVerifyEmailFunction(
      sendVerifyEmailFormData
    ).unwrap();
    setSubmitting(false);
    successHandler(data?.message);
  });

export const socialLoginService = (
  socialLoginData,
  socialLoginFunction,
  navigate
) =>
  catchAsyncError(socialLoginData, async (socialLoginData) => {
    await socialLoginFunction(socialLoginData);
    successHandler("Successfully LoggedIn");
    navigate("/me");
  });

export const updatePasswordService = (
  updatePasswordServiceFormData,
  updatePasswordServiceFunction,
  setSubmitting,
  navigate
) =>
  catchAsyncError(
    updatePasswordServiceFormData,
    async (updatePasswordServiceFormData) => {
      await updatePasswordServiceFunction(
        updatePasswordServiceFormData
      ).unwrap();
      setSubmitting(false);
      successHandler("Password Updated successfully");
      navigate("/me");
    }
  );

export const updateProfileService = (
  updateProfileServiceFormData,
  updateProfileServiceFunction,
  setSubmitting,
  navigate
) =>
  catchAsyncError(
    updateProfileServiceFormData,
    async (updateProfileServiceFormData) => {
      await updateProfileServiceFunction(updateProfileServiceFormData).unwrap();
      successHandler("Profile Updated Successfully");
      setSubmitting(false);
      navigate("/me");
    }
  );

export const verifyEmailService = (
  verifyEmailFormData,
  verifyEmailFormDataFunction,
  setSubmitting,
  navigate
) =>
  catchAsyncError(verifyEmailFormData, async (verifyEmailFormData) => {
    await verifyEmailFormDataFunction(verifyEmailFormData).unwrap();
    setSubmitting(false);
    successHandler("Email Verfied Successfully");
    navigate("/me");
  });
