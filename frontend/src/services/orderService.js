import { catchAsyncError } from "../utils/catchAsyncError"; //chains catchblock to  catch error returned by async function
import { successHandler } from "../utils/notificationHandler";

//admin
export const deleteOrderService = (OrderId, deleteOrderFunction) =>
  catchAsyncError(OrderId, async (OrderId) => {
    await deleteOrderFunction(OrderId).unwrap();
    successHandler("Order deleted successfully");
  });

export const updateOrderService = (updateOrderData, updateOrderFunction) =>
  catchAsyncError(updateOrderData, async (updateOrderData) => {
    await updateOrderFunction(updateOrderData);
    successHandler("Order updated successfully");
  });
