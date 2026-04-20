import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://service.swiftsuite.app",
  headers: {
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

let isRedirecting = false;

function handleAuthFailure(skipRedirect = false) {
  localStorage.removeItem("token");
  localStorage.removeItem("permissions");
  localStorage.removeItem("fullName");
  localStorage.removeItem("userId");

  if (skipRedirect) return;

  if (isRedirecting) return;
  isRedirecting = true;

  if (window.location.pathname !== "/signin") {
    window.location.replace("/signin");
  }
}

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const skipAuthRedirect = error?.config?.skipAuthRedirect === true;

    if (status === 401) {
      handleAuthFailure(skipAuthRedirect);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;


// THIS IS TO LOG AND DEBUG REQUESTS
// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: "https://service.swiftsuite.app",
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   },
//   // timeout: 50000,
// });

// // ✅ Request interceptor to inject token dynamically
// axiosInstance.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//    // ✅ Detect FormData automatically
//   if (config.data instanceof FormData) {
//     config.headers["Content-Type"] = "multipart/form-data";
//   } else {
//     config.headers["Content-Type"] = "application/json";
//   }
//   // Log the resolved request URL and method (dev-only)
//   try {
//     if (process.env.NODE_ENV !== "production") {
//       const base = config.baseURL || axiosInstance.defaults.baseURL || "";
//       // ensure no double slash
//       const fullUrl = base.replace(/\/$/, "") + (config.url || "");
//       const method = (config.method || "GET").toUpperCase();
//       // eslint-disable-next-line no-console
//       console.log(`[axios] ${method} ${fullUrl}`);
//     }
//   } catch (err) {
//     // eslint-disable-next-line no-console
//     console.log("[axios] request:", config.method, config.url);
//   }
//   return config;
// });

// export default axiosInstance;

