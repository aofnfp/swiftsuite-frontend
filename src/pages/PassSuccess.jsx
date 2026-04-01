import React from "react";
import sucImage from "../Images/suc.png";
import { Link } from "react-router-dom";

const PassSuccess = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center  h-[85vh]">
        <div className="my-2">
          <img src={sucImage} alt="" width={150} />
        </div>
        <div className="my-4 font-bold">
          <p>Password Recovery Successful</p>
        </div>
        <div className="my-2">
          <Link
            to="/signin"
            className="bg-[#089451]  text-white font-bold py-1 w-full rounded px-20"
          >
            Sign In
          </Link>
        </div>
      </div>
    </>
  );
};

export default PassSuccess;
