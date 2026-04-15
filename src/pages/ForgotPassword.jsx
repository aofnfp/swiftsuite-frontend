import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import { useFormik } from "formik";
import * as yup from 'yup'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import gif from '../Images/gif.gif'
import { Toaster, toast } from 'sonner';
import { forgotPassword } from '../api/authApi';

const ForgotPassword = () => {
  const [myLoader, setMyLoader] = useState('')

  let formik = useFormik({
    initialValues: {
      email: ""
    },
    onSubmit: async (values) => {
      setMyLoader(true)
      try {
        const response = await forgotPassword(values.email)
        toast.success("A link has been sent to your email to reset your password");
        localStorage.setItem('emailForAuth', values.email)
        setMyLoader(false)
      } catch (error) {
        toast.error("User with this email does not exist.");
        setMyLoader(false)
      }
    },
    validationSchema: yup.object({
      email: yup.string().email('Invalid email format').required('Email is required'),
    })
  });

  return (
    <>
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <section className='shadow-xl w-full sm:w-11/12 md:w-[400px] lg:w-1/3 p-6 sm:p-8 lg:p-6 rounded-lg bg-white'>
          {/* Header */}
          <div className='mb-6 sm:mb-8'>
            <h1 className='text-xl sm:text-2xl lg:text-2xl font-bold text-gray-900'>Forgot Password?</h1>
            <p className='text-sm sm:text-lg lg:text-lg font-semibold text-gray-700 my-3 sm:my-4'>Enter your Email Address</p>
          </div>

          {/* Form */}
          <form onSubmit={formik.handleSubmit} className='space-y-4 sm:space-y-5'>
            <div className='relative'>
              <label htmlFor="email" className='block font-semibold text-sm sm:text-base text-gray-800 mb-2'>Email Address</label>
              <div className='relative'>
                <input
                  id="email"
                  type='email'
                  placeholder='jane@example.com'
                  name='email'
                  autoComplete='email'
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`border-2 w-full mt-1 py-2 sm:py-2.5 ps-4 pr-10 text-sm sm:text-base rounded transition-colors ${
                    formik.touched.email && formik.errors.email
                      ? 'border-red-500 focus:outline-red-500'
                      : 'border-[#089451] focus:outline-[#089451]'
                  }`}
                />
                {formik.touched.email && !formik.errors.email && formik.values.email && (
                  <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              {formik.touched.email && formik.errors.email && (
                <span className='text-red-500 text-xs sm:text-sm mt-1 block'>{formik.errors.email}</span>
              )}
              {formik.touched.email && !formik.errors.email && formik.values.email && (
                <span className='text-green-600 text-xs sm:text-sm mt-1 block flex items-center gap-1'>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Valid email format
                </span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type='submit'
              disabled={myLoader}
              className='w-full bg-[#027840] hover:bg-[#076a41] disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center text-white font-bold py-2.5 sm:py-3 mt-6 sm:mt-8 h-10 sm:h-[40px] rounded transition-colors'
            >
              {myLoader ? (
                <img src={gif} alt="Loading" className='w-5 sm:w-[25px]' />
              ) : (
                'Reset Password'
              )}
            </button>
          </form>

          {/* How It Works */}
          <div className='mt-6 sm:mt-8 p-4 sm:p-5 bg-blue-50 rounded-lg border border-blue-200'>
            <p className='text-xs sm:text-sm font-semibold text-gray-900 mb-3'>How it works:</p>
            <ol className='space-y-2 text-xs sm:text-sm text-gray-700'>
              <li className='flex items-start gap-2'>
                <span className='font-bold text-[#089451] min-w-fit'>1.</span>
                <span>Enter the email address associated with your account</span>
              </li>
              <li className='flex items-start gap-2'>
                <span className='font-bold text-[#089451] min-w-fit'>2.</span>
                <span>Check your email for a password reset link</span>
              </li>
              <li className='flex items-start gap-2'>
                <span className='font-bold text-[#089451] min-w-fit'>3.</span>
                <span>Click the link and create a new password</span>
              </li>
              <li className='flex items-start gap-2'>
                <span className='font-bold text-[#089451] min-w-fit'>4.</span>
                <span>Log in with your new password</span>
              </li>
            </ol>
          </div>

          {/* Important Notes */}
          <div className='mt-4 sm:mt-6 p-4 sm:p-5 bg-amber-50 rounded-lg border border-amber-200'>
            <p className='text-xs sm:text-sm font-semibold text-gray-900 mb-2'>Important:</p>
            <ul className='space-y-1.5 text-xs sm:text-sm text-gray-700'>
              <li className='flex items-start gap-2'>
                <span className='text-amber-600 font-bold'>•</span>
                <span>Check your spam or junk folder if you don't see the email</span>
              </li>
              <li className='flex items-start gap-2'>
                <span className='text-amber-600 font-bold'>•</span>
                <span>The reset link expires in 24 hours</span>
              </li>
              <li className='flex items-start gap-2'>
                <span className='text-amber-600 font-bold'>•</span>
                <span>Use the email address you registered with</span>
              </li>
            </ul>
          </div>

          {/* Support Link */}
          <div className='mt-4 sm:mt-6 text-center'>
            <p className='text-xs sm:text-sm text-gray-600'>
              Didn't receive an email?{" "}
              <a
                href='/contact-us'
                className='font-semibold text-[#027840] hover:text-[#076a41] transition-colors'
              >
                Contact support
              </a>
            </p>
          </div>
        </section>
      </div>
      <Toaster position="top-right" />
    </>
  )
}

export default ForgotPassword