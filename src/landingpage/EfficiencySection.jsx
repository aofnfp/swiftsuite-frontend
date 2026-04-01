import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import cart_image from '../Images/cart_image.png'
import lock_chain from '../Images/lock_chain.png'
import black_sheriff from '../Images/black_sheriff.png'
import luxury from '../Images/luxury.png'

const EfficiencySection = () => {
    const navigate = useNavigate();
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between bg-white p-8 py-16">
      <div className="flex w-full gap-5 lg:w-3/5 pr-10">
        <motion.div 
          className="col-span-2"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img 
            src={cart_image}
            alt="Product Screenshot" 
            className="object-cover h-80" 
          />
        </motion.div>
        <div className="flex flex-col space-y-4 mt-2">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <img 
              src={lock_chain}
              alt="Product Package" 
              className="w-44 h-36 aspect-square object-cover rounded-md shadow-sm" 
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <img 
              src={luxury}
              alt="Person in White" 
              className="w-44 h-36 aspect-square object-cover rounded-md shadow-sm" 
            />
          </motion.div>
        </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <img 
              src={black_sheriff}
              alt="Person in White" 
              className="w-full h-80 aspect-square object-cover rounded-md shadow-sm" 
            />
          </motion.div>
      </div>
      <motion.div 
        className="lg:w-2/5 text-left lg:pl-10 mt-8 lg:-mt-10"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2 className="text-3xl font-bold text-green-700 mb-4">Unleashing Seamless Efficiency</h2>
        <p className="text-gray-700 mb-6 text-lg">
          Empower your business, streamline operations, and achieve unparalleled success with our innovative inventory management system. Your growth journey starts here – where efficiency meets excellence.
        </p>
        <motion.button
          onClick={() => navigate('/signup')}
          className="bg-[#027840] text-white px-6 py-3 rounded-md hover:bg-green-800 transition-all flex items-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Get Started <span className="ml-2">→</span>
        </motion.button>
      </motion.div>
    </div>
  );
}

export default EfficiencySection;