import React from 'react'
import img from '../Images/success.png'
import { Link } from 'react-router-dom'

const SuccessThanks = () => {
  return (
    <div className="bg-white h-screen flex flex-col justify-center items-center text-center space-y-3">
      <img src={img} width={150} alt="success" />
      <h2 className="text-2xl font-semibold text-gray-800">
        Vendor Integration <br /> Successful
      </h2>
      <p className="text-gray-600 max-w-md text-xl">
        Swiftsuite will integrate your vendor <br /> soon. Please be patient.
      </p>
      <Link
        to="/layout/editenrollment"
        className="text-[#027840] border border-[#027840] px-6 py-2 rounded-lg hover:bg-green-700 hover:text-white transition"
      >
        Back to Vendor
      </Link>
    </div>
  )
}

export default SuccessThanks
