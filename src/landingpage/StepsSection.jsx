import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import account from "../Images/account.png";
import doorship from "../Images/doorship.png";
import marketplace from "../Images/marketplace.png";
import selling from "../Images/selling.png";

export default function StepsSection() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center py-10 px-4 md:px-10 lg:px-20">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
        Want to get started on Swift Suite?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-lg shadow-lg flex flex-col items-start"
        >
          <div className="bg-green-700 p-6 w-full rounded-t-lg text-white space-y-3">
            <span className="text-4xl"><img src={account} alt="step1" className="w-6 h-6"/></span>
            <h3 className="text-lg font-semibold">Step 1:</h3>
            <h4 className="text-xl font-bold">Create Account</h4>
          </div>
          <div className="p-6 bg-white flex flex-col justify-between min-h-[250px] w-full">

            <p className="text-sm text-gray-700">
              Get started for free on Swift Suite by creating your account. Here is
              your first step in diving into accessing our interesting and seamless
              features.
            </p>
            <div className="mt-auto pt-4">
              <button 
                onClick={() => navigate('/signup')} 
                className="w-full bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition-all"
              >
                Get Started
              </button>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="rounded-lg shadow-lg flex flex-col items-start z-10"
        >
          <div className="bg-amber-600 p-6 w-full rounded-t-lg text-white space-y-3">
            <span className="text-4xl"><img src={doorship} alt="step2" className="w-6 h-6"/></span>
            <h3 className="text-lg font-semibold">Step 2:</h3>
            <h4 className="text-xl font-bold">Choose your dropship supplier</h4>
          </div>
          <div className="p-6 bg-white flex flex-col justify-between min-h-[200px] w-full">
            <p className="text-sm text-gray-700">
              Find your dropship supplier. Our dropship suppliers are reliable and
              efficient in delivering the best products. Add products to your
              products page from the database of your chosen supplier.
            </p>
            <div className="mt-auto pt-4">
              <button className="w-full bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all">
                Learn more
              </button>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="rounded-lg shadow-lg flex flex-col items-start"
        >
          <div className="bg-blue-300 p-6 w-full rounded-t-lg text-white space-y-3">
            <span className="text-4xl"><img src={marketplace} alt="step1" className="w-6 h-6"/></span>
            <h3 className="text-lg font-semibold">Step 3:</h3>
            <h4 className="text-xl font-bold">Choose your account</h4>
          </div>
          <div className="p-6 bg-white flex flex-col justify-between min-h-[250px] w-full">
            <p className="text-sm text-gray-700">
              At Swift Suite, you can choose from a wide range of marketplaces where
              you can list your products.
            </p>
            <div className="mt-6">
              <button className="w-full bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all">
                Learn more
              </button>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="rounded-lg shadow-lg flex flex-col items-start"
        >
          <div className="bg-teal-700 p-6 w-full rounded-t-lg text-white space-y-3">
            <span className="text-4xl"><img src={selling} alt="step1" className="w-6 h-6"/></span>
            <h3 className="text-lg font-semibold">Step 4:</h3>
            <h4 className="text-xl font-bold">Start Selling!</h4>
          </div>
          <div className="p-6 bg-white flex flex-col justify-between min-h-[250px] w-full">

            <p className="text-sm text-gray-700">
              Automatically upload products, sync inventory & route orders with
              dropship suppliers to your online store or marketplace platform.
            </p>
            <div className="mt-auto pt-4">
              <button className="w-full bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all">
                Learn more
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}