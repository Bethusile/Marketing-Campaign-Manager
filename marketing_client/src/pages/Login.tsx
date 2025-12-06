import React from 'react';
import { Box, Card, CardContent, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/dashboard');
  };

  return (
    <Box className="loginContainer">
      <Card className="loginCard">
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            Welcome
          </Typography>
          <Button variant="contained" color="primary" onClick={handleLogin}>
            Login
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

import '../styles.css';
export default Login;
