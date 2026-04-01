import React, { useState } from 'react';
import { Tooltip, Popover, Typography, useMediaQuery, useTheme } from '@mui/material';

const ResponsiveTooltip = ({ title, children }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const open = Boolean(anchorEl);

  // Custom render for HTML, styled to match your “perfect” tooltip
  const renderHTML = (html) => (
    <div
      style={{
        fontSize: '10px',
        lineHeight: 1.3,
        color: 'white',
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );

  return (
    <>
      {isSmallScreen ? (
        <>
          <span
            className="text-[#089451] opacity-25 text-xl cursor-pointer"
            onClick={handleClick}
            aria-label="More information"
          >
            {children}
          </span>
          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            PaperProps={{
              sx: {
                bgcolor: '#a7cab9',
                color: 'white',
                fontSize: '10px',
                borderRadius: '6px',
                p: 1,
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                maxWidth: 220,
              },
            }}
          >
            {renderHTML(title)}
          </Popover>
        </>
      ) : (
        <Tooltip
          title={renderHTML(title)}
          componentsProps={{
            tooltip: {
              sx: {
                bgcolor: 'gray-300',
                color: 'white',
                fontSize: '10px',
                borderRadius: '6px',
                p: 1,
                width: '200px',
              },
            },
          }}
          arrow
          placement="right"
          PopperProps={{
            modifiers: [{ name: 'offset', options: { offset: [0, -10] } }],
          }}
        >
          <span
            className="text-[#089451] opacity-25 text-xl cursor-pointer"
            aria-label="More information"
          >
            {children}
          </span>
        </Tooltip>
      )}
    </>
  );
};

export default ResponsiveTooltip;
