import React from 'react';

const Overview = () => {
  const womenPercentage = 80;
  const menPercentage = 30;
  const kidsPercentage = 20;

  const Bar = ({ label, percentage, color }) => (
    <div className="mb-8">
      <h1 className="mb-2">{label}</h1>
      <div className="w-full h-3 bg-gray-300 rounded-lg overflow-hidden">
        <div
          className="h-full rounded-lg"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
            transition: 'width 0.3s ease',
          }}
        ></div>
      </div>
      {/* <p className="mt-1 text-sm text-gray-600">{percentage}%</p> */}
    </div>
  );

  return (
    <section className="rounded-lg p-5 bg-white shadow-lg h-full">
      <p className="font-bold text-xl">Stats Overview</p>
      <p className="mt-2">Information about store visits</p>
      <div className="mt-6">
        <Bar label="Women" percentage={womenPercentage} color="green" />
        <Bar label="Men" percentage={menPercentage} color="orange" />
        <Bar label="Kids" percentage={kidsPercentage} color="#A5D6A7" />
      </div>
    </section>
  );
};

export default Overview;
