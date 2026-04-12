import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://service.swiftsuite.app",
  headers: {
    Accept: "application/json",
  },
});

// ✅ Request interceptor (attach token)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ✅ Handle FormData automatically
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// flag to prevent multiple simultaneous 401/403 responses from firing multiple redirects
let isRedirecting = false;

function handleAuthFailure() {
  if (isRedirecting) return;
  isRedirecting = true;

  // clear only auth-related keys, preserving any unrelated local data
  localStorage.removeItem("token");
  localStorage.removeItem("permission");
  localStorage.removeItem("fullName");
  localStorage.removeItem("userId");

  if (window.location.pathname !== "/signin") {
    window.location.replace("/signin");
  }
}

// ✅ Response interceptor (HANDLE TOKEN EXPIRY HERE)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    // 401 = unauthorized (expired/invalid token), 403 = forbidden (revoked session)
    if (status === 401) {
      handleAuthFailure();
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

