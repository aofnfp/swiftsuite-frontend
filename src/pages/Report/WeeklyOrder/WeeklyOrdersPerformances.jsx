import React from 'react';

const WeeklyOrdersPerformances = () => {
  const metrics = [
    { label: 'Delivered products', value: 100, color: 'text-emerald-600', strokeColor: 'stroke-emerald-600' },
    { label: 'Shipped', value: 40, color: 'text-slate-600', strokeColor: 'stroke-emerald-400' },
    { label: 'Canceled', value: 2, color: 'text-slate-400', strokeColor: 'stroke-orange-400' }
  ];

  const CircularProgress = ({ value, color, strokeColor }) => {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;

    return (
      <svg className="w-24 h-24 md:w-28 md:h-28 transform -rotate-90">
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          className="stroke-slate-200"
          strokeWidth="8"
          fill="none"
        />
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          className={strokeColor}
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg">
      <h2 className="text-lg font-semibold mb-6">Orders performance</h2>
      <div className="flex flex-wrap justify-around gap-6">
        {metrics.map((metric, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <span className="text-sm text-slate-600 mb-2">{metric.label}</span>
            <div className="relative">
              <CircularProgress value={metric.value} color={metric.color} strokeColor={metric.strokeColor} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-xl font-bold ${metric.color}`}>{metric.value}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const VendorOrderStats = () => {
  const vendors = [
    { name: 'CWR', orders: 50 },
    { name: 'RSR', orders: 50 },
    { name: 'Zanders', orders: 0 },
    { name: 'Lipsey', orders: 0 },
    { name: 'Fragrance X', orders: 0 }
  ];

  const maxOrders = Math.max(...vendors.map(v => v.orders));

  return (
    <div className="bg-white p-6 rounded-lg">
      <h2 className="text-lg font-semibold mb-6">Vendor-Order Statistics</h2>
      <div className="relative h-64">
        <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-sm text-slate-600">
          <span>400</span>
          <span>300</span>
          <span>200</span>
          <span>100</span>
          <span>0</span>
        </div>
        <div className="ml-8 h-full border-l border-b border-slate-200">
          <div className="h-full flex items-end justify-around px-4 pb-8">
            {vendors.map((vendor, idx) => (
              <div key={idx} className="flex flex-col items-center flex-1 max-w-16">
                <div className="w-full flex items-end justify-center h-48">
                  {vendor.orders > 0 && (
                    <div 
                      className="w-12 bg-emerald-600 rounded-t"
                      style={{ height: `${(vendor.orders / 100) * 100}%` }}
                    />
                  )}
                </div>
                <span className="text-xs text-slate-600 mt-2 text-center">{vendor.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const TopVendors = () => {
  const vendors = [
    { name: 'CWR', sales: 12.3, rank: 1, color: 'bg-amber-100' },
    { name: 'RSR', sales: 9.01, rank: 2, color: 'bg-amber-50' },
    { name: 'Lipsey', sales: 1.56, rank: 3, color: 'bg-amber-50' }
  ];

  const maxSales = Math.max(...vendors.map(v => v.sales));

  return (
    <div className="bg-white p-6 rounded-lg">
      <h2 className="text-lg font-semibold mb-6">Top Vendors by Sales Volume</h2>
      <div className="space-y-4">
        {vendors.map((vendor, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <span className="text-sm font-medium w-16">{vendor.name}</span>
            <div className="flex-1 h-8 bg-slate-100 rounded relative overflow-hidden">
              <div 
                className={`h-full ${vendor.color} transition-all duration-300`}
                style={{ width: `${(vendor.sales / maxSales) * 100}%` }}
              />
            </div>
            <span className="text-sm font-semibold w-12 text-right">${vendor.sales}</span>
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-sm font-medium">
              {vendor.rank}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CustomerReturnRate = () => {
  const returning = 50;
  const newCustomers = 50;
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (returning / 100) * circumference;

  return (
    <div className="bg-white p-6 rounded-lg">
      <h2 className="text-lg font-semibold mb-6">Customer Return Rate</h2>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
        <div className="flex flex-col items-center">
          <span className="text-sm text-slate-600 mb-2">Returning</span>
          <span className="text-3xl font-bold">{returning}%</span>
        </div>
        <div className="relative">
          <svg className="w-40 h-40 transform -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r={radius}
              className="stroke-slate-200"
              strokeWidth="16"
              fill="none"
            />
            <circle
              cx="50%"
              cy="50%"
              r={radius}
              className="stroke-emerald-600"
              strokeWidth="16"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-sm text-slate-600 mb-2">New</span>
          <span className="text-3xl font-bold">{newCustomers}%</span>
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  return (
    <div className="">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WeeklyOrdersPerformances />
          <VendorOrderStats />
          <TopVendors />
          <CustomerReturnRate />
        </div>
    </div>
  );
}