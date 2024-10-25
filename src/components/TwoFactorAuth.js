import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

function TwoFactorAuth({ onVerify }) {
  const [code, setCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onVerify(code);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        label="2FA Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        required
      />
      <Button type="submit">Verify</Button>
    </Box>
  );
}

export default TwoFactorAuth;