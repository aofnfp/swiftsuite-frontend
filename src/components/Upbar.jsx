import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { fetchVendorEnrolled } from "../api/authApi";

const Upbar = ( ) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); 
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await fetchVendorEnrolled();
        setIsAuthenticated(true);
      } catch (err) {
        console.log(err);
        if (
          err.response?.status === 401 &&
          err.response?.data?.detail === "Authentication credentials were not provided."
        ) {
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(false);
        }
      }
    };
    checkAuth();
  }, [location.pathname]); 

  return (
    <div
      className="fixed w-screen lg:hidden ms-[-5%] bg-white p-5 rounded bg-green-500"
      style={{ zIndex: "2" }}
    >
      <section className="mx-1">
        <div className="grid grid-cols-2 gap-2 justify-center items-center">
          <Link to="/" className="font-semibold">Home</Link>
          <Link to="/faqs" className="font-semibold">Faqs</Link>
          <Link to="/pricing" className="font-semibold">Pricing</Link>
          <Link to="/blog" className="font-semibold">Blog</Link>
          <Link to="/aboutus" className="font-semibold">About</Link>
          <Link to="/contact-us" className="font-semibold">Contact Us</Link>
        </div>

        <div className="flex md:gap-22 gap-5 my-4">
          <div className="lg:flex justify-center items-center gap-6 md:me-10 mt-1">
            {isAuthenticated === null ? null : isAuthenticated ? (
              <Link
                to="/layout/home"
                className="border w-[165px] text-white text-center p-2 bg-[#089451] hover:border-[#089451] hover:bg-white hover:text-[#089451] rounded-[6px]"
              >
                Go Back to Dashboard
              </Link>
            ) : (
              <div className="flex justify-center items-center gap-6 md:me-10 mt-1">
                <Link
                  to="/signup"
                  className="border w-[165px] text-white text-center p-2 bg-[#089451] hover:border-[#089451] hover:bg-white hover:text-[#089451] rounded-[6px]"
                >
                  Get Started For Free
                </Link>
                <Link
                  to="/signin"
                  className="border w-[150px] border-[#089451] hover:border-green-900 text-center p-2 text-[#089451] hover:text-white rounded-[6px] hover:bg-[#089451]"
                >
                  Sign in
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Upbar;
