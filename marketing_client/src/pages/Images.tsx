import React, { useState } from 'react';
import { Container, Typography, Box, Button as MuiButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import UploadFile from '../components/UploadSection';
import Button from '../components/CustomButton';
import Input from '../components/CustomInput';
import Alert from '../components/Alert';
import '../styles.css';
import { uploadImagePair } from '../api/campaign';

type AlertStateType = {
  open: boolean;
  title: string;
  message: string;
  type: 'error' | 'success' | 'warning';
};

const Images: React.FC = () => {
  const navigate = useNavigate();

  const [redactedFile, setRedactedFile] = useState<File | null>(null);
  const [unredactedFile, setUnredactedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const [alertState, setAlertState] = useState<AlertStateType>({ open: false, title: '', message: '', type: 'error' });

  const handleAlertClose = () => setAlertState(prev => ({ ...prev, open: false }));

  const showErrorAlert = (title: string, message: string) => setAlertState({ open: true, title, message, type: 'error' });
  const showSuccessAlert = (title: string, message: string) => setAlertState({ open: true, title, message, type: 'success' });

  const validate = () => {
    if (!title.trim() || !redactedFile || !unredactedFile) {
      showErrorAlert('Validation Error', 'Please provide a title and both images.');
      return false;
    }
    return true;
  };

  const handleUpload = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const resp = await uploadImagePair(title, redactedFile ?? undefined, unredactedFile ?? undefined);
      showSuccessAlert('Uploaded', `Uploaded: ${resp.title}`);
      setTimeout(() => navigate('/dashboard'), 1200);
    } catch (err) {
      console.error('Upload failed', err);
      showErrorAlert('Upload Failed', 'Could not upload images.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5">Create New Image Pair</Typography>
          <MuiButton variant="outlined" onClick={() => navigate('/dashboard')}>Back to Dashboard</MuiButton>
        </Box>

        <Box sx={{ display: 'grid', gap: 2 }}>
          <Input label="Title" required value={title} onChange={(e) => setTitle(e.target.value)} />

          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' }, mt: 1 }}>
            <Box sx={{ flex: 1 }}>
              <UploadFile onFileSelect={(f) => setRedactedFile(f)} fileType="Redacted" existingImageUrl={undefined} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <UploadFile onFileSelect={(f) => setUnredactedFile(f)} fileType="Unredacted" existingImageUrl={undefined} />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 1 }}>
            <Button label="Upload Images" onClick={handleUpload} loading={loading} />
            <MuiButton variant="outlined" onClick={() => navigate('/dashboard')}>Cancel</MuiButton>
          </Box>
        </Box>
      </Container>

      <Alert open={alertState.open} onClose={handleAlertClose} type={alertState.type} title={alertState.title} message={alertState.message} />
    </>
  );
};

export default Images;
