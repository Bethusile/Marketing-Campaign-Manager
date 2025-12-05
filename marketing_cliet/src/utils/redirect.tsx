import React from 'react';
import { useNavigate } from 'react-router-dom'; 

const redirectTo = (path: string) => {
  const navigate = useNavigate();
  navigate(path);
}
export default redirectTo;