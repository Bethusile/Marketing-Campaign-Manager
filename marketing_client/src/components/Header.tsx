import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar>
          <Typography variant="h6" component="div" className="headerTitle">
          Marketing Client
        </Typography>
        <Box>
            <Button color="inherit" onClick={() => navigate('/dashboard')}>
              Dashboard
            </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

  import '../styles.css';
export default Header;
