import React, { useEffect, useState } from "react";
import img1 from "../Images/VendorFirstPage.png";
import { useDispatch } from "react-redux";
import { handleNextStep, setVendorAccount } from "../redux/vendor";
import { ThreeDots } from "react-loader-spinner";
import { Toaster, toast } from "sonner";
import { CgProfile } from "react-icons/cg";
import { AnimatePresence, motion } from "framer-motion";
import { MdOutlineArrowBackIos } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useVendorStore } from "../stores/VendorStore";

const AccountSkeleton = () => (
  <div className="w-full max-w-md py-3 px-4 rounded border border-[#E7F2ED] shadow-md my-3 animate-pulse">
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
      <div className="h-4 bg-gray-300 rounded w-32"></div>
    </div>
  </div>
);

const VendorPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const vendorId = useVendorStore((state) => state.vendorId);
  const newAccount = useVendorStore((state) => state.newAccount);
  const setVendorContext = useVendorStore((state) => state.setVendorContext);
  const setVendorConnection = useVendorStore((state) => state.setVendorConnection);
  const setCurrentStep = useVendorStore((state) => state.setCurrentStep);

  const [vendorAccounts, setVendorAccounts] = useState([]);
  const [showAccountSelection, setShowAccountSelection] = useState(false);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [loadingAccountId, setLoadingAccountId] = useState(null);

  // Reset showAccountSelection when newAccount changes
  useEffect(() => {
    if (newAccount) {
      setShowAccountSelection(false);
    }
  }, [newAccount]);

  useEffect(() => {
    const fetchAccounts = async () => {
      if (!token) return toast.error("Authentication token missing.");

      try {
        setLoadingAccounts(true);
        const response = await fetch("https://service.swiftsuite.app/api/v2/vendor-account/", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();
        const filtered = data?.filter((a) => String(a.vendor) === String(vendorId)) || [];
        setVendorAccounts(filtered);
      } catch (err) {
        toast.error("Failed to load vendor accounts.");
      } finally {
        setLoadingAccounts(false);
      }
    };

    fetchAccounts();
  }, [token, vendorId]);

  const handleBack = () => {
    if (showAccountSelection || newAccount) {
      setShowAccountSelection(false);
      setVendorContext({ newAccount: false });
    } else {
      navigate("/layout/editenrollment");
    }
  };

  const handleExistingAccount = () => {
    setVendorContext({ newAccount: false });
    setShowAccountSelection(true);
  };

  const handleNewAccount = () => {
    setVendorContext({ newAccount: true });
    dispatch(handleNextStep({}));
    setCurrentStep(1);
  };

  const handleAccountSelect = async (item) => {
    const {
      id,
      vendor: accountVendor,
      ftp_username,
      ftp_password,
      host,
      apiAccessId,
      apiAccessKey,
      Username,
      Password,
      POS,
    } = item;

    setLoadingAccountId(id);

    setVendorContext({
      vendor: accountVendor,
      vendorId: accountVendor,
      accountId: id,
      newAccount: false,
    });

    const payload = {
      vendor: accountVendor,
      ...(ftp_username && { ftp_username }),
      ...(ftp_password && { ftp_password }),
      ...(host && { host }),
      ...(apiAccessId && { apiAccessId }),
      ...(apiAccessKey && { apiAccessKey }),
      ...(Username && { Username }),
      ...(Password && { Password }),
      ...(POS && { POS }),
    };

    try {
      const response = await fetch("https://service.swiftsuite.app/api/v2/vendor-test/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`Failed: ${response.status}`);
      const result = await response.json();

      setVendorConnection(result);
      dispatch(setVendorAccount({ accountId: id, vendorId: accountVendor }));
      dispatch(handleNextStep({ account: id, vendor: accountVendor }));
      setCurrentStep(2);
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoadingAccountId(null);
    }
  };

  return (
    <section className="p-8 max-w-4xl mx-auto bg-white font-mirza">
      <button
        onClick={handleBack}
        className="border py-2 px-3 rounded-[8px] bg-[#BB8232] text-white flex w-[5rem] justify-center items-center gap-1"
      >
        <MdOutlineArrowBackIos />
        Back
      </button>

      <Toaster position="top-right" />

      <AnimatePresence mode="wait">
        <div className="w-full" style={{ minHeight: 500 }}>
          {!showAccountSelection && !newAccount ? (
            <motion.div
              key="initial-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col justify-center items-center gap-8 h-full"
            >
              <div className="w-full lg:w-1/2">
                <img src={img1} alt="Vendor Modal" className="w-full rounded" />
              </div>

              <div className="w-full lg:w-1/2 flex flex-col justify-center gap-4">
                <button
                  onClick={handleExistingAccount}
                  className="bg-[#027840] text-white py-2 rounded-lg"
                >
                  Select an account
                </button>

                <button
                  onClick={handleNewAccount}
                  className="border border-[#089451] py-2 rounded-lg text-[#089451]"
                >
                  Register a new account
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="account-selection-view"
              initial={{ x: 80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -80, opacity: 0 }}
              transition={{ duration: 0.45 }}
              className="flex flex-col items-center gap-4 h-full"
            >
              <p className="text-[#027840] font-medium text-xl">
                Select from the list of registered accounts
              </p>

              <div className="w-full flex flex-col justify-center items-center">
                {loadingAccounts ? (
                  <>
                    <AccountSkeleton />
                    <AccountSkeleton />
                    <AccountSkeleton />
                  </>
                ) : vendorAccounts.length > 0 ? (
                  vendorAccounts.map((item) => (
                    <motion.div
                      key={item.id}
                      onClick={() => handleAccountSelect(item)}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35 }}
                      className="w-full max-w-md py-3 px-4 rounded border border-[#E7F2ED] text-[#027840] shadow-md my-3 cursor-pointer flex justify-between items-center"
                    >
                      <div className="flex items-center gap-2">
                        <CgProfile className="text-2xl" />
                        <span className="font-medium">{item.name || `Account ${item.id}`}</span>
                      </div>

                      {loadingAccountId === item.id && <ThreeDots height="20" width="20" color="#4fa94d" />}
                    </motion.div>
                  ))
                ) : (
                  <p className="text-red-600">No accounts found.</p>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </AnimatePresence>
    </section>
  );
};

export default VendorPage;