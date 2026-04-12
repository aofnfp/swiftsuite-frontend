import React, { useContext } from 'react';
import { AppContext } from '../context/Dashboard';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Sidebar from '../Side/Sidebar';
import Header from '../Nav/Header';
import Product from '../cataloguedetails/Product';
import Enrolment from '../Vendorenrolment/Enrolment';
import Catalogue from '../cataloguedetails/Catalogue';
import Inventory from '../inventory/Inventory';
import Selectedproduct from '../SelectedProduct/Selectedproduct';
import Ebay from '../MarketEnrollment/Ebaydata/Ebay';
import Order from '../OrderPage/Order';
import OrderDetails from '../OrderPage/OrderDetails';
import Listing from '../cataloguedetails/ProductListing/Listing';
import EditEnrollment from '../EditVendorFile/EditEnrollment';
import VendorEdit from '../EditVendorFile/VendorEdit';
import Success from '../MarketEnrollment/SuccessMarketplace';
import AddNewVendor from '../Admin/AddNewVendor';
import NewVendorInfoMain from '../Admin/NewVendorInfoMain';
import Help from '../pages/Help/Help';
import ScrollToTop from './ScrollToTop';
import MyMarket from '../MarketEnrollment/MyMarket';
import MarketParent from '../MarketEnrollment/MarketParent';
import AccountFile from '../UserAdmin/AccountFile';
import InventoryDetail from '../inventory/InventoryDetail';
import SuccessInvite from '../UserAdmin/SuccessInvite';
import PaymentHistory from '../UserAdmin/PaymentHistory';
import Parent from '../settings/Parent';
import MemberActivities from '../UserAdmin/MemberActivities';
import TeamsManage from '../UserAdmin/TeamsManage';
import CustomerCare from '../UserAdmin/CustomerCare';
import InviteMembers from '../UserAdmin/InviteMembers';
import TeamsReminder from '../UserAdmin/TeamsReminder';
import CustomIntegration from '../CustomVendors/CustomIntegration';
import CustomVendorIntegrations from '../CustomVendors/CustomVendorIntegrations';
import InventoryReport from '../pages/Report/InventoryReport';
import OrderReport from '../pages/Report/OrderReport';
import Report from '../pages/Report/Report';
import SalesReport from '../pages/Report/SalesReport';
import CustomVendorInfo from '../CustomVendors/CustomVendorInfo';
import SuccessThanks from '../CustomVendors/SuccessThanks';
import SupportTicket from '../Help/SupportTicket';
import Faqs from '../Help/Faqs';
import InventoryLog from '../inventory/log/InventoryLog';
import HeldSKU from '../OrderPage/HeldSKU';


const Rootlayout = ({ children }) => {
  const { sideBarOpen } = useContext(AppContext);
  const location = useLocation();

  
const noPaddingPaths = ['/layout/settings', '/layout/help', '/layout/custom_success', '/layout/report'];
const noPadding = noPaddingPaths.includes(location.pathname);


const newBgPaths = ['/layout/report', '/layout/help', '/layout/support-ticket', '/layout/faqs']; 
const bgClass = newBgPaths.includes(location.pathname) ? 'bg-[#f2f2f2]' : 'bg-[#E7F2ED]';


  return (
    <div className={`min-h-screen flex flex-col ${bgClass}` }>
      <Header />
      <div className="flex flex-1 overflow-hidden h-screen">
        <Sidebar />
        <div
          id="scrollable-content"
          className={`flex-1 transition-all duration-200 ease-in-out h-screen overflow-y-auto pt-8 ${
            noPadding ? '' : 'px-4'
          } ${sideBarOpen ? 'md:ml-52' : 'md:ml-16'}`}
        >
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<AccountFile />} />
            <Route path="/product" element={<Product />} />
            <Route path="/catalogue" element={<Catalogue />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/log" element={<InventoryLog />} />
            <Route path="/enrolment" element={<Enrolment />} />
            <Route path="/market" element={<MarketParent />} />
            <Route path="/success" element={<Success />} />
            <Route path="/selectedproduct" element={<Selectedproduct />} />
            <Route path="/ebay" element={<Ebay />} />
            <Route path="/listing/:productId" element={<Listing />} />
            <Route path="/order" element={<Order />} />
            <Route path="/orderdetails/:orderDetail" element={<OrderDetails />} />
            <Route path="/inventory/:inventoryDetail" element={<InventoryDetail />} />
            <Route path="/editenrollment" element={<EditEnrollment />} />
            <Route path="/editvendor" element={<VendorEdit />} />
            <Route path="/addnewvendor" element={<AddNewVendor />} />
            <Route path="/newvendordetails" element={<NewVendorInfoMain />} />
            <Route path="/help" element={<Help />} />
            <Route path="/mymarket" element={<MyMarket />} />
            <Route path="/myaccount" element={<AccountFile />} />
            <Route path="/invite-success" element={<SuccessInvite />} />
            <Route path="/payment-history" element={<PaymentHistory />} />
            <Route path="/settings" element={<Parent />} />
            <Route path='/members-activities' element={<MemberActivities/>} />
            <Route path="/home/team" element={<TeamsManage />} />
            <Route path="/home/invite" element={<InviteMembers />} />
            <Route path="/home/reminder" element={<TeamsReminder />} />
            <Route path="custom_vendor_integration" element={<CustomIntegration/>} />
            <Route path="custom_vendor" element={<CustomVendorIntegrations />} />
            <Route path="customercare" element={<CustomerCare />} />
            <Route path="/report" element={<Report />} />
            <Route path="/report/sales" element={<SalesReport />} />
            <Route path="/report/inventory" element={<InventoryReport />} />
            <Route path="/report/order" element={<OrderReport />} />
            <Route path="custom_vendors"  element={<CustomVendorInfo/>} />
            <Route path="/faqs" element={<Faqs/>} />
            <Route path='/support-ticket' element={<SupportTicket/>} />
            <Route path="/held_sku" element={<HeldSKU/>} />
          </Routes>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Rootlayout;
