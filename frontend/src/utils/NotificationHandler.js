import { toast } from "react-toastify";

export function ErrorHandler(err) {
  toast.error(err?.data?.errMessage);
}

export function SuccessHandler(success) {
  toast.success(success);
}
