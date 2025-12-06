import React from 'react';
// FIX: Add 'type' before ButtonProps
import Button, { type ButtonProps } from '@mui/material/Button'; 
import CircularProgress from '@mui/material/CircularProgress';

interface CustomButtonProps extends ButtonProps {
  label: string;
  loading?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({ 
  label, 
  loading = false, 
  variant = "contained", 
  disabled, 
  ...props 
}) => {
  return (
    <Button
      variant={variant}
      disabled={disabled || loading}
      sx={{ 
        py: 1.5, 
        fontWeight: 'bold',
        textTransform: 'none',
        boxShadow: variant === 'contained' ? 2 : 0,
        ...props.sx 
      }}
      {...props}
    >
      {loading ? <CircularProgress size={24} color="inherit" /> : label}
    </Button>
  );
};

export default CustomButton;