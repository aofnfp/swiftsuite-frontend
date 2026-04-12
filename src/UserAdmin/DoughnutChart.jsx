import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip);

const DoughnutChart = () => {
  const marketplaces = ['Shopify', 'eBay', 'Walmart', 'Amazon', 'WooCommerce'];
  const marketplaceColors = ['#BB8232', '#005D68', '#02784033', '#027840', '#00000099'];
  const marketplaceData = [30, 15, 25, 15, 0];

  const vendors = ['Fragrancex', 'Lipsey', 'RSR', 'CWR', 'Zanders'];
  const vendorColors = ['#BB8232', '#005D68', '#02784033', '#027840', '#00000099'];
  const vendorData = [50, 31, 19, 0, 0];

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '55%',
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.label}: ${ctx.raw}%`
        }
      }
    }
  };

  const createChartData = (labels, data, colors) => ({
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors,
        borderWidth: 1
      }
    ]
  });

  const renderLegend = (labels, data, colors) => (
    <div className="space-y-2 w-full min-w-0">
      {labels.map((label, index) => (
        <div
          key={label}
          className="flex items-center gap-2 text-sm min-w-0 justify-between md:justify-start"
        >
          <div className="flex items-center gap-2 min-w-0 flex-1 md:flex-none">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: colors[index] }}
            />
            <span className="font-medium truncate md:whitespace-nowrap md:overflow-visible">
              {label}
            </span>
          </div>
          <span className="text-gray-500 flex-shrink-0">{data[index]}%</span>
        </div>
      ))}
    </div>
  );

  const total = (arr) => arr.reduce((sum, val) => sum + val, 0);

  return (
    <div className="flex flex-col md:flex-row justify-center items-start gap-4 border">
      <div className="flex flex-col sm:flex-col md:flex-row md:gap-10 gap-5 border w-full bg-white p-4 rounded-xl">
        <div className="flex flex-col items-start">
          <h2 className="text-lg font-semibold">Products Listed</h2>
          <p className="text-gray-600 text-sm mb-2">Total: {total(marketplaceData)}%</p>
          <div className="w-[160px] h-[160px]">
            <Doughnut
              data={createChartData(marketplaces, marketplaceData, marketplaceColors)}
              options={chartOptions}
            />
          </div>
        </div>

        <div className="flex flex-col justify-center w-full min-w-0">
          {renderLegend(marketplaces, marketplaceData, marketplaceColors)}
        </div>
      </div>

      <div className="flex flex-col sm:flex-col md:flex-row md:gap-10 gap-5 mt-10 md:mt-0 border w-full bg-white p-4 rounded-xl">
        <div className="flex flex-col items-start">
          <h2 className="text-lg font-semibold">Products Sold</h2>
          <p className="text-gray-600 text-sm mb-2">Total: {total(vendorData)}%</p>
          <div className="w-[160px] h-[160px]">
            <Doughnut
              data={createChartData(vendors, vendorData, vendorColors)}
              options={chartOptions}
            />
          </div>
        </div>

        <div className="flex flex-col justify-center w-full min-w-0">
          {renderLegend(vendors, vendorData, vendorColors)}
        </div>
      </div>
    </div>
  );
};

export default DoughnutChart;