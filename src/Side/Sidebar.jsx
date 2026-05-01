import { useContext, useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { IoMdHelpCircleOutline } from "react-icons/io";
import { LiaSignOutAltSolid } from "react-icons/lia";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { MdOutlineInventory2, MdOutlineDashboard } from "react-icons/md";
import swift from "../Images/swift.png";
import { AppContext } from "../context/Dashboard";
import SignOutButton from "../pages/SignOutButton";
import { fetchVendorEnrolled } from "../api/authApi";
import { Icon, loadIcons } from "@iconify/react";

const Sidebar = () => {
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("Admin") === "true";
  const { sideBarOpen, setSideBarOpen, isTablet } = useContext(AppContext);
  const navigate = useNavigate();
  const sidebarRef = useRef();
  const { pathname } = useLocation();

  loadIcons([
  "mdi:report-multiple",
  "tdesign:catalog",
  "mynaui:cart-solid",
  "mdi:marketplace-outline",
  "material-symbols:order-approve-outline",
  "tabler:template", 
]);

  const [host, setHost] = useState(false);
  const [market, setMarket] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [vendorIdentifier, setVendorIdentifier] = useState(false);
  const [vendorEnrolled, setVendorEnrolled] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [allVendorEnrolled, setAllVendorEnrolled] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const isAssetsActive =
    pathname.includes("/layout/catalogue") ||
    pathname.includes("/layout/product") ||
    pathname.includes("/layout/listing");

  const isAdminActive =
    pathname.includes("/layout/teams") ||
    pathname.includes("/layout/teaminventory") ||
    pathname.includes("/layout/teamorders") ||
    pathname.includes("/layout/teamsaccounts") ||
    pathname.includes("/layout/customercare");

  const isMarketplaceFlow =
    pathname.includes("/layout/mymarket") ||
    pathname.includes("/layout/market");

  const isVendorActive =
    pathname.includes("/layout/editenrollment") ||
    pathname.includes("/layout/enrolment") ||
    pathname.includes("/layout/custom_vendors") ||
    pathname.includes("/layout/custom_vendor") ||
    pathname.includes("layout/editvendor");

  const isHelpActive =
    pathname.includes("/layout/help") ||
    pathname.includes("/layout/faqs") ||
    pathname.includes("/layout/support-ticket");

  const isOrdersActive =
    pathname.includes("/layout/order") ||
    pathname.includes("/layout/held_sku");

  const getVendorEnrolled = async () => {
    try {
      const data = await fetchVendorEnrolled();
      setAllVendorEnrolled(data);
    } catch (err) {
      if (err?.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/signin");
      }
    }
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  useEffect(() => {
    getVendorEnrolled();
    setHost(isAssetsActive);
    setAdminOpen(isAdminActive);
    setOrdersOpen(isOrdersActive);
    if (isHelpActive) setHelpOpen(true);
  }, [token, isAssetsActive, isAdminActive, isHelpActive, isOrdersActive]);

  useEffect(() => {
    setSideBarOpen(!isTablet);
  }, [isTablet, setSideBarOpen]);

  useEffect(() => {
    if (isTablet) setSideBarOpen(false);
  }, [pathname, isTablet, setSideBarOpen]);

  useEffect(() => {
    if (
      pathname.includes("/layout/catalogue") ||
      pathname.includes("/layout/product")
    ) {
      setHost(true);
    }

    if (isAdminActive) {
      setAdminOpen(true);
    }

    if (
      pathname.includes("/layout/order") ||
      pathname.includes("/layout/held_sku")
    ) {
      setOrdersOpen(true);
    }

    if (isHelpActive) setHelpOpen(true);
  }, [pathname, isAdminActive, isHelpActive]);

  const overlayClicked = () => setSideBarOpen(false);

  const toggleUp = () => {
    setHost((p) => !p);
    setMarket(false);
    setOrdersOpen(false);
    setAdminOpen(false);
    setHelpOpen(false);
  };

  const handleCloseDropdowns = () => {
    setMarket(false);
    setHost(false);
    setOrdersOpen(false);
    setVendorIdentifier(false);
    setVendorEnrolled(false);
    setAdminOpen(false);
    setHelpOpen(false);
  };

  const Nav_animation = isTablet
    ? {
        open: { x: 0, width: "13rem", transition: { damping: 40 } },
        closed: {
          x: -250,
          width: 0,
          transition: { damping: 40, delay: 0.15 },
        },
      }
    : {
        open: { width: "16rem", transition: { damping: 40 } },
        closed: { width: "4rem", transition: { damping: 40 } },
      };

  return (
    <div className="text-[#089451]">
      <div
        onClick={overlayClicked}
        className={`md:hidden fixed inset-0 max-h-screen z-[998] opacity-30 ${
          sideBarOpen ? "block" : "hidden"
        }`}
      />

      <motion.div
        ref={sidebarRef}
        variants={Nav_animation}
        initial={{ x: isTablet ? -250 : 0 }}
        animate={sideBarOpen ? "open" : "closed"}
        className="shadow-xl md:z-[9] z-[9999] max-w-[13rem] fixed top-0 left-0 pt-24 h-screen bg-white"
      >
        <div className="flex items-center gap-2.5 font-medium text-white lg:hidden mt-[-88px] block">
          <Link to="/">
            <img src={swift} alt="logo" />
          </Link>
        </div>

        <div className="flex flex-col text-4xl h-full overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white">
          <ul className="px-2.5 text-[0.9rem] py-5 flex flex-col gap-2">
            <li onClick={handleCloseDropdowns}>
              <NavLink to="/layout/home">
                {({ isActive }) => (
                  <div
                    className={`flex items-center gap-8 w-full px-2 hover:text-white ${
                      isActive ? "bg-[#027840] rounded-[6px] text-white" : ""
                    } hover:bg-[#027840] hover:rounded`}
                  >
                    <MdOutlineDashboard size={23} className="min-w-max" />
                    <span>Dashboard</span>
                  </div>
                )}
              </NavLink>
            </li>

            <li onClick={toggleUp}>
              <NavLink to="/layout/catalogue">
                {() => (
                  <div
                    className={`flex items-center gap-8 w-full px-2 hover:text-white ${
                      isAssetsActive
                        ? "bg-[#027840] rounded-[6px] text-white"
                        : ""
                    } hover:bg-[#027840] hover:rounded`}
                  >
                    <Icon icon="tdesign:catalog" width="23" height="23" />
                    <span>Assets</span>
                  </div>
                )}
              </NavLink>
            </li>

            <li className={`${host ? "block" : "hidden"} mt-1 space-y-1`}>
              <Link to="/layout/catalogue" onClick={handleCloseDropdowns}>
                <p
                  className={`${
                    pathname === "/layout/catalogue"
                      ? "text-[#089451] font-bold"
                      : "text-[#089451] opacity-[0.6]"
                  } hover:bg-[#027840] hover:text-white hover:rounded px-[3.9rem]`}
                >
                  Catalog
                </p>
              </Link>

              <Link to="/layout/product" onClick={handleCloseDropdowns}>
                <p
                  className={`${
                    pathname === "/layout/product"
                      ? "text-[#089451] font-bold"
                      : "text-[#089451] opacity-[0.6]"
                  } hover:bg-[#027840] hover:text-white hover:rounded px-[3.9rem]`}
                >
                  Product
                </p>
              </Link>
            </li>

            <li
              onClick={() => {
                setMarket((p) => !p);
                setHost(false);
                setOrdersOpen(false);
                setAdminOpen(false);
                setHelpOpen(false);
              }}
            >
              <NavLink to="/layout/inventory">
                {({ isActive }) => (
                  <div
                    className={`flex items-center gap-8 w-full px-2 hover:text-white ${
                      isActive || pathname.includes("/layout/log")
                        ? "bg-[#027840] rounded-[6px] text-white"
                        : ""
                    } hover:bg-[#027840] hover:rounded`}
                  >
                    <MdOutlineInventory2 size={23} className="min-w-max" />
                    <span>Inventory</span>
                  </div>
                )}
              </NavLink>
            </li>

            <li className={`${market ? "block" : "hidden"} mt-1`}>
              <NavLink to="/layout/log">
                <p
                  className={`${
                    pathname === "/layout/log"
                      ? "text-[#089451] font-bold"
                      : "text-[#089451] opacity-[0.6]"
                  } hover:bg-[#027840] hover:text-white hover:rounded ps-[1.5rem] flex items-center justify-center`}
                >
                  Inventory log
                </p>
              </NavLink>
            </li>

            <li onClick={handleCloseDropdowns}>
              <Link to="/layout/mymarket">
                <div
                  className={`flex items-center gap-8 w-full px-2 hover:text-white ${
                    isMarketplaceFlow
                      ? "bg-[#027840] rounded-[6px] text-white"
                      : ""
                  } hover:bg-[#027840] hover:rounded`}
                >
                  <Icon icon="mdi:marketplace-outline" width="23" height="23" />
                  <span>Marketplace</span>
                </div>
              </Link>
            </li>

            <li onClick={handleCloseDropdowns}>
              <NavLink to="/layout/editenrollment">
                {() => (
                  <div
                    className={`flex items-center gap-8 w-full px-2 hover:text-white ${
                      isVendorActive
                        ? "bg-[#027840] rounded-[6px] text-white"
                        : ""
                    } hover:bg-[#027840] hover:rounded`}
                  >
                    <Icon icon="mynaui:cart-solid" width="23" height="23" />
                    <span>Vendors</span>
                  </div>
                )}
              </NavLink>
            </li>
                <li onClick={handleCloseDropdowns}>
              <NavLink to="/layout/templates">
                {({ isActive }) => (
                  <div
                    className={`flex items-center gap-8 w-full px-2 hover:text-white ${
                      isActive ? "bg-[#027840] rounded-[6px] text-white" : ""
                    } hover:bg-[#027840] hover:rounded`}
                  >
                    <Icon icon="tabler:template" width="23" height="23" />
                    <span>Templates</span>
                  </div>
                )}
              </NavLink>
            </li>
            <li
              onClick={() => {
                setOrdersOpen((p) => !p);
                setHost(false);
                setMarket(false);
                setAdminOpen(false);
                setHelpOpen(false);
              }}
            >
              <NavLink to="/layout/order">
                {({ isActive }) => (
                  <div
                    className={`flex items-center gap-8 w-full px-2 hover:text-white ${
                      isActive || pathname.includes("/layout/held_sku")
                        ? "bg-[#027840] rounded-[6px] text-white"
                        : ""
                    } hover:bg-[#027840] hover:rounded`}
                  >
                    <Icon
                      icon="material-symbols:order-approve-outline"
                      width="23"
                      height="23"
                    />
                    <span>Orders</span>
                  </div>
                )}
              </NavLink>
            </li>

            <li className={`${ordersOpen ? "block" : "hidden"} mt-1`}>
              <NavLink to="/layout/held_sku">
                <p
                  className={`${
                    pathname === "/layout/held_sku"
                      ? "text-[#089451] font-bold"
                      : "text-[#089451] opacity-[0.6]"
                  } hover:bg-[#027840] hover:text-white hover:rounded px-[3.9rem]`}
                >
                  Hold SKU
                </p>
              </NavLink>
            </li>

            <li onClick={handleCloseDropdowns}>
              <NavLink to="/layout/report">
                {({ isActive }) => (
                  <div
                    className={`flex items-center gap-8 w-full px-2 hover:text-white ${
                      isActive ? "bg-[#027840] rounded-[6px] text-white" : ""
                    } hover:bg-[#027840] hover:rounded`}
                  >
                    <Icon icon="mdi:report-multiple" width="23" height="23" />
                    <span>Reports</span>
                  </div>
                )}
              </NavLink>
            </li>

            <li
              onClick={() => {
                setHelpOpen((p) => !p);
              }}
            >
              <NavLink to="/layout/help">
                {({ isActive }) => (
                  <div
                    className={`flex items-center gap-8 w-full px-2 hover:text-white ${
                      isHelpActive || isActive
                        ? "bg-[#027840] rounded-[6px] text-white"
                        : ""
                    } hover:bg-[#027840] hover:rounded`}
                  >
                    <IoMdHelpCircleOutline size={23} className="min-w-max" />
                    <span>Help</span>
                  </div>
                )}
              </NavLink>
            </li>

            <li className={`${helpOpen ? "block" : "hidden"} mt-1 space-y-1`}>
              <NavLink to="/layout/faqs" onClick={handleCloseDropdowns}>
                <p
                  className={`${
                    pathname === "/layout/faqs"
                      ? "text-[#089451] font-bold"
                      : "text-[#089451] opacity-[0.6]"
                  } hover:bg-[#027840] hover:text-white hover:rounded px-[3.9rem]`}
                >
                  FAQs
                </p>
              </NavLink>

              <NavLink
                to="/layout/support-ticket"
                onClick={handleCloseDropdowns}
              >
                <p
                  className={`${
                    pathname === "/layout/support-ticket"
                      ? "text-[#089451] font-bold text-center"
                      : "text-[#089451] opacity-[0.6] text-center"
                  } hover:bg-[#027840] hover:text-white hover:rounded px-[1rem]`}
                >
                  Support Ticket
                </p>
              </NavLink>
            </li>

            <li>
              <NavLink
                onClick={(e) => {
                  e.preventDefault();
                  openModal();
                }}
              >
                <div className="flex items-center gap-8 w-full px-2 hover:bg-[#027840] hover:rounded hover:text-white">
                  <LiaSignOutAltSolid size={23} className="min-w-max" />
                  <span>Sign Out</span>
                </div>
              </NavLink>
            </li>
          </ul>

          <SignOutButton
            openModal={openModal}
            closeModal={closeModal}
            isOpen={isOpen}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Sidebar;
