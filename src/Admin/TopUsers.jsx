import React from "react";
import Fx from "../Images/Fx.png"
import Amazon from "../Images/amazon.png"
import Rsr from "../Images/vendortwo.png"
import Lipsey from "../Images/Lipsey.png"
import Zanders from "../Images/zanders.png"
import Ebay from "../Images/ebay.png"
import Woo from "../Images/woo.png"
import Walmart from "../Images/walmart.png"

const TopUsers = () => {
  
  const users = [
    {
      name: "John Doe",
      email: "john@example.com",
      plan: "Premium",
      listing: 87,
      popularVendor: Fx,
      popularMarketplace: Amazon,
      sales: "$5,090",
    },
    {
      name: "Jane Smith",
      email: "jane@example.com",
      plan: "Premium",
      listing: 61,
      popularVendor: Rsr,
      popularMarketplace: Ebay,
      sales: "$300",
    },
    {
      name: "Adeniyi Ibrahim",
      email: "biodun@example.com",
      plan: "Starter",
      listing: 23,
      popularVendor: Lipsey,
      popularMarketplace: Woo,
      sales: "$5600",
    },
    {
      name: "Janet Rafael",
      email: "janeraf@example.com",
      plan: "Growth",
      listing: 11,
      popularVendor: Zanders,
      popularMarketplace: Ebay,
      sales: "$200",
    },
    {
      name: "Abraham Oladotun",
      email: "abraham@example.com",
      plan: "Starter",
      listing: 10,
      popularVendor: Rsr,
      popularMarketplace: Walmart,
      sales: "$3,200",
    },
  ];

  return (
    <div className="">
      <h2 className="text-xl font-bold mb-4">Top Users</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border bg-white rounded-[13px] border-gray-300 font-semibold">
          <thead className="bg-[#027840] text-[#FFFFFF] ">
            <tr>
              <th className=" px-4 py-2 text-left">Name</th>
              <th className=" px-4 py-2 text-left">Email</th>
              <th className=" px-4 py-2 text-left">Plan</th>
              <th className=" px-4 py-2 text-left">Listing</th>
              <th className=" px-4 py-2 text-left">Popular Vendor</th>
              <th className=" px-4 py-2 text-left">Popular Marketplace</th>
              <th className=" px-4 py-2 text-left">Sales</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border-b px-4 py-2">{user.name}</td>
                <td className="border-b px-4 py-2">{user.email}</td>
                <td className="border-b px-4 py-2">{user.plan}</td>
                <td className="border-b px-4 py-2">{user.listing}</td>
                <td className="border-b px-4 py-2">
                  <img
                    src={user.popularVendor}
                    alt="Vendor Logo"
                    className="h-6 w-16 object-contain"
                  />
                </td>
                <td className="border-b px-4 py-2">
                  <img
                    src={user.popularMarketplace}
                    alt="Marketplace Logo"
                    className="h-6 w-16 object-contain"
                  />
                </td>
                <td className="border-b px-4 py-2">{user.sales}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopUsers;
