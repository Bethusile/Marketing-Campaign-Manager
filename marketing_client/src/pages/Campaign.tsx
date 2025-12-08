import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button as MuiButton } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import UploadFile from '../components/UploadSection';
import Button from '../components/CustomButton';
import Input from '../components/CustomInput';
import Dropdown from '../components/CustomDropdown';
import '../styles.css';
import { postCampaign, type CampaignForm, getCampaignById, updateCampaign, deleteCampaign } from '../api/campaign';

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
  const [overlayUrl, setOverlayUrl] = useState<string>('');
  const [targetUrl, setTargetUrl] = useState<string>('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [buttonUrl, setButtonUrl] = useState('');
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const isEdit = Boolean(id);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!id) return;
      try {
        const campaign = await getCampaignById(Number(id));
        if (!mounted) return;
        setTitle(campaign.title || '');
        setMessage(campaign.message || '');
        setButtonUrl(campaign.button_url || '');
        setComments(campaign.comments || '');
        setStatus(campaign.isActive ? 'Active' : 'Inactive');
        setOverlayUrl(campaign.overlay_url || '');
        setTargetUrl(campaign.target_url || '');
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to load campaign', err);
        alert('Failed to load campaign data.');
      }
    };

    load();

    return () => { mounted = false; };
  }, [id]);

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

      if (isEdit && id) {
        const updated = await updateCampaign(Number(id), form);
        console.log('Updated campaign:', updated);
        alert(`Campaign updated: ${updated.title}`);
      } else {
        const created = await postCampaign(form);
        alert(`Campaign created: ${created.title}`);
      }

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

  const handleDelete = async () => {
    if (!id) return;
    const ok = window.confirm('Delete this campaign? This action cannot be undone.');
    if (!ok) return;
    setLoading(true);
    try {
      await deleteCampaign(Number(id));
      alert('Campaign deleted');
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to delete campaign', err);
      alert('Failed to delete campaign.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header with back button */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5" component="section">
            {isEdit ? 'Update Campaign' : 'Create New Campaign'}
          </Typography>
          <MuiButton variant="outlined" onClick={() => navigate('/dashboard')}>Back to Dashboard</MuiButton>
        </Box>

        {/* Main form */}
        <Box sx={{ display: 'grid', gap: 2 }}>
          <Dropdown label={'Status'} value={status} options={statusOptions} onChange={handleChange} />
          <Input label="Title" required value={title} onChange={(e) => setTitle(e.target.value)} />
          <Input label="Message" required multiline rows={5} value={message} onChange={(e) => setMessage(e.target.value)} />
          <Input label="URL" required value={buttonUrl} onChange={(e) => setButtonUrl(e.target.value)} />

          {/* Uploads: side-by-side on md+, stacked on xs */}
          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' }, mt: 1 }}>
            <Box sx={{ flex: 1 }}>
              <UploadFile onFileSelect={(f) => setRedactedFile(f)} fileType="Overlay" existingImageUrl={overlayUrl} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <UploadFile onFileSelect={(f) => setUnredactedFile(f)} fileType="Target" existingImageUrl={targetUrl} />
            </Box>
          </Box>

          <Input label="Comment" value={comments} onChange={(e) => setComments(e.target.value)} />

          {/* Actions */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 1 }}>
            <Button label={isEdit ? 'Update Campaign' : 'Upload Campaign'} onClick={handleUploadCampaign} loading={loading} />
            <MuiButton variant="outlined" onClick={() => navigate('/dashboard')}>Cancel</MuiButton>
            {isEdit && (
              <MuiButton variant="outlined" color="error" onClick={handleDelete}>
                Delete Campaign
              </MuiButton>
            )}
          </Box>
        </Box>
      </Container>
    </>
  );
    };

    export default Campaign;