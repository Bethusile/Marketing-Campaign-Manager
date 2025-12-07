// Created by Bethusile Mafumana :
import React from 'react';
import { Box, Chip, CardContent, Typography, useTheme } from '@mui/material';
import type { Campaign } from '../api/campaign';
import { GlassCard } from '../styles/sharedStyles';

interface Props {
  campaign: Campaign;
  onCardClick: (campaign: Campaign) => void;
}

const CampaignCard: React.FC<Props> = ({ campaign, onCardClick }) => {
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
    <GlassCard onClick={() => onCardClick(campaign)}>
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
        {/* Target image shown by default */}
        <Box
          component="img"
          src={resolvePath(campaign.target_url) || resolvePath(campaign.overlay_url) || 'https://placehold.co/600x450/334155/ffffff?text=No+Image'}
          alt={`${campaign.title} target`}
          loading="lazy"
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            display: 'block',
            pointerEvents: 'none',
          }}
          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
            e.currentTarget.src = 'https://placehold.co/600x450/333333/ffffff?text=Image+Not+Found';
          }}
        />

        {/* Overlay/display image fades in on hover */}
        <Box
          component="img"
          src={resolvePath(campaign.overlay_url) || resolvePath(campaign.target_url) || 'https://placehold.co/600x450/334155/ffffff?text=No+Image'}
          alt={`${campaign.title} overlay`}
          className="overlay-img"
          loading="lazy"
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            display: 'block',
            opacity: 0,
            transition: 'opacity 600ms ease',
            pointerEvents: 'none',
          }}
          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
            e.currentTarget.src = 'https://placehold.co/600x450/333333/ffffff?text=Image+Not+Found';
          }}
        />

        <Chip
          label={campaign.isActive ? 'Active' : 'Inactive'}
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            backgroundColor: campaign.isActive ? '#10b981' : '#f87171',
            color: 'white',
            fontWeight: 'bold',
          }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" fontWeight="bold" color={isLight ? 'black' : 'white'} sx={{ textTransform: 'capitalize' }}>
          {campaign.title}
        </Typography>
        <Typography color={isLight ? '#333' : '#ccc'}>
          Uploaded: {campaign.createdAt ? new Date(campaign.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown'}
        </Typography>
      </CardContent>
    </GlassCard>
  );
};

export default CampaignCard;
