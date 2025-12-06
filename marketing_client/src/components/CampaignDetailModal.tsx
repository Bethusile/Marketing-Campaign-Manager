// Created by Bethusile Mafumana :
import React from 'react';
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Divider,
  Chip,
  Button,
  CardMedia,
  Grid,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { Campaign } from '../data/campaigns';
import { StyledModalBox } from '../styles/sharedStyles';
import { ACCENT_RED } from '../styles/themeConstants';

interface CampaignDetailModalProps {
  campaign: Campaign | null;
  open: boolean;
  onClose: () => void;
}

const CampaignDetailModal: React.FC<CampaignDetailModalProps> = ({ campaign, open, onClose }) => {
  const theme = useTheme();
  if (!campaign) return null;

  const isLight = theme.palette.mode === 'light';

  const handleEdit = () => {
    console.log(`[ACTION] Editing campaign: ${campaign.title}`);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <StyledModalBox
        sx={{
          bgcolor: isLight ? '#fff' : theme.palette.background.paper,
          color: isLight ? '#111' : '#fff',
        }}
      >
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" fontWeight="bold">
            {campaign.title}
          </Typography>
          <IconButton onClick={onClose} sx={{ color: ACCENT_RED }}>
            <CloseIcon fontSize="large" />
          </IconButton>
        </Box>

        {/* Grid for Image & Details */}
        <Grid container spacing={3}>
          <Grid sx={{ width: { xs: '100%', md: '50%' } }}>
            <CardMedia
              component="img"
              image={campaign.imageSrc}
              alt={campaign.title}
              sx={{
                borderRadius: 2,
                width: '100%',
                height: 'auto',
                maxHeight: 300,
                objectFit: 'cover',
              }}
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                e.currentTarget.src = 'https://placehold.co/600x450/333333/ffffff?text=Image+Error';
              }}
            />
          </Grid>

          <Grid sx={{ width: { xs: '100%', md: '50%' } }}>
            <Chip
              label={campaign.status}
              size="medium"
              sx={{
                fontWeight: 'bold',
                fontSize: '1rem',
                backgroundColor: campaign.status === 'Active' ? '#10b981' : '#f87171',
                color: 'white',
                px: 1,
                py: 0.5,
              }}
            />

            <Divider sx={{ my: 2, borderColor: isLight ? '#ccc' : 'rgba(255,255,255,0.1)' }} />

            <Typography variant="body2" color={isLight ? '#555' : '#ccc'}>
              Uploaded
            </Typography>
            <Typography variant="subtitle1" fontWeight="bold">
              {campaign.uploaded}
            </Typography>

            <Divider sx={{ my: 2, borderColor: isLight ? '#ccc' : 'rgba(255,255,255,0.1)' }} />

            <Typography variant="body2" color={isLight ? '#555' : '#ccc'}>
              Expires
            </Typography>
            <Typography variant="subtitle1" fontWeight="bold">
              {campaign.expires}
            </Typography>

            <Divider sx={{ my: 2, borderColor: isLight ? '#ccc' : 'rgba(255,255,255,0.1)' }} />

            <Typography variant="body2" color={isLight ? '#555' : '#ccc'} mb={0.5}>
              Campaign URL
            </Typography>
            <Typography
              component="a"
              href={`https://example.com/ar-scan/${campaign.id}`}
              sx={{
                color: ACCENT_RED,
                fontWeight: 'semibold',
                textDecoration: 'none',
              }}
            >
              https://example.com/ar-scan/{campaign.id}
            </Typography>
          </Grid>
        </Grid>

        {/* Actions */}
        <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
          <Button
            variant="outlined"
            sx={{
              color: isLight ? '#111' : 'white',
              borderColor: isLight ? '#111' : 'white',
              '&:hover': { borderColor: ACCENT_RED },
            }}
            onClick={handleEdit}
          >
            Edit Details
          </Button>
          <Button
            variant="contained"
            sx={{ bgcolor: ACCENT_RED, '&:hover': { bgcolor: '#FF3333' } }}
            onClick={onClose}
          >
            Close
          </Button>
        </Box>
      </StyledModalBox>
    </Modal>
  );
};

export default CampaignDetailModal;
