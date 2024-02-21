import { catchAsyncError } from "../utils/catchAsyncError";
import { successHandler } from "../utils/notificationHandler";

export const createNewProductReviewService = (
  createNewProductReviewFormData,
  createNewReviewFunction
) =>
  catchAsyncError(
    createNewProductReviewFormData,
    async (createNewProductReviewFormData) => {
      await createNewReviewFunction(createNewProductReviewFormData).unwrap();
      successHandler("Review Posted");
    }
  );
// adminServices
export const newProductService = (
  newProductFormData,
  newProductFunction,
  navigate
) =>
  catchAsyncError(newProductFormData, async (registerFormData) => {
    await newProductFunction(registerFormData).unwrap();
    successHandler("Product created successfully");
    navigate("/admin/products");
  });

export const deleteProductService = (productId, deleteProductFunction) =>
  catchAsyncError(productId, async (productId) => {
    await deleteProductFunction(productId).unwrap();
    successHandler("Product Deleted Successfully");
  });

export const updateProductService = (
  productData,
  updateProductFunction,
  navigate
) =>
  catchAsyncError(productData, async (productData) => {
    await updateProductFunction(productData).unwrap();
    successHandler("Product updated successfully");
    navigate("/admin/products");
  });

export const deleteProductReviewService = (
  deleteReviewData,
  deleteReviewFunction,
  trigger
) =>
  catchAsyncError(deleteReviewData, async (deleteReviewData) => {
    const { productId } = deleteReviewData;
    await deleteReviewFunction(deleteReviewData).unwrap();
    successHandler("Review Deleted Successfully");
    const res = await trigger(productId).unwrap();
  });
