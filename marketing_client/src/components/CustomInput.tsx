import React from 'react';
// FIX: Add 'type' before TextFieldProps
import TextField, { type TextFieldProps } from '@mui/material/TextField'; 

type CustomInputProps = TextFieldProps & {
  label: string;
};
// Omit 'variant' if you want to enforce a specific style, or keep it to allow flexibility


const CustomInput: React.FC<CustomInputProps> = ({ label, ...props }) => {
  return (
    <TextField
      label={label}
      variant="outlined"
      fullWidth
      margin="normal"
      InputLabelProps={{
        shrink: true, // Keeps the label floating above (cleaner look)
      }}
      {...props}
    />
  );
};

export default CustomInput;