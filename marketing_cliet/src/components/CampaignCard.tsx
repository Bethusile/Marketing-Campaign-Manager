// Created by Bethusile Mafumana :
import React from 'react';
import { Box, Chip, CardMedia, CardContent, Typography, useTheme } from '@mui/material';
import type { Campaign } from '../data/campaigns';
import { GlassCard } from '../styles/sharedStyles';

interface Props {
  campaign: Campaign;
  onCardClick: (campaign: Campaign) => void;
}

const CampaignCard: React.FC<Props> = ({ campaign, onCardClick }) => {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  return (
    <GlassCard onClick={() => onCardClick(campaign)}>
      <Box position="relative">
        <CardMedia
          component="img"
          image={campaign.imageSrc}
          alt={campaign.title}
          sx={{ aspectRatio: '4/3', objectFit: 'cover' }}
        />

        <Chip
          label={campaign.status}
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            backgroundColor: campaign.status === 'Active' ? '#10b981' : '#f87171',
            color: 'white',
            fontWeight: 'bold',
          }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" fontWeight="bold" color={isLight ? 'black' : 'white'}>
          {campaign.title}
        </Typography>
        <Typography color={isLight ? '#333' : '#ccc'}>
          Uploaded: {campaign.uploaded}
        </Typography>
        <Typography color={isLight ? '#333' : '#ccc'}>
          Expires: {campaign.expires}
        </Typography>
      </CardContent>
    </GlassCard>
  );
};

export default CampaignCard;
