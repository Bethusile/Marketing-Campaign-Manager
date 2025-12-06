import React, { useState } from 'react';
import { Container, Typography, Box, Button as MuiButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import UploadFile from '../components/UploadSection';
import Button from '../components/CustomButton';
import Input from '../components/CustomInput';
import Dropdown from '../components/CustomDropdown';
import '../styles.css';

const Campaign: React.FC = () => {
  const navigate = useNavigate();

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' },
  ];

  const [status, setStatus] = useState('pending');
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => setStatus(event.target.value);

  const [redactedFile, setRedactedFile] = useState<File | null>(null);
  const [unredactedFile, setUnredactedFile] = useState<File | null>(null);

  return (
    <>
      <NavBar />
      <Container className="header">
        <Typography variant="h5" component="section" gutterBottom>
          Campaign
        </Typography>
      </Container>

      <Container>
        <Dropdown label={'Status'} value={status} options={statusOptions} onChange={handleChange} />
        <Input label="Title" required />
        <Input label="Message" required multiline rows={5} />
        <Input label="URL" required />
      </Container>

      <Container className="campaignUpload">
        <UploadFile onFileSelect={(f) => setRedactedFile(f)} fileType="redacted" />
        <UploadFile onFileSelect={(f) => setUnredactedFile(f)} fileType="unredacted" />
      </Container>

      <Container>
        <Input label="Comment" />
      </Container>

      <Container>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button label="Upload Campaign" onClick={() => console.log('Uploading', { redactedFile, unredactedFile, status })} />
          <MuiButton variant="outlined" onClick={() => navigate('/dashboard')}>Back to Dashboard</MuiButton>
        </Box>
      </Container>
    </>
  );
};

export default Campaign;