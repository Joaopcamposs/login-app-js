import { Typography } from '@mui/material';
import React from 'react';

export default function ErrorMessage(props) {
  return (
    <Typography
      variant="h6"
      sx={{ color: 'red' }}
      style={{ fontWeight: 'bold' }}
      padding={'10px'}
    >
      {props.message}
    </Typography>
  );
}
