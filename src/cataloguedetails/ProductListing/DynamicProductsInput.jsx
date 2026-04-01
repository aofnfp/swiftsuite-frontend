import React, { useState } from 'react';

const DynamicProductInputs = ({ productListing, handleListingChange }) => {
  // State to track which fields are being edited
  const [editingFields, setEditingFields] = useState({});

  // Define all possible input fields with their configurations
  const inputFields = [
    {
      name: 'brand',
      label: 'Brand',
      placeholder: 'Enter brand...',
      alwaysShow: true
    },
    {
      name: 'sku',
      label: 'SKU',
      placeholder: 'Enter SKU...',
      alwaysShow: true
    },
    {
      name: 'upc',
      label: 'UPC',
      placeholder: 'Enter UPC...',
      alwaysShow: true
    },
    {
      name: 'mpn',
      label: 'MPN',
      placeholder: 'Enter MPN...',
      // alwaysShow: true
    },
    {
      name: 'vendor_name',
      label: 'Vendor Name',
      placeholder: 'Enter vendor name...',
      // alwaysShow: true
    },
    {
      name: 'listingType',
      label: 'Listing Type',
      placeholder: 'Enter listing type...'
    },
    {
      name: 'msrp',
      label: 'MSRP',
      placeholder: 'Enter MSRP...'
    },
    {
      name: 'model',
      label: 'Model',
      placeholder: 'Enter Model...',
    },
    {
      name: 'shipping_width',
      label: 'Shipping Width',
      placeholder: 'Enter shipping width...'
    },
    {
      name: 'shipping_height',
      label: 'Shipping Height',
      placeholder: 'Enter shipping height...'
    },
    {
      name: 'shipping_length',
      label: 'Shipping Length',
      placeholder: 'Enter shipping length...'
    },
    {
      name: 'shipping_weight',
      label: 'Shipping Weight',
      placeholder: 'Enter shipping weight...'
    },
    {
      name: 'location',
      label: 'Location',
      placeholder: 'Enter location...'
    },
    {
      name: 'type',
      label: 'Type',
      placeholder: 'Enter type...'
    }
  ];

  const customHandleChange = (e) => {
    const { name, value } = e.target;
    
    setEditingFields(prev => ({
      ...prev,
      [name]: true
    }));

    handleListingChange(e);
  };

  const isRealValue = (val) => {
  return val !== null && val !== undefined && val !== "" && val !== "Null" && val !== "null";
};

  const filteredInputs = inputFields.filter(field => {
  if (field.alwaysShow) return true;
  const value = productListing?.[field.name];
  const hasValue = isRealValue(value);
  const isEditing = editingFields[field.name];

  return hasValue || isEditing;
  });

  const renderInput = (field) => {
    const value = productListing?.[field.name] && productListing?.[field.name] !== "Null" ? productListing?.[field.name] : '';
    
     const isUpcFilled = !!productListing?.upc;
    
    return (
      <div key={field.name}>
        <label className="block mb-2 text-sm font-medium">{field.label}</label>
        <input
          type="text"
          name={field.name}
          value={value}
          onChange={customHandleChange}
          placeholder={field.placeholder}
          // readOnly={productListing?.upc === "" && field.name !== 'upc'}
          readOnly={isUpcFilled && field.name !== 'upc'}
          className="border border-gray-300 p-2 w-full rounded focus:outline-none"
        />
      </div>
    );
  };

  // Chunk inputs into rows of 3
  const createInputRows = (inputs) => {
    const rows = [];
    for (let i = 0; i < inputs.length; i += 3) {
      rows.push(inputs.slice(i, i + 3));
    }
    return rows;
  };

  const inputRows = createInputRows(filteredInputs.map(renderInput));

  return (
    <div className="space-y-4">
      {inputRows.map((row, index) => (
        <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {row}
        </div>
      ))}
    </div>
  );
};

export default DynamicProductInputs;