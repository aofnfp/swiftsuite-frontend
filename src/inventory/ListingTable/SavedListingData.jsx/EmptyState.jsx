import React from 'react'
import { Link } from 'react-router-dom';

const EmptyState = () => (
  <div className="text-center p-10 rounded-lg bg-gray-50">
    <img src="/image/savedlisting.png" alt="No Saved Listings" className="h-16 w-16 mx-auto text-gray-400" />
    <p className="mt-4 text-gray-600 font-medium text-lg">
      No Saved Listings Found
    </p>
    <p className="text-gray-500 mt-2">Start by creating a new listing</p>
    <Link to="/layout/product" className="text-green-600 font-semibold mt-2">Create New Listing</Link>
  </div>
);

export default EmptyState;
