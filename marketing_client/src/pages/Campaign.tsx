import React, { useState } from 'react';
import { Container, Typography, Box, Button as MuiButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import UploadFile from '../components/UploadSection';
import Button from '../components/CustomButton';
import Input from '../components/CustomInput';
import Dropdown from '../components/CustomDropdown';
import '../styles.css';
import { postCampaign, type CampaignForm } from '../api/campaign';

const Campaign: React.FC = () => {
  const navigate = useNavigate();

  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
  ];

  const [status, setStatus] = useState('Inactive');
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => setStatus(event.target.value as string);

  const [redactedFile, setRedactedFile] = useState<File | null>(null);
  const [unredactedFile, setUnredactedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [buttonUrl, setButtonUrl] = useState('');
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUploadCampaign = async () => {
    setLoading(true);
    try {
      const form: CampaignForm = {
        title,
        message,
        overlayFile: redactedFile ?? undefined,
        targetFile: unredactedFile ?? undefined,
        button_url: buttonUrl,
        isActive: status === 'Active',
        comments,
      };

      const created = await postCampaign(form);
      // Simple success feedback — navigate back to dashboard
      alert(`Campaign created: ${created.title}`);
      navigate('/dashboard');
    } catch (err) {
      // Basic error handling
      // eslint-disable-next-line no-console
      console.error('Failed to create campaign', err);
      alert('Failed to upload campaign. See console for details.');
    } finally {
      setLoading(false);
    }
  };

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
        <Input label="Title" required value={title} onChange={(e) => setTitle(e.target.value)} />
        <Input label="Message" required multiline rows={5} value={message} onChange={(e) => setMessage(e.target.value)} />
        <Input label="URL" required value={buttonUrl} onChange={(e) => setButtonUrl(e.target.value)} />
      </Container>

      <Container className="campaignUpload">
        <UploadFile onFileSelect={(f) => setRedactedFile(f)} fileType="Overlay" />
        <UploadFile onFileSelect={(f) => setUnredactedFile(f)} fileType="Target" />
      </Container>

      <Container>
        <Input label="Comment" value={comments} onChange={(e) => setComments(e.target.value)} />
      </Container>

      <Container>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button label="Upload Campaign" onClick={handleUploadCampaign} loading={loading} />
          <MuiButton variant="outlined" onClick={() => navigate('/dashboard')}>Back to Dashboard</MuiButton>
        </Box>
      </Container>
    </>
  );
};

export default Campaign;