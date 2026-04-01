import React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';

const RightBar = ({ isOpen, onClose, product }) => {
  return (
    <Drawer
      anchor='right'
      open={isOpen}
      onClose={onClose}
    >
      <Box
        sx={{
          width: 350, // Set the width of the sidebar
          height: '100%',
          backgroundColor: 'white', // White background for better aesthetics
          padding: 2,
          display: 'flex',
          flexDirection: 'column', // Stack items vertically
          overflowY: 'auto', // Allow vertical scrolling if content overflows
        }}
        role="presentation"
      >
        <Divider />
        {product ? (
          <List sx={{ flexGrow: 1 }}> {/* Allow the list to grow */}
            <h2 className="text-black mb-2">Product Details</h2> {/* Spacing below title */}
            <div className="flex flex-col">
              <p className="text-black mb-1">Title: {product.title}</p>
              <p className="text-black mb-1">Brand: {product.brand}</p>
              <p className="text-black mb-1">Price: ${product.price}</p> {/* Added dollar sign for clarity */}
              <p className="text-black mb-1">Description: {product.detailed_description}</p>
              {/* Add more product details as needed */}
            </div>
          </List>
        ) : (
          <p className="text-black">No product selected</p>
        )}
      </Box>
    </Drawer>
  );
};

export default RightBar;
