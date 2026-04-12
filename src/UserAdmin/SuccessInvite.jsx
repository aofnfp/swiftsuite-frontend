import React, { useState } from 'react';
import img1 from '../Images/successiimg.png';
import { Link } from 'react-router-dom';
import { IoPersonAdd, IoHomeOutline } from 'react-icons/io5';
import { HiCheckBadge } from 'react-icons/hi2';

const SuccessInvite = () => {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <section className="flex flex-col items-center w-full max-w-md">

        {/* Card */}
        <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          {/* Green header strip */}
          <div className="bg-[#027840] px-8 pt-10 pb-16 flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
              <HiCheckBadge className="text-white text-4xl" />
            </div>
            <h1 className="font-bold text-white text-2xl text-center tracking-tight">
              New Member Created!
            </h1>
            <p className="text-white/75 text-sm text-center">
              The account has been set up and is ready to use.
            </p>
          </div>

          {/* Image — overlaps the green strip */}
          <div className="flex justify-center -mt-12 px-8">
            <div className="w-[220px] h-[180px] relative">
              {/* Skeleton shown while image loads */}
              {!imgLoaded && (
                <div className="absolute inset-0 rounded-xl bg-gray-100 animate-pulse" />
              )}
              <img
                src={img1}
                alt="Success illustration"
                onLoad={() => setImgLoaded(true)}
                className={`w-full h-full object-contain drop-shadow-md transition-opacity duration-500 ${
                  imgLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </div>
          </div>

          {/* Body */}
          <div className="px-8 pt-4 pb-8 flex flex-col items-center gap-6">
            {/* Info row */}
            <div className="w-full flex items-start gap-3 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
              <IoPersonAdd className="text-[#027840] text-lg mt-0.5 shrink-0" />
              <p className="text-sm text-gray-600 leading-relaxed">
                Share the generated password with the new member so they can sign in and update their credentials.
              </p>
            </div>

            {/* CTA */}
            <Link
              to="/layout/home"
              className="w-full flex justify-center items-center gap-2 h-11 rounded-lg bg-[#027840] border-2 border-[#027840] font-semibold text-sm text-white transition-all duration-200 hover:bg-white hover:text-[#027840] hover:shadow-md"
            >
              <IoHomeOutline size={16} />
              Proceed to Dashboard
            </Link>

            <Link
              to="/layout/home/invite"
              className="text-xs text-gray-400 hover:text-[#027840] transition-colors duration-200 font-medium"
            >
              + Add another member
            </Link>
          </div>

        </div>

      </section>
    </div>
  );
};

export default SuccessInvite;