import React from 'react';
import img1 from '../Images/paymentfailed.png';
import { Link } from 'react-router-dom';

const PaymentFailed = () => {
  return (
      <div className="min-h-screen flex items-center justify-center">
        <section className="flex flex-col items-center w-[417px] space-y-6">
          <img src={img1} alt="Success" width={341} />
          <h1 className="font-bold text-[#BB8232] text-[26px] text-center">
            Error occured during <br /> payment
          </h1>
          <p>This might be due to</p>
          <div>
            <div className='text-center font-bold'>1. Your bank or payment provider rejected the <br /> payment.</div>
            <div>
                <p className='text-center font-bold'>2. Incorrect payment information</p>
                <p className='text-center text-[#BB8232]'>(Wrong card number, expiration date, CVV or billing details.)</p>
            </div>
            <div className='text-center'>Payment atempt failed due to server or internet issues</div>
          </div>
          <Link to='/pricing' className="w-[264px] flex justify-center items-center hover:text-[17px] h-[48px] rounded-[8px] bg-[#089451] font-bold text-[16px] text-white">
            Try again
          </Link>
        </section>
      </div>
    );
}

export default PaymentFailed