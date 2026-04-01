// import { toast } from "sonner";

// export const handleApiError = (error) => {
//   if (error.response) {
//     const errorData = error.response?.data || {};
//     if (typeof errorData === "object" && !Array.isArray(errorData)) {
//       for (const [field, messages] of Object.entries(errorData)) {
//         if (Array.isArray(messages)) {
//           toast.error(`${field}: ${messages.join(", ")}`);
//         } else {
//           toast.error(`${field}: ${messages}`);
//         }
//       }
//     } else if (typeof errorData === "string") {
//       toast.error(errorData);
//     } else {
//       toast.error("An unexpected error occurred. Please try again.");
//     }
//   } else if (error.request) {
//     toast.error(
//       "No response from the server. Please check your internet connection."
//     );
//   }
//   else {
//     toast.error("An unexpected error occurred. Please try again.");
//   }
// };

import { toast } from "sonner";

export const handleApiError = (error) => {
  if (error.response) {
    const errorData = error.response?.data;
    if (typeof errorData === "string" && errorData.includes("KeyError")) {
      return toast.error("server error. Please try again later.");
    }
    if (typeof errorData === "string") {
      return toast.error(errorData);
    }
    if (typeof errorData === "object" && !Array.isArray(errorData)) {
      for (const [field, messages] of Object.entries(errorData)) {
        if (Array.isArray(messages)) {
          toast.error(`${field}: ${messages.join(", ")}`);
        } else {
          toast.error(`${field}: ${messages}`);
        }
      }
      return;
    }
    return toast.error("An unexpected error occurred. Please try again.");
  }
  if (error.request) {
    return toast.error(
      "No response from the server. Please check your internet connection."
    );
  }
  toast.error("An unexpected error occurred. Please try again.");
};
