import React, { useState } from 'react';
import { Toaster, toast } from 'sonner';
import gif from './images/gif.gif';
import { X } from 'react-feather';
import { useMarketplaceStore } from '../../stores/marketplaceStore';

const AccessModal = () => {
  const userIdString = localStorage.getItem('userId');
  const userId = userIdString ? JSON.parse(userIdString) : null;
  const token = localStorage.getItem('token');
  
  const modal2Open = useMarketplaceStore((state) => state.modal2Open);
  const setModal2Open = useMarketplaceStore((state) => state.setModal2Open);
  const authorization_code = useMarketplaceStore((state) => state.authorizationCode);
  const setAuthorization_code = useMarketplaceStore((state) => state.setAuthorizationCode);
  const setConnectClickedState = useMarketplaceStore((state) => state.setConnectClicked);
  const setConnectTime = useMarketplaceStore((state) => state.setConnectTime);
  
  const [myLoader, setMyLoader] = useState(false);
  const [isCodeEmpty, setIsCodeEmpty] = useState(false);


  const sendCode = async () => {
    if (!authorization_code.trim()) {
      setIsCodeEmpty(true);
      toast.error('Please enter the authorization code');
      return;
    }

    setMyLoader(true);
    let endpoint = `https://service.swiftsuite.app/marketplaceApp/oauth/callback/${userId}/Ebay/`; 
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify({ authorization_code }),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      setMyLoader(false);    
      if (response.status === 200) {
        toast.success("eBay connection successful!");
        setConnectClickedState(false);
        setConnectTime(null);
        setModal2Open(false);
        setAuthorization_code('');
        setIsCodeEmpty(false);
      } else if (response.status === 400) {
        toast.error("Invalid authorization code. Please try again.");
        setIsCodeEmpty(true);
      } else if (response.status === 500) {
        toast.error("Authorization code has expired. Please authenticate again.");
      } else {
        toast.error("Connection failed. Please try again.");
      }
    } catch (err) {
      console.error("Error response:", err.response);  
      console.error("Error message:", err.message);
      setMyLoader(false);
      toast.error("Connection error. Please try again.");
    }
  };

  const handleAccessChange = (event) => {
    const value = event.target.value;
    setAuthorization_code(value);
    if (value.trim()) {
      setIsCodeEmpty(false);
    }
  };

  const handleClose = () => {
    setModal2Open(false);
    setIsCodeEmpty(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendCode();
  };

  if (!modal2Open) return <Toaster position="top-right" />;

  return (
    <>
      <Toaster position="top-right" />
      
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-md w-full transform transition-all duration-300 animate-in fade-in zoom-in-95">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#027840] bg-opacity-10 rounded-lg">
                <svg
                  className="w-5 h-5 text-[#027840]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-gray-900">eBay Authorization</h2>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-md"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-5">
            <p className="text-sm text-gray-600 mb-5">
              Enter the authorization code provided by eBay after you complete the authentication process.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="auth-code"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Authorization Code
                </label>
                <textarea
                  id="auth-code"
                  value={authorization_code}
                  onChange={handleAccessChange}
                  placeholder="Enter your code here"
                  rows="4"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#027840] focus:ring-opacity-50 transition-all resize-none ${
                    isCodeEmpty
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                  autoFocus
                />
                {isCodeEmpty && (
                  <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Authorization code is required
                  </p>
                )}
              </div>

              {/* Info Box */}
              <div className="bg-[#027840] bg-opacity-5 border border-[#027840] border-opacity-20 rounded-lg p-3">
                <p className="text-xs text-gray-700 flex items-start gap-2">
                  <svg
                    className="w-4 h-4 text-[#027840] mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>You have 6 minutes to enter the code after eBay authentication.</span>
                </p>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="flex gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!authorization_code.trim() || myLoader}
              className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-[#027840] rounded-lg hover:bg-[#089451] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {myLoader ? (
                <>
                  <img src={gif} alt="Loading" className="w-[16px]" />
                  Submitting...
                </>
              ) : (
                'Submit'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccessModal;