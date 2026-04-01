import { toast } from "sonner";

export const showSuccess = (message) => {
  toast.success(message);
};

export const showError = (message) => {
  toast.error(message);
};

export const showInfo = (message) => {
  toast.info(message);
};



export const showApiError = (error, fallback = "Something went wrong") => {
  const data = error?.response?.data;

  let message = fallback;

  if (typeof data === "string") {
    message = data;
  } else if (data?.message) {
    message = data.message;
  } else if (data?.error) {
    message = data.error;
  } else if (data?.detail) {
    message = data.detail;
  }

  toast.error(message);
};