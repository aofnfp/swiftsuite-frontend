import React from 'react';
import { MdOutlinePersonOutline } from 'react-icons/md';
import { CiShoppingCart } from 'react-icons/ci';
import { IoBagHandleOutline } from 'react-icons/io5';
import { TbBorderNone } from 'react-icons/tb';
import bag from '../assets/bag.png';
import puma from '../assets/puma.png';

const StatsCard = ({ icon, label, value, bg }) => (
  <div className={`text-center rounded-lg p-3 w-full text-white text-sm ${bg}`}>
    <div className="flex justify-center mb-1">{icon}</div>
    <p>{label}</p>
    <p className="font-bold">{value}</p>
  </div>
);

const ProductCard = ({ image, name, orders, inventory, sale, price, total }) => (
  <div className="flex flex-wrap items-center gap-4 bg-gray-300 mt-4 p-4 rounded-lg">
    <img src={image} alt={name} className="w-16 h-16 object-contain" />
    <div className="min-w-[100px]">
      <p className="font-bold text-sm">{name}</p>
      <p className="text-xs">{orders}</p>
    </div>
    <div className="flex flex-wrap gap-4 justify-between ml-auto text-xs text-center">
      <div>
        <p className="font-medium">Inventory</p>
        <p>{inventory}</p>
      </div>
      <div>
        <p className="font-medium">Sale</p>
        <p>${sale}</p>
      </div>
      <div>
        <p className="font-medium">Price</p>
        <p>${price}</p>
      </div>
      <div>
        <p className="font-medium">Total</p>
        <p>${total}</p>
      </div>
    </div>
  </div>
);

const Topproduct = () => {
  return (
    <section className="rounded-lg bg-white shadow-lg p-4">
      <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4 mt-2">
        <StatsCard
          icon={<MdOutlinePersonOutline size={20} />}
          label="Total Visits"
          value="20,000"
          bg="bg-green-700"
        />
        <StatsCard
          icon={<CiShoppingCart size={20} />}
          label="Total Sales"
          value="15,000"
          bg="bg-green-500"
        />
        <StatsCard
          icon={<IoBagHandleOutline size={20} />}
          label="Total Made"
          value="$700,000"
          bg="bg-green-700"
        />
        <StatsCard
          icon={<TbBorderNone size={20} />}
          label="Orders Completed"
          value="30,900"
          bg="bg-green-500"
        />
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold px-1 mb-4">Top Product</h2>
        <ProductCard
          image={bag}
          name="Gucci handbag"
          orders="Black - 20 orders"
          inventory={200}
          sale={3000}
          price={3500}
          total={12500}
        />
        <ProductCard
          image={puma}
          name="Puma handbag"
          orders="Black - 20 orders"
          inventory={200}
          sale={3000}
          price={3500}
          total={12500}
        />
      </div>
    </section>
  );
};

export default Topproduct;
