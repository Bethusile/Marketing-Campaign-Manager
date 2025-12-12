import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button as MuiButton } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import UploadFile from '../components/UploadSection';
import Button from '../components/CustomButton';
import Input from '../components/CustomInput';
import Dropdown from '../components/CustomDropdown';
import Alert from '../components/Alert'; 
import '../styles.css';
import { postCampaign, type CampaignForm, getCampaignById, updateCampaign, deleteCampaign } from '../api/campaign';

type AlertStateType = {
  open: boolean;
  title: string;
  message: string;
  type: 'error' | 'success' | 'warning';
};

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

  const [alertState, setAlertState] = useState<AlertStateType>({
    open: false,
    title: '',
    message: '',
    type: 'error',
  });

  const handleAlertClose = () => {
    setAlertState(prev => ({ ...prev, open: false }));
  };

  const handleSubmitValidation = (): boolean => {
    if (!title.trim() || !message.trim() || !redactedFile || !buttonUrl || !unredactedFile ) {
      showErrorAlert('Validation Error', 'Please fill in all required fields.');
      return false;
    }
    return true;
  }

  const showErrorAlert = (title: string, message: string) => {
    setAlertState({
      open: true,
      title,
      message,
      type: 'error',
    });
  };

  const showSuccessAlert = (title: string, message: string) => {
    setAlertState({
      open: true,
      title,
      message,
      type: 'success',
    });
  };

  // NEW: delete confirmation state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

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
        console.error('Failed to load campaign', err);
        showErrorAlert('Campaign Load Error', 'Failed to retrieve campaign data from the server.');
      }
    };

    load();

    return () => { mounted = false; };
  }, [id]);

  const handleUploadCampaign = async () => {
    setLoading(true);
    handleAlertClose(); 
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

      if(handleSubmitValidation()){
        if (isEdit && id) {
           const updated = await updateCampaign(Number(id), form);
           showSuccessAlert('Campaign Updated', `Successfully updated campaign: ${updated.title}`);
        }
        else {
           const created = await postCampaign(form);
           showSuccessAlert('Campaign Created', `Successfully created new campaign: ${created.title}`);
          }

       setTimeout(() => navigate('/dashboard'), 1500); 
      }

    } catch (err) {
      console.error('Failed to upload campaign', err);
      showErrorAlert('Upload Failed', 'The campaign could not be saved. Check the console for server details.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    handleAlertClose();
    setLoading(true);

    try {
      await deleteCampaign(Number(id));
      showSuccessAlert('Campaign Deleted', 'The campaign was successfully removed.');

      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      console.error('Failed to delete campaign', err);
      showErrorAlert('Deletion Failed', 'The campaign could not be deleted from the server.');
    } finally {
      setLoading(false);
    }
  };

  // NEW: global confirm handler
  const confirmDelete = () => {
    setDeleteConfirmOpen(false);
    handleDelete();
  };

  // Make handler accessible to Alert
  (window as any).__confirmDelete = confirmDelete;

  return (
    <>
      <NavBar />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5" component="section">
            {isEdit ? 'Update Campaign' : 'Create New Campaign'}
          </Typography>
          <MuiButton variant="outlined" onClick={() => navigate('/dashboard')}>Back to Dashboard</MuiButton>
        </Box>

        <Box sx={{ display: 'grid', gap: 2 }}>
          <Dropdown label={'Status'} value={status} options={statusOptions} onChange={handleChange} />
          <Input label="Title" required value={title} onChange={(e) => setTitle(e.target.value)} />
          <Input label="Message" required multiline rows={5} value={message} onChange={(e) => setMessage(e.target.value)} />
          <Input label="URL" required value={buttonUrl} onChange={(e) => setButtonUrl(e.target.value)} />

          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' }, mt: 1 }}>
            <Box sx={{ flex: 1 }}>
              <UploadFile onFileSelect={(f) => setRedactedFile(f)} fileType="Overlay" existingImageUrl={overlayUrl} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <UploadFile onFileSelect={(f) => setUnredactedFile(f)} fileType="Target" existingImageUrl={targetUrl} />
            </Box>
          </Box>

          <Input label="Comment" value={comments} onChange={(e) => setComments(e.target.value)} />

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 1 }}>
            <Button label={isEdit ? 'Update Campaign' : 'Upload Campaign'} onClick={handleUploadCampaign} loading={loading} />
            <MuiButton variant="outlined" onClick={() => navigate('/dashboard')}>Cancel</MuiButton>
            {isEdit && (
              <MuiButton 
                variant="outlined" 
                color="error" 
                onClick={() => setDeleteConfirmOpen(true)}
              >
                Delete Campaign
              </MuiButton>
            )}
          </Box>
        </Box>
      </Container>

      {/* DELETE CONFIRMATION ALERT */}
      <Alert
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        type="warning"
        title="Are you sure?"
        message="Are you sure you want to delete this campaign? This action cannot be undone."
      />

      {/* EXISTING ALERT */}
      <Alert
        open={alertState.open}
        onClose={handleAlertClose}
        type={alertState.type}
        title={alertState.title}
        message={alertState.message}
      />
    </>
  );
};

export default Campaign;
