import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const CustomIntegration = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className='py-[10%] bg-white'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='mb-8 relative'>
            <div className='flex items-center justify-between'>
              <Link
                to='/layout/editenrollment'
                className='flex items-center text-gray-600 hover:text-gray-900 transition-colors'
              >
                <svg
                  className='w-5 h-5 mr-2'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M10 19l-7-7m0 0l7-7m-7 7h18'
                  />
                </svg>
                Back
              </Link>

              <h1 className='text-xl font-bold text-gray-900 absolute left-1/2 transform -translate-x-1/2'>
                Custom Supplier Integration
              </h1>

              <div className='w-20'></div>
            </div>
          </div>

          <div className='flex justify-center'>
            <section className='flex md:flex-row flex-col gap-10'>
              {/* ✅ Waitlist card */}
              <div className='flex-1 border border-gray-200 transition-shadow p-6 flex flex-col'>
                <div className='py-4 mb-4'>
                  <h3 className='text-xl font-semibold text-[#027840] mb-2'>
                    Add Vendor to Waitlist
                  </h3>
                  <p className='text-gray-600 text-sm'>
                    Here, you will only be able to fill a notification form to ask for a vendor integration.
                    SwiftSuite will look into your request later on and proceed if necessary.
                  </p>
                </div>
                <div className='mt-auto md:me-8'>
                  <button
                  onClick={() => navigate('/layout/custom_vendors')}
                    className='w-full bg-[#027840] text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200'
                  >
                    Add Vendor
                  </button>
                </div>
              </div>

              {/* ✅ Enforce card */}
              <div className='flex-1 border border-gray-200 transition-shadow p-6 flex flex-col'>
                <div className='py-4 mb-4'>
                  <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                    Expedite Vendor
                  </h3>
                  <p className='text-gray-600 text-sm'>
                    Starting at $199, enforce an action to integrate your choice supplier immediately.
                    Get priority integration service for urgent requirements.
                  </p>
                </div>
                <div className='mt-auto md:me-10'>
                  <button
                    onClick={() => navigate('/layout/custom_vendor')}
                    className='w-full bg-black text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200'
                  >
                    Add Vendor
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomIntegration;
