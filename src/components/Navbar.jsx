import React, { useEffect, useRef, useState } from 'react';
import logo from '../Images/mainlogo.svg';
import { FaBars } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ openToggle }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const resourcesRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (resourcesRef.current && !resourcesRef.current.contains(e.target)) {
        setResourcesOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const handler = ({ key }) => {
      if (key === 'Escape') {
        setMobileOpen(false);
        setResourcesOpen(false);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // ✅ LOCALSTORAGE TOKEN CHECK (ONLY CHANGE)
  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
    };

    checkToken();
  }, [location.pathname]);

  useEffect(() => {
    const handleStorage = () => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const hiddenRoutes = [
    '/layout/home', '/layout/catalogue', '/layout/product', '/layout/allapp',
    '/layout/enrolment', '/layout/inventory', '/layout/market', '/layout/editvendor',
    '/layout/selectedproduct', '/layout/ebay', '/layout/listing', '/layout/order',
    '/layout/editenrollment', '/layout/success', '/layout/orderdetails', '/layout/addnewvendor',
    '/layout/newvendordetails', '/layout/mymarket', '/layout/myaccount',
    '/chooseplan/paymentsuccessful', '/chooseplan/paymentfailed',
    '/layout/invite-success', '/layout/payment-history', '/layout/settings',
    '/layout/members-activities', '/layout/teams', '/layout/teamorders',
    '/layout/teaminventory', '/layout/teamsaccounts', '/layout/custom_vendor_integration',
    '/layout/custom_vendor', '/layout/custom_vendors', '/layout/support-ticket', '/layout/faqs',
    '/layout/report', '/layout/help', '/vendors/payment-success', '/marketplace/success',
    '/vendor/success-file', '/invite-success', '/vendor/success-enrolment', '/admin_layout', '/layout/log',
  ];

  const isHidden = hiddenRoutes.some(route => location.pathname.startsWith(route));
  if (isHidden) return null;

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <nav
        className={`sticky top-0 z-[1000] w-full md:px-5 transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-[#027840]/10'
            : 'bg-white border-b border-gray-100 shadow-sm'
        }`}
      >
        <div className="w-full px-4 sm:px-6 flex items-center justify-between h-[72px] gap-4">

          <Link to="/" className="flex-shrink-0">
            <img src={logo} alt="Logo" className="w-[160px] h-[72px] object-contain" />
          </Link>

          <ul className="hidden lg:flex items-center gap-1 list-none m-0 p-0">
            <li>
              <Link to="/" className="relative inline-flex items-center px-4 py-2 rounded-lg text-[14.5px] font-medium text-gray-700 hover:text-[#027840] hover:bg-[#027840]/5 transition-all duration-200 group">
                Home
                <span className="absolute bottom-[5px] left-4 right-4 h-0.5 bg-[#027840] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
              </Link>
            </li>

            <li>
              <Link to="/pricing" className="relative inline-flex items-center px-4 py-2 rounded-lg text-[14.5px] font-medium text-gray-700 hover:text-[#027840] hover:bg-[#027840]/5 transition-all duration-200 group">
                Pricing
                <span className="absolute bottom-[5px] left-4 right-4 h-0.5 bg-[#027840] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
              </Link>
            </li>

            <li ref={resourcesRef} className="relative">
              <button
                onClick={() => setResourcesOpen(p => !p)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[14.5px] font-medium transition-all duration-200 ${
                  resourcesOpen
                    ? 'text-[#027840] bg-[#027840]/5'
                    : 'text-gray-700 hover:text-[#027840] hover:bg-[#027840]/5'
                }`}
              >
                Resources
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    resourcesOpen ? 'rotate-180 text-[#027840]' : 'text-gray-400'
                  }`}
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              <div className={`absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-52 bg-white rounded-2xl shadow-xl shadow-black/10 border border-gray-100 p-1.5 origin-top transition-all duration-200 ${
                resourcesOpen
                  ? 'opacity-100 visible scale-100 translate-y-0'
                  : 'opacity-0 invisible scale-95 -translate-y-1 pointer-events-none'
              }`}>
                <div className="absolute -top-[5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white border-l border-t border-gray-100 rotate-45 rounded-sm" />

                {[
                  { to: '/blog', emoji: '✍️', label: 'Blog' },
                  { to: '/faqs', emoji: '💡', label: 'FAQs' },
                  { to: '/contact-us', emoji: '💬', label: 'Contact Us' },
                ].map(({ to, emoji, label }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setResourcesOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13.5px] font-medium text-gray-700 hover:bg-[#027840]/5 hover:text-[#027840] transition-all duration-150 group"
                  >
                    <span className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center text-sm group-hover:bg-[#027840]/10 transition-colors flex-shrink-0">
                      {emoji}
                    </span>
                    {label}
                  </Link>
                ))}
              </div>
            </li>

            <li>
              <Link to="/aboutus" className="relative inline-flex items-center px-4 py-2 rounded-lg text-[14.5px] font-medium text-gray-700 hover:text-[#027840] hover:bg-[#027840]/5 transition-all duration-200 group">
                About Us
                <span className="absolute bottom-[5px] left-4 right-4 h-0.5 bg-[#027840] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
              </Link>
            </li>
          </ul>

          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            {isAuthenticated === null ? null : isAuthenticated ? (
              <Link
                to="/layout/home"
                className="inline-flex items-center gap-2 h-9 px-5 rounded-lg text-sm font-semibold text-white bg-gradient-to-br from-[#027840] to-[#066b3b] shadow-md shadow-[#027840]/25 hover:shadow-lg hover:shadow-[#027840]/35 hover:-translate-y-px transition-all duration-200"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center gap-1.5 h-9 px-5 rounded-lg text-sm font-semibold text-white bg-gradient-to-br from-[#027840] to-[#066b3b] shadow-md shadow-[#027840]/25 hover:shadow-lg hover:shadow-[#027840]/35 hover:-translate-y-px transition-all duration-200"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/signin"
                  className="inline-flex items-center justify-center h-9 px-16 rounded-lg text-sm font-semibold text-[#027840] border border-[#027840]/30 hover:border-[#027840] hover:bg-[#027840]/5 transition-all duration-200"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl border border-[#027840]/25 bg-white hover:bg-[#027840]/5 hover:border-[#027840]/50 transition-all duration-200"
          >
            <FaBars className="text-[#027840] w-4 h-4" />
          </button>
        </div>
      </nav>

      <div
        onClick={closeMobile}
        aria-hidden="true"
        className={`fixed inset-0 z-[998] bg-black/40 backdrop-blur-sm lg:hidden transition-all duration-300 ${
          mobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      />

      {/* ✅ MOBILE SECTION COMPLETELY UNTOUCHED */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed top-0 right-0 bottom-0 z-[999] w-[min(320px,88vw)] bg-white flex flex-col shadow-2xl lg:hidden transition-transform duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-shrink-0">
          <Link to="/" onClick={closeMobile}>
            <img src={logo} alt="Logo" className="w-[140px] h-[58px] object-contain" />
          </Link>

          <button
            type="button"
            onClick={closeMobile}
            className="flex items-center justify-center w-9 h-9 rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-all duration-200"
          >
            <IoMdClose size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pt-4 pb-2">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-1.5">
            Navigation
          </p>

          {[{ to: '/', label: 'Home' }, { to: '/pricing', label: 'Pricing' }, { to: '/aboutus', label: 'About Us' }].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={closeMobile}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-[15px] font-medium text-gray-700 hover:bg-[#027840]/5 hover:text-[#027840] transition-all duration-150 mb-0.5 group"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-[#027840]" />
              {label}
            </Link>
          ))}

          <div className="h-px bg-gray-100 my-3 mx-2" />

          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-1.5">
            Resources
          </p>

          {[{ to: '/blog', emoji: '✍️', label: 'Blog' }, { to: '/faqs', emoji: '💡', label: 'FAQs' }, { to: '/contact-us', emoji: '💬', label: 'Contact Us' }].map(({ to, emoji, label }) => (
            <Link
              key={to}
              to={to}
              onClick={closeMobile}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-[15px] font-medium text-gray-700 hover:bg-[#027840]/5 hover:text-[#027840] transition-all duration-150 mb-0.5 group"
            >
              <span className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center text-sm group-hover:bg-[#027840]/10">
                {emoji}
              </span>
              {label}
            </Link>
          ))}
        </div>

        <div className="px-4 py-5 border-t border-gray-100 flex flex-col gap-2.5 flex-shrink-0">
          {isAuthenticated === null ? null : isAuthenticated ? (
            <Link
              to="/layout/home"
              onClick={closeMobile}
              className="flex items-center justify-center gap-2 h-11 rounded-xl text-[15px] font-semibold text-white bg-gradient-to-br from-[#027840] to-[#066b3b] shadow-md shadow-[#027840]/25 transition-all duration-200"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/signup"
                onClick={closeMobile}
                className="flex items-center justify-center h-11 rounded-xl text-[15px] font-semibold text-white bg-gradient-to-br from-[#027840] to-[#066b3b] shadow-md shadow-[#027840]/25 transition-all duration-200"
              >
                Get Started For Free
              </Link>
              <Link
                to="/signin"
                onClick={closeMobile}
                className="flex items-center justify-center h-11 rounded-xl text-[15px] font-semibold text-[#027840] border border-[#027840]/30 hover:bg-[#027840]/5 transition-all duration-200"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;