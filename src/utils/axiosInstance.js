import axios from "axios";

const PUBLIC_ROUTES = [
  "/",
  "/signin",
  "/signup",
  "/pricing",
  "/aboutus",
  "/blog",
  "/faqs",
  "/contact-us",
];

const axiosInstance = axios.create({
  baseURL: "https://service.swiftsuite.app",
  headers: {
    Accept: "application/json",
  },
});

const isPublicRoute = (pathname) => {
  return PUBLIC_ROUTES.some((route) => {
    if (route === "/") return pathname === "/";
    return pathname === route || pathname.startsWith(route);
  });
};

const clearAuthStorage = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("permissions");
  localStorage.removeItem("fullName");
  localStorage.removeItem("userId");
};

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
  clearAuthStorage();

  if (skipRedirect) return;

  const currentPath = window.location.pathname;

  if (isPublicRoute(currentPath)) return;

  if (isRedirecting) return;
  isRedirecting = true;

  if (currentPath !== "/signin") {
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