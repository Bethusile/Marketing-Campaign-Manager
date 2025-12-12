import React, { useState } from 'react';
import { Container, Typography, Box, Button as MuiButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Button from '../components/CustomButton';
import Input from '../components/CustomInput';
import Alert from '../components/Alert';
import '../styles.css';
import { uploadCampaignSimple } from '../api/campaign';

type AlertStateType = {
  open: boolean;
  title: string;
  message: string;
  type: 'error' | 'success' | 'warning';
};

const CreateCampaign: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [buttonUrl, setButtonUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const [alertState, setAlertState] = useState<AlertStateType>({ open: false, title: '', message: '', type: 'error' });

  const handleAlertClose = () => setAlertState(prev => ({ ...prev, open: false }));
  const showErrorAlert = (title: string, message: string) => setAlertState({ open: true, title, message, type: 'error' });
  const showSuccessAlert = (title: string, message: string) => setAlertState({ open: true, title, message, type: 'success' });

  const validate = () => {
    if (!title.trim() || !message.trim() || !buttonUrl.trim()) {
      showErrorAlert('Validation Error', 'Please provide title, message and button URL.');
      return false;
    }
    return true;
  };

  const handleUpload = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await uploadCampaignSimple(title, message, buttonUrl);
      showSuccessAlert('Uploaded', `Campaign \"${title}\" uploaded.`);
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      console.error('Upload failed', err);
      showErrorAlert('Upload Failed', 'Could not upload campaign.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5">Create New Campaign</Typography>
          <MuiButton variant="outlined" onClick={() => navigate('/dashboard')}>Back to Dashboard</MuiButton>
        </Box>

        <Box sx={{ display: 'grid', gap: 2 }}>
          <Input label="Title" required value={title} onChange={(e) => setTitle(e.target.value)} />
          <Input label="Message" required multiline minRows={3} value={message} onChange={(e) => setMessage(e.target.value)} />
          <Input label="Button URL" required value={buttonUrl} onChange={(e) => setButtonUrl(e.target.value)} />

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 1 }}>
            <Button label="Create Campaign" onClick={handleUpload} loading={loading} />
            <MuiButton variant="outlined" onClick={() => navigate('/dashboard')}>Cancel</MuiButton>
          </Box>
        </Box>
      </Container>

      <Alert open={alertState.open} onClose={handleAlertClose} type={alertState.type} title={alertState.title} message={alertState.message} />
    </>
  );
};

export default CreateCampaign;
