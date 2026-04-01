import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner"; 
import img from "../Images/logo.png";

const SubscriptionModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); 

  if (!isOpen) return null;

  const handleCheckPlans = () => {
    setLoading(true);
    setTimeout(() => {
      navigate("/pricing");
    }, 1500); 
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
       
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

      
        <motion.div
          role="dialog"
          aria-modal="true"
          className="relative bg-white rounded-2xl shadow-lg p-6 w-[90%] max-w-md z-10 text-center"
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
        >
          <div className="flex justify-center items-center">
            <img src={img} alt="my image" width={50} />
          </div>

          <p className="text-sm text-gray-600 mb-6">
            Your subscription is inactive. Renew or start a subscription to continue using our services.
          </p>

          <button
            onClick={handleCheckPlans}
            disabled={loading}
            className="px-6 py-3 bg-[#027840] text-white rounded-lg hover:bg-green-800 w-full font-medium flex items-center justify-center gap-2"
          >
            Check Subscription Plans
            {loading && (
              <ThreeDots height="20" width="40" color="#fff" ariaLabel="loading" />
            )}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SubscriptionModal;
