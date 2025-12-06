import type { FC } from 'react';
import { Container, Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const Dashboard: FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <Container className="dashboardContainer">
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Box className="dashboardBox">
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate('/campaign')}
          >
            Go to Campaign
          </Button>
        </Box>
      </Container>
    </>
  );
};

import '../styles.css';
export default Dashboard;
