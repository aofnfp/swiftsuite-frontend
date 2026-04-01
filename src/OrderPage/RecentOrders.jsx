import { useState } from "react";
import {Phone, Mail } from "lucide-react";
import { FaAddressCard } from "react-icons/fa";
import { Avatar } from "@heroui/react";


const RecentOrders = ({ data = []}) => {

const orderId = data?.orderId;
const buyerAddress = data?.buyer?.buyerRegistrationAddress || {};
const contactAddress = data?.buyer?.buyerRegistrationAddress?.contactAddress;

   const receiver = {
    name: buyerAddress?.fullName,
    address: contactAddress?.addressLine1,
    email: buyerAddress.email,
    phone: buyerAddress?.primaryPhone?.phoneNumber,
  };


  return (
    <div className="">
      <div className="px-5 pt-5 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
        <div className=" font-bold text-[#005D68] tracking-widest uppercase mb-4">Customer</div>
        <div className=" font-bold text-[#005D68] tracking-widest uppercase mb-4">{`Order #${orderId}`}</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            {data.avatar ? (
              <img src={receiver?.name} alt={receiver?.name} className="w-11 h-11 rounded-full bg-gradient-to-br from-[#005D68]/20 to-[#005D68]/10 flex items-center justify-center ring-2 ring-[#005D68]/15" />
            ) : (
              <div>
               <Avatar showFallback src="https://images.unsplash.com/broken" />
               </div>
            )}
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-800 leading-tight">{receiver?.name}</div>
            <div className="text-[11px] text-gray-400 mt-0.5">Verified buyer</div>
          </div>
        </div>
      </div>
      {/* Contact Info */}
      <div className="px-5 py-4">
        <div className="text-xs font-bold text-gray-800 tracking-widest uppercase mb-3">Contact Info</div>
        <div className="space-y-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#005D68]/8 flex items-center justify-center flex-shrink-0" style={{backgroundColor: 'rgba(0,93,104,0.08)'}}>
              <FaAddressCard size={12} className="text-[#005D68]" />
            </div>
            <span className="text-sm text-gray-700">{receiver?.address}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#005D68]/8 flex items-center justify-center flex-shrink-0" style={{backgroundColor: 'rgba(0,93,104,0.08)'}}>
              <Phone size={12} className="text-[#005D68]" />
            </div>
            <span className="text-sm text-gray-700">{receiver?.phone}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{backgroundColor: 'rgba(0,93,104,0.08)'}}>
              <Mail size={12} className="text-[#005D68]" />
            </div>
            <span className="text-sm text-gray-700 truncate">{receiver?.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecentOrders;