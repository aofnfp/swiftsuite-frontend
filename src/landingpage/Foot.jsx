import React from 'react';
import logo from '../Images/mainlogo.svg';
import { Link, useLocation } from 'react-router-dom';
import Footer from './Footer';

const Foot = () => {
  const location = useLocation();

  
  const hiddenRoutes = [
    '/layout/home',
    '/success',
    '/passreg',
    '/layout/catalogue',
    '/layout/report',
    '/layout/help',
    '/layout/templates',
    '/layout/product',
    '/layout/allapp',
    '/layout/enrolment',
    '/layout/inventory',
    '/layout/market',
    '/layout/mymarket',
    '/layout/editvendor',
    '/layout/ebay',
    '/layout/listing',
    '/layout/order',
    '/layout/editenrollment',
    '/layout/success',
    '/layout/orderdetails',
    '/layout/myaccount',
    '/chooseplan/paymentsuccessful',
    '/chooseplan/paymentfailed',
    '/layout/invite-success',
    '/layout/payment-history',
    '/layout/settings',
    '/layout/members-activities',
    '/layout/customercare',
    '/layout/teams',
    '/layout/teamorders',
    '/layout/teamaccounts',
    '/layout/teaminventory',
    '/layout/custom_vendor_integration',
    '/layout/custom_vendor',
    '/layout/support-ticket',
    '/layout/faqs',
    '/layout/custom_vendors',
    '/vendors/payment-success',
    '/marketplace/success',
    '/vendor/success-file',
    '/invite-success',
    '/vendor/success-enrolment',
    '/admin_layout',
    '/layout/log',
    '/layout/held_sku'
  ];

  const isHidden = hiddenRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  if (isHidden) return null;

  return (
    <footer className="mt-auto bg-[#A2D9BF33] border-t">
      <div className="py-10 px-6 md:px-10 lg:px-16">
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-[10%] lg:justify-center">
          
          {/* Logo section */}
          <div className="mb-8 lg:mb-0">
            <img
              src={logo}
              alt="Company Logo"
              className="w-[196px] h-[88.2px]"
            />
          </div>

          {/* Grid Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full lg:max-w-3xl">
            
            {/* Company column */}
            <div>
              <h3 className="font-bold text-base mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/faqs" className="hover:text-green-700">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link to="/aboutus" className="hover:text-green-700">
                    About
                  </Link>
                </li>
              </ul>
            </div>

            {/* Help column */}
            <div>
              <h3 className="font-bold text-base mb-4">Help</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-green-700">
                    Chat with us
                  </a>
                </li>
                <li>
                  <Link to="/contact-us" className="hover:text-green-700">
                    Contact us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal column */}
            <div>
              <h3 className="font-bold text-base mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/privacy-policy" className="hover:text-green-700">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms_of_service" className="hover:text-green-700">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom footer bar */}
      <Footer />
    </footer>
  );
};

export default Foot;
