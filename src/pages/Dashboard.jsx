import React from "react";
import Revenue from "../components/Revenue";
import Newcustomer from "../Customers/Newcustomer.jsx";
import Retargetcustomer from "../Customers/Retargetcustomer.jsx";
import Targetcustomer from "../Customers/Targetcustomer.jsx";
import Overview from "../components/Overview.jsx";
import Topproduct from "../Customers/Topproduct.jsx";
import Currentcustomer from "../Customers/Currentcustomer.jsx";
import MarketVendors from "../Marketplaces/MarketVendors.jsx";
import Addmarketplaces from "../Marketplaces/Addmarketplaces.jsx";

const Dashboard = () => {

  return (
    <>
      <section className="md:mt-10 md:mx-5 mx-2 my-20 " >
        <div className="grid grid-cols-12 gap-5 lg:py-10 my-5">
          <div className="grid grid-cols-1 lg:col-span-7 col-span-12 rounded-lg shadow-lg  ">
            <Revenue />
          </div>
          <div className="lg:col-span-5 col-span-12 grid rounded-lg bg-white shadow-lg py-5 ">
              <div className="mx-5">
              <h1 className="font-bold">Customers</h1>
              <p >Information about your Customers</p>
              </div>
              <div className="grid grid-cols-2 px-5 gap-10">

            <div>
              <Currentcustomer />
              <h3 className="text-center text-sm font-bold">
                Current Customers
              </h3>
            </div>
            <div>
              <Newcustomer />
              <h3 className="text-center text-sm font-bold">New Customers</h3>
            </div>
            <div>
              <Targetcustomer />
              <h3 className="text-center text-sm font-bold">
                Target Customers
              </h3>
            </div>
            <div>
              <Retargetcustomer />
              <h3 className="text-center text-sm font-bold">
                Retarget Customers
              </h3>
            </div>
          </div>
        </div>
              </div>
        <div className="grid   grid-cols-12 gap-5">
          <div className="lg:col-span-7 col-span-12">
            <Topproduct />
          </div>
          <div className="lg:col-span-5 col-span-12">
            <Overview />
          </div>
        </div>
        {/* <div className="">
         <Addmarketplaces/>
          <MarketVendors />
        </div> */}
      </section>
    </>
  );
};

export default Dashboard;
