// Created by Bethusile Mafumana :
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Modal,
  Box,
  Typography,
  Divider,
  Chip,
  Button,
  CardMedia,
  useTheme,
} from '@mui/material';
import type { Campaign } from '../api/campaign';
import { StyledModalBox } from '../styles/sharedStyles';
import { ACCENT_RED } from '../styles/themeConstants';

interface CampaignDetailModalProps {
  campaign: Campaign | null;
  open: boolean;
  onClose: () => void;
}

const CampaignDetailModal: React.FC<CampaignDetailModalProps> = ({ campaign, open, onClose }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  if (!campaign) return null;

  const isLight = theme.palette.mode === 'light';
  const baseUrl = import.meta.env.VITE_SERVER_URL ?? '';

  const resolvePath = (p?: string | null) => {
    if (!p) return undefined;
    if (p.startsWith('http://') || p.startsWith('https://')) return p;
    const pathToUse = p.startsWith('/') ? p : `/${p}`;
    if (baseUrl.endsWith('/') && pathToUse.startsWith('/')) return `${baseUrl.slice(0, -1)}${pathToUse}`;
    if (!baseUrl.endsWith('/') && !pathToUse.startsWith('/')) return `${baseUrl}/${pathToUse}`;
    return `${baseUrl}${pathToUse}`;
  };

  const buttonUrl = campaign.button_url ?? null;

  const handleEdit = () => {
    onClose();
    navigate(`/campaign/${campaign.id}`);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <StyledModalBox
        sx={{
          width: { xs: '95%', sm: '90%', md: 900 },
          bgcolor: isLight ? '#fff' : theme.palette.background.paper,
          color: isLight ? '#111' : '#fff',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} sx={{ gap: 2, flexWrap: 'wrap' }}>
          <Typography variant="h5" fontWeight="bold">
            {campaign.title}
          </Typography>
          <Typography variant="body2" color={isLight ? '#555' : '#ccc'}>
            Uploaded: {campaign.createdAt ? new Date(campaign.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown'}
          </Typography>
          
        </Box>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          <Box sx={{ flex: '1 1 50%', minWidth: 0 }}>
            <CardMedia
              component="img"
              image={resolvePath(campaign.overlay_url) || resolvePath(campaign.target_url) || 'https://placehold.co/600x450/333333/ffffff?text=Image+Error'}
              alt={campaign.title}
              sx={{
                borderRadius: 2,
                width: '100%',
                height: 'auto',
                maxHeight: { xs: 240, md: 360 },
                objectFit: 'cover',
              }}
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                e.currentTarget.src = 'https://placehold.co/600x450/333333/ffffff?text=Image+Error';
              }}
            />
          </Box>

          <Box sx={{ flex: '1 1 50%', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Chip
                label={campaign.isActive ? 'Active' : 'Inactive'}
                size="medium"
                sx={{
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  backgroundColor: campaign.isActive ? '#10b981' : '#f87171',
                  color: 'white',
                  px: 1,
                  py: 0.5,
                }}
              />
              <Typography variant="body2" color={isLight ? '#555' : '#ccc'}>
                Last updated: {campaign.updatedAt ? new Date(campaign.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown'}
              </Typography>
            </Box>

            <Divider sx={{ my: 2, borderColor: isLight ? '#ccc' : 'rgba(255,255,255,0.1)' }} />

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr' }, gap: 2 }}>
              <Box>
                <Typography variant="body2" color={isLight ? '#555' : '#ccc'}>
                  Message
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', color: isLight ? '#111' : '#fff' }}>
                  {campaign.message || '—'}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color={isLight ? '#555' : '#ccc'}>
                  Comments
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', color: isLight ? '#111' : '#fff' }}>
                  {campaign.comments || '—'}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color={isLight ? '#555' : '#ccc'} mb={0.5}>
                  Button Link
                </Typography>
                {buttonUrl ? (
                  <Typography
                    component="a"
                    href={buttonUrl}
                    target="_blank"
                    rel="noreferrer"
                    sx={{ color: ACCENT_RED, textDecoration: 'underline', wordBreak: 'break-all' }}
                  >
                    {buttonUrl}
                  </Typography>
                ) : (
                  <Typography variant="body1" color={isLight ? '#111' : '#fff'}>—</Typography>
                )}
              </Box>
            </Box>
          </Box>
        </Box>

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
