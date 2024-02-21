import { errorHandler } from "./notificationHandler";

export const catchAsyncError = (values = "", fn) => {
  Promise.resolve(fn(values)).catch((err) => {
    errorHandler(err);
  });
};
