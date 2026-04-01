import React from 'react';
import img1 from '../Images/successiimg.png';
import { Link } from 'react-router-dom';


const PaymentSuccessful = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <section className="flex flex-col items-center w-[417px] space-y-6">
        <img src={img1} alt="Success" width={341} />
        <h1 className="font-bold text-[#027840] text-[26px] text-center">
          Your subscription payment <br /> was successful!
        </h1>
        <Link to='/layout/home' className="w-[264px] flex justify-center items-center hover:text-[17px] h-[48px] rounded-[8px] bg-[#089451] font-bold text-[16px] text-white">
          Proceed to Dashboard
        </Link>
      </section>
    </div>
  );
};

export default PaymentSuccessful;
