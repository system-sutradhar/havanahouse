'use client';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { styled } from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1rem;
`;

const DeliveryChecker = () => {
  const [pincode, setPincode] = useState('');
  const [message, setMessage] = useState('');

  const checkAvailability = () => {
    if (!pincode) return;
    // Replace with actual API call
    setMessage(pincode === '411001' ? 'Delivery available to your location.' : 'Not deliverable to this pincode.');
  };

  return (
    <Wrapper className="delivery-checker">
      <TextField
        size="small"
        label="Pincode"
        aria-label="Delivery pincode"
        value={pincode}
        onChange={(e) => setPincode(e.target.value)}
      />
      <Button
        variant="outlined"
        sx={{ ml: 1 }}
        onClick={checkAvailability}
        aria-label="Check delivery availability"
      >
        Check
      </Button>
      {message && <p>{message}</p>}
    </Wrapper>
  );
};

export default DeliveryChecker;
