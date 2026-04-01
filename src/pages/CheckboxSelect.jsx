import React, { useState, useEffect } from 'react';

function CheckboxSelect() {
  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState(new Set());

  // Fetch options from localStorage
  useEffect(() => {
    const connection = JSON.parse(localStorage.getItem('matchedVendor'));
    setOptions(connection.manufacturer); // The manufacturers list is an array of strings
  }, []);

  const handleSelectAll = () => {
    setSelectedOptions(new Set(options.map((option, index) => index)));
  };

  const handleDeselectAll = () => {
    setSelectedOptions(new Set());
  };

  
  const handleCheckboxChange = (index) => {
    setSelectedOptions((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(index)) {
        newSelected.delete(index); // Deselect if already selected
      } else {
        newSelected.add(index); // Select if not selected
      }
      return newSelected;
    });
  };

  const handleSubmit = () => {
    console.log('Selected Manufacturer Indices:', [...selectedOptions]);
    console.log('Selected Manufacturers:', [...selectedOptions].map((index) => options[index]));
  };

  return (
    <div>
      <div>
        <button onClick={handleSelectAll}>Select All</button>
        <button onClick={handleDeselectAll}>Deselect All</button>
      </div>
      <div>
        {options.map((option, index) => (
          <div key={index}>
            <input
              type="checkbox"
              checked={selectedOptions.has(index)}
              onChange={() => handleCheckboxChange(index)}
            />
            <label>{option}</label>
          </div>
        ))}
      </div>
      <div>
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
}

export default CheckboxSelect;
