import React, { useState } from 'react';
import { Tooltip, Popover, Typography, useMediaQuery, useTheme } from '@mui/material';

const ResponsiveTooltip = ({ title, children }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); 
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

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
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            PaperProps={{
              sx: {
                bgcolor: '#a7cab9',
                color: 'white',
                fontSize: '10px',
                borderRadius: '6px',
                p: 1,
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              },
            }}
          >
            <Typography sx={{ p: 1 }}>{title}</Typography>
          </Popover>
        </>
      ) : (
        <Tooltip
          title={title}
          componentsProps={{
            tooltip: {
              sx: {
                bgcolor: '#a7cab9',
                color: 'white',
                fontSize: '10px',
                borderRadius: '6px',
                p: 1,
                width: '160px',
              },
            },
          }}
          arrow
          placement="top-start"
          PopperProps={{
            modifiers: [{ name: 'offset', options: { offset: [0, -10] } }],
          }}
        >
          <span className="text-[#089451] opacity-25 text-xl" aria-label="More information">
            {children}
          </span>
        </Tooltip>
      )}
    </>
  );
};

export default ResponsiveTooltip;