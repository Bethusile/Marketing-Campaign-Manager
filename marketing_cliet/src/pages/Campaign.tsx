import React from 'react';
import { Container, Typography } from '@mui/material';
import Header from '../components/Header';

const Campaign: React.FC = () => {
  return (
    <>
      <Header />
      <Container className="campaignContainer">
        <Typography variant="h4" gutterBottom>
          Campaigns
        </Typography>
      </Container>
    </>
  );
};

import '../styles.css';
export default Campaign;
