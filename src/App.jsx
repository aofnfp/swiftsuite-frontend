import { Route, Routes } from 'react-router-dom';
import Rootlayout from './layout/Rootlayout';
import ScrollToTop from './layout/ScrollToTop';
import SignUp from './pages/SignUp';
import ErrorPage from './pages/Errorpage';
import ForgotPassword from './pages/ForgotPassword';
import Signin from './pages/Signin';
import Reset from './pages/Reset';
import Landingpage from './landingpage/Landingpage';
import Regsuccess from './pages/Regsuccess';
import PassSuccess from './pages/PassSuccess';
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Auth from './pages/Auth';
import Api from './Vendorenrolment/Api';
import StateAPi from './Vendorenrolment/StateAPi';
import ProductDetails from './cataloguedetails/ProductDetails';
import EditEnrollment from './EditVendorFile/EditEnrollment';
import CheckboxSelect from './pages/CheckboxSelect';
import Foot from './landingpage/Foot';
import ChoosePlan from './UserAdmin/ChoosePlan';
import PaymentSuccessful from './UserAdmin/PaymentSuccessful';
import PaymentFailed from './UserAdmin/PaymentFailed';
import PricingDetails from './UserAdmin/PricingDetails';
import AboutUs from './pages/AboutUs';
import Faqs from './UserAdmin/Faqs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import ContactUs from './pages/ContactUs';
import Blog from './pages/Blog';
import SuccessThanks from './CustomVendors/SuccessThanks';
import SuccessMarketplace from './MarketEnrollment/SuccessMarketplace';
import Thank from './EditVendorFile/Thank';
import SuccessInvite from './UserAdmin/SuccessInvite';
import ThankSuccessPage from './Vendorenrolment/ThankSuccessPage';
import ParentAdmin from './Admin/ParentAdmin';
import Dashboard from './Admin/Dashboard';
import UsersAdmin from './Admin/UsersAdmin';
import Finance from './Admin/Finance';
import ReportAnalytics from './Admin/ReportAnalytics';
import AdminManagement from './Admin/AdminManagement';
import AdminNotification from './Admin/AdminNotification';
import AdminSupport from './Admin/AdminSupport';
import AdminSettings from './Admin/AdminSettings';
import NewVendorInfoMain from './Admin/NewVendorInfoMain';
import AddNewVendor2 from './Admin/AddNewVendor2';
import AdminVendorSuccess from './Admin/AdminVendorSucess';
import AdminManageSubscription from './Admin/AdminManageSubscription';
import { Toaster } from "sonner";
import ListingTemplateBuilder from './pages/ListingTemplateBuilder';



function App() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleIsOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen font-[Roboto]">
      <Toaster position="top-right" richColors />
      <Navbar openToggle={toggleIsOpen} />

  
      <main className="flex-grow">
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Landingpage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/layout/*" element={<Rootlayout />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route
            path="/accounts/password_reset_confirm/:uidb64/:token"
            element={<Reset />}
          />
          <Route path="/success" element={<Regsuccess />} />
          <Route path="/listing-template-builder" element={<ListingTemplateBuilder />} />
          <Route path="/passreg" element={<PassSuccess />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/api" element={<Api />} /> 
          <Route path="/state" element={<StateAPi />} />
          <Route path="*" element={<ErrorPage />} />
          <Route path="/edit" element={<ProductDetails />} />
          <Route path="/editenrollment" element={<EditEnrollment />} />
          <Route path="/check" element={<CheckboxSelect />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/pricing" element={<ChoosePlan />} />
          <Route path="/chooseplan/paymentsuccessful" element={<PaymentSuccessful />} />
          <Route path="/chooseplan/paymentfailed" element={<PaymentFailed />} />
          <Route path="/pricing-details" element={<PricingDetails />} />
          <Route path="/faqs" element={<Faqs />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy/>} />
          <Route path="/terms_of_service"  element={<TermsOfService/>} />
          <Route path="/contact-us"  element={<ContactUs/>} />
          <Route path="/blog"   element={<Blog/>} />
          <Route path="/vendors/payment-success" element={<SuccessThanks/>} />
          <Route path="/marketplace/success" element={<SuccessMarketplace/>} />
          <Route path="/vendor/success-file" element={<Thank/>} />
          <Route path="/vendor/success-enrolment" element={<ThankSuccessPage/>} />
          <Route path="/invite-success" element={<SuccessInvite/>} />
          <Route path="/admin_layout" element={<ParentAdmin />}>
          <Route index element={<Dashboard />} />
          <Route path="finance" element={<Finance/>} />
          <Route path="users" element={<UsersAdmin/>} />
          <Route path="report_analytics" element={<ReportAnalytics/>} />
          <Route path="management" element={<AdminManagement/>} />
          <Route path="notification" element={<AdminNotification/>} />
          <Route path='vendor'  element={<AddNewVendor2/>} />
          <Route path="newvendor"  element={<NewVendorInfoMain/>} />
          <Route path="support" element={<AdminSupport/>} />
          <Route path="settings"  element={<AdminSettings/>} />
          <Route path="/admin_layout/manage-subscription" element={<AdminManageSubscription/>} />
          </Route>
          <Route path="/admin_layout/success-vendor-data-pull" element={<AdminVendorSuccess/>} />
        </Routes>
      </main>
      <Foot />
    </div>
  );
}

export default App;
