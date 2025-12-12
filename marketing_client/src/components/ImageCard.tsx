// Image card for CampaignImages
import React from 'react';
import { Box, CardContent, Typography, useTheme } from '@mui/material';
import type { CampaignImage } from '../api/campaign';
import { GlassCard } from '../styles/sharedStyles';

interface Props {
  image: CampaignImage | any;
  onCardClick: (image: CampaignImage) => void;
}

const ImageCard: React.FC<Props> = ({ image, onCardClick }) => {
  const theme = useTheme();
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

  return (
    <GlassCard onClick={() => onCardClick(image)}>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          aspectRatio: '4/3',
          overflow: 'hidden',
          backgroundColor: '#000',
          display: 'block',
          '&:hover .overlay-img': { opacity: 1 },
        }}
      >
        <Box
          component="img"
          src={
            resolvePath(image.unredactedImageUrl)
            || resolvePath(image.redactedImageUrl)
            || 'https://placehold.co/600x450/334155/ffffff?text=No+Image'
          }
          alt={`${image.title} target`}
          loading="lazy"
          sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', display: 'block', pointerEvents: 'none' }}
          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => { e.currentTarget.src = 'https://placehold.co/600x450/333333/ffffff?text=Image+Not+Found'; }}
        />

        <Box
          component="img"
          src={
            resolvePath(image.redactedImageUrl)
            || resolvePath(image.unredactedImageUrl)
            || 'https://placehold.co/600x450/334155/ffffff?text=No+Image'
          }
          alt={`${image.title} overlay`}
          className="overlay-img"
          loading="lazy"
          sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', display: 'block', opacity: 0, transition: 'opacity 600ms ease', pointerEvents: 'none' }}
          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => { e.currentTarget.src = 'https://placehold.co/600x450/333333/ffffff?text=Image+Not+Found'; }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" fontWeight="bold" color={isLight ? 'black' : 'white'} sx={{ textTransform: 'capitalize' }}>
          {image.title}
        </Typography>
        <Typography color={isLight ? '#333' : '#ccc'}>
          Uploaded: {image.createdAt ? new Date(image.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown'}
        </Typography>
      </CardContent>
    </GlassCard>
  );
};

export default ImageCard;
