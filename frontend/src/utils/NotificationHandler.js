import { toast } from "react-toastify";

export function errorHandler(err) {
  if (err instanceof Error) toast.error(err);
  else toast.error(err?.data?.errMessage);
}

export function successHandler(success) {
  toast.success(success);
}
