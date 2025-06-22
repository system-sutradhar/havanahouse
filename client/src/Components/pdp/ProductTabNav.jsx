"use client";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

const ProductTabNav = ({ value = 0, onChange, tabs = [], sticky = false }) => {
  const handleChange = (event, newValue) => {
    if (onChange) onChange(newValue);
  };

  return (
    <Box className={`pdp-tab-nav${sticky ? ' sticky' : ''}`}>
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
      >
        {tabs.map((label, idx) => (
          <Tab key={idx} label={label} />
        ))}
      </Tabs>
    </Box>
  );
};

export default ProductTabNav;
