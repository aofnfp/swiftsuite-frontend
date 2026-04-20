import React from 'react'
import { Link } from 'react-router-dom'
import sucImage from '../Images/suc.png'

const Regsuccess = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-green-100/20 rounded-full blur-3xl -ml-40 -mb-40"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600"></div>

          <div className="px-6 py-12 sm:px-8 sm:py-16">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 animate-pulse">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-green-50/50 border-2 border-green-200"></div>
                </div>

                <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
                  <img
                    src={sucImage}
                    alt="Success"
                    className="w-20 h-20 sm:w-24 sm:h-24 object-contain drop-shadow-lg"
                  />
                </div>
              </div>
            </div>

            <div className="text-center mb-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                Registration Successful
              </h1>
            </div>

            <div className="text-center mb-8">
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Welcome! Your account has been created successfully. You're all set to get started.
              </p>
            </div>

            <div className="mb-4">
              <Link
                to="/signin"
                className="block w-full bg-gradient-to-r from-green-700 to-emerald-800 hover:from-green-800 hover:to-emerald-900 text-white font-semibold py-3 sm:py-3.5 px-4 rounded-xl transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 text-base sm:text-lg text-center no-underline"
              >
                Sign In Now
              </Link>
            </div>

            <div>
              <Link
                to="/"
                className="block w-full text-gray-700 hover:text-gray-900 font-medium py-2.5 px-4 rounded-xl transition-colors duration-200 hover:bg-gray-100 text-sm sm:text-base text-center no-underline"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Regsuccess