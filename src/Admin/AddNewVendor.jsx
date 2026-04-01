import React, { useState } from 'react';
import imgs from './Images/welcomeg.jpg';
import AddNewVendor2 from './AddNewVendor2';

const AddNewVendor = () => {
  const [step, setStep] = useState('welcome');
  const fullName = localStorage.getItem('fullName') || 'User';

  return (
    <div className="w-full min-h-screen bg-white">
      {step === 'welcome' && (
        <div className="min-h-screen flex flex-col items-center justify-center">
          <img src={imgs} alt="Welcome" width={130} />
          <h1 className="text-2xl font-bold mt-4">Welcome {fullName}</h1>
          <p className="text-center mt-2 px-4">
            Start creating new vendors on Swift Suite and edit existing vendor details
          </p>
          <button
            className="mt-6 px-6 py-2 bg-[#089451] text-white rounded border hover:bg-white hover:border-[#089451] hover:text-[#089451]"
            onClick={() => setStep('vendor')}
          >
            Proceed
          </button>
        </div>
      )}

      {step === 'vendor' && (
        <div className="w-full min-h-screen p-4 sm:p-6 shadow-[0_4px_25px_0px_rgba(0,0,0,0.05)]">
          <AddNewVendor2 />
        </div>
      )}
    </div>
  );
};

export default AddNewVendor;
