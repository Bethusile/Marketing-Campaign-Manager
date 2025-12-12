import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button as MuiButton, Autocomplete } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Button from '../components/CustomButton';
import Input from '../components/CustomInput';
import { TextField, Chip, Stack } from '@mui/material';
import Alert from '../components/Alert';
import '../styles.css';
import { uploadCampaignSimple } from '../api/campaign';
import { compileTargets } from '../utils/genarator';
import { getAllImages, type CampaignImage } from '../api/campaign';

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
  const [images, setImages] = useState<CampaignImage[]>([]);
  const [selectedImages, setSelectedImages] = useState<CampaignImage[]>([]);

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
      const isActive = selectedImages.length > 0;
      const created = await uploadCampaignSimple(title, message, buttonUrl, isActive);
      showSuccessAlert('Uploaded', `Campaign \"${title}\" uploaded.`);

      const campaignId = (created && (created.id ?? created?.dataValues?.id)) as number | undefined;

      // If images were selected, run the linking/target compilation flow
      const selectedIds = selectedImages.map((i) => i.id);
      if (selectedIds.length && campaignId) {
        setAlertState({ open: true, title: 'Linking Targets', message: 'Starting target compilation...', type: 'warning' });
        try {
          await linkTargetsToCampaign(campaignId, selectedIds);
          showSuccessAlert('Targets Linked', 'Targets compiled and uploaded to campaign.');
        } catch (err: any) {
          console.error('Linking failed', err);
          showErrorAlert('Linking Failed', err?.message ?? 'Failed to link targets');
        }
      }

      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      console.error('Upload failed', err);
      showErrorAlert('Upload Failed', 'Could not upload campaign.');
    } finally {
      setLoading(false);
    }
  };

  const SERVER_URL = import.meta.env.VITE_SERVER_URL ?? window.location.origin;

  const linkTargetsToCampaign = async (campaignId: number, ids: number[]) => {
    if (!ids.length) throw new Error('No image ids provided');

    // Fetch bulk redacted-image map
    const resp = await fetch(`${SERVER_URL}/api/marketing/images/redacted`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    });

    if (!resp.ok) {
      const text = await resp.text().catch(() => '');
      throw new Error(`Failed to fetch redacted images: ${resp.status} ${text}`);
    }

    const map = (await resp.json().catch(() => ({}))) as Record<string, string>;
    const imageEntries = ids.map((id) => {
      const url = map[id] ? `${SERVER_URL}${map[id]}` : '';
      return { id, url };
    }).filter((e) => e.url) as Array<{ id: number; url: string }>;

    if (!imageEntries.length) throw new Error('No redacted image URLs could be resolved');

    const imageUrls = imageEntries.map((e) => e.url);
    setAlertState({ open: true, title: 'Compiling Targets', message: `Compiling ${imageUrls.length} images...`, type: 'warning' });

    const compiled = await compileTargets(imageUrls);

    // fetch blob from object URL
    const blobResp = await fetch(compiled.url);
    const mindBlob = await blobResp.blob();

    const targetIdMap: Record<number, number> = imageEntries.reduce<Record<number, number>>((acc, e, idx) => {
      acc[idx] = e.id;
      return acc;
    }, {});

    const fd = new FormData();
    fd.append('campaignId', String(campaignId));
    fd.append('targetIdMap', JSON.stringify(targetIdMap));
    fd.append('targetMind', mindBlob, 'targets.mind');

    setAlertState({ open: true, title: 'Uploading Targets', message: 'Uploading compiled target file...', type: 'warning' });
    const upl = await fetch(`${SERVER_URL}/api/marketing/campaign/target`, { method: 'PUT', body: fd });
    const uplJson = await upl.json().catch(() => ({ status: upl.status, ok: upl.ok }));
    if (!upl.ok) {
      throw new Error(JSON.stringify(uplJson));
    }
    return uplJson;
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const imgs = await getAllImages();
        if (!mounted) return;
        setImages(imgs || []);
      } catch (err) {
        console.error('Failed to load images for selection', err);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

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

          {/* Select images by title (no duplicates). stored by id for linking */}
          <Box>
            <Autocomplete
              multiple
              options={images}
              getOptionLabel={(opt) => opt.title || `#${opt.id}`}
              value={selectedImages}
              onChange={(_, newValue) => setSelectedImages(newValue)}
              renderTags={() => null}
              renderInput={(params) => <TextField {...params} label="Select Images to Link" placeholder="Search images" />}
              isOptionEqualToValue={(option, value) => option.id === value.id}
            />

            <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
              {selectedImages.map((img) => (
                <Chip key={img.id} label={img.title || `#${img.id}`} onDelete={() => setSelectedImages(prev => prev.filter(x => x.id !== img.id))} />
              ))}
            </Stack>
          </Box>

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
