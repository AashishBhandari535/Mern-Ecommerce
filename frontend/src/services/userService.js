import { catchAsyncError } from "../utils/catchAsyncError"; //chains catchblock to  catch error returned by async function
import { successHandler } from "../utils/notificationHandler";

//admin
export const updateUserService = (userData, updateUserFunction, navigate) =>
  catchAsyncError(userData, async (userData) => {
    await updateUserFunction(userData).unwrap();
    successHandler("User updated successfully");
    navigate("/admin/users");
  });

export const deleteUserService = (userId, deleteUserFunction) =>
  catchAsyncError(userId, async (userId) => {
    await deleteUserFunction(userId).unwrap();
    successHandler("User deleted successfully");
  });
