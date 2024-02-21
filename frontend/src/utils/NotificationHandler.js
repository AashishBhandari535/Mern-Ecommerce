import { toast } from "react-toastify";

export function errorHandler(err) {
  if (err instanceof Error) toast.error(err?.data?.errMessage);
  else toast.error(err);
}

export function successHandler(success) {
  toast.success(success);
}
