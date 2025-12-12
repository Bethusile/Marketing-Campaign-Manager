import React from 'react';
import { Modal, Box, Typography, Button, CardMedia, useTheme } from '@mui/material';
import type { CampaignImage } from '../api/campaign';
import { StyledModalBox } from '../styles/sharedStyles';
import { ACCENT_RED } from '../styles/themeConstants';

interface ImageDetailModalProps {
  image: CampaignImage | null;
  open: boolean;
  onClose: () => void;
}

const ImageDetailModal: React.FC<ImageDetailModalProps> = ({ image, open, onClose }) => {
  const theme = useTheme();
  if (!image) return null;

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

  const imageUrl1 = resolvePath(image.unredactedImageUrl);
  const imageUrl2 = resolvePath(image.redactedImageUrl);
  const fallbackImage = 'https://placehold.co/400x300/333333/ffffff?text=Image+Error';

  return (
    <Modal open={open} onClose={onClose}>
      <StyledModalBox sx={{ width: { xs: '95%', sm: '90%', md: 900 }, bgcolor: isLight ? '#fff' : theme.palette.background.paper, color: isLight ? '#111' : '#fff', maxHeight: '90vh', overflowY: 'auto' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} sx={{ gap: 2, flexWrap: 'wrap' }}>
          <Typography variant="h5" fontWeight="bold">{image.title}</Typography>
          <Typography variant="body2" color={isLight ? '#555' : '#ccc'}>
            Uploaded: {image.createdAt ? new Date(image.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          <Box sx={{ flex: '1 1 50%', minWidth: 0 }}>
            <Box mb={3} sx={{ borderBottom: `2px solid ${ACCENT_RED}`, paddingBottom: 2 }}>
              <Typography variant="subtitle2" color={isLight ? '#333' : '#aaa'} mb={0.5}>{imageUrl1 ? 'Unredacted Image' : 'Unredacted Image Not Found'}</Typography>
              <CardMedia component="img" image={imageUrl1 || fallbackImage} alt={`${image.title} Unredacted Image`} sx={{ borderRadius: 2, width: '100%', height: 'auto', maxHeight: { xs: 350, md: 500 }, objectFit: 'contain' }} onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => { e.currentTarget.src = fallbackImage; }} />
            </Box>

            <Box sx={{ borderBottom: `2px solid ${ACCENT_RED}`, paddingBottom: 2 }}>
              <Typography variant="subtitle2" color={isLight ? '#333' : '#aaa'} mb={0.5}>{imageUrl2 ? 'Redacted Image' : 'Redacted Image Not Found'}</Typography>
              <CardMedia component="img" image={imageUrl2 || fallbackImage} alt={`${image.title} Redacted Image`} sx={{ borderRadius: 2, width: '100%', height: 'auto', maxHeight: { xs: 350, md: 500 }, objectFit: 'contain' }} onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => { e.currentTarget.src = fallbackImage; }} />
            </Box>
          </Box>
        </Box>

        <Box mt={4} display="flex" justifyContent="flex-end">
          <Button variant="contained" sx={{ bgcolor: ACCENT_RED, '&:hover': { bgcolor: '#FF3333' } }} onClick={onClose}>Close</Button>
        </Box>
      </StyledModalBox>
    </Modal>
  );
};

export default ImageDetailModal;
