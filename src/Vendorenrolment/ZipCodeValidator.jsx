import React, { useState } from "react";

const ZipCodeValidator = ({ zipCode, setZipCode }) => {
 
  const [isValid, setIsValid] = useState(null);

  const validateZipCode = (code) => {
    const zipCodeRegex = /^\d{5}(-\d{4})?$/;
    return zipCodeRegex.test(code);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setZipCode(value);

    if (value === "") {
      setIsValid(null);
    } else {
      setIsValid(validateZipCode(value));
    }
  };

  return (
    <section>
      <div className="flex lg:gap-[26%] md:gap-[26%] gap-[28%] lg:mt-0 mt-5 py-2 p-5">
        <div>
          <label className="font-bold w-[140px] mt-3">ZIP Code</label>
        </div>
        <div>
          <div>
            <input
              type="text"
              value={zipCode}
              onChange={handleChange}
              placeholder="Enter ZIP code"
              className="border border-black focus:outline-none py-2 p-3 rounded"
            />
          </div>
          <small
            className={`mt-2  ${
              isValid === null
                ? "text-gray-600"
                : isValid
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {isValid === null && zipCode.length > 0
              ? "Enter a ZIP code to validate."
              : isValid && zipCode.length > 0
              ? "Valid ZIP Code!"
              : zipCode.length > 0 && "Invalid ZIP Code."}
          </small>
        </div>
      </div>
    </section>
  );
};

export default ZipCodeValidator;
