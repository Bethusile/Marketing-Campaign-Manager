// Created by Bethusile Mafumana :
import React from 'react';
import {
  Box, Select, MenuItem, TextField, InputAdornment, useTheme, Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import { ACCENT_RED } from '../styles/themeConstants';

interface Props {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  filterStatus: 'all' | 'Active' | 'Inactive';
  setFilterStatus: (v: 'all' | 'Active' | 'Inactive') => void;
  sortKey: 'newest' | 'oldest' | 'alpha';
  setSortKey: (v: 'newest' | 'oldest' | 'alpha') => void;
  onUploadClick?: () => void;
}

const CampaignControls: React.FC<Props> = ({
  searchTerm, setSearchTerm,
  filterStatus, setFilterStatus,
  sortKey, setSortKey,
  onUploadClick
}) => {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  const bgColor = isLight ? '#f5f5f5' : '#1a1a1a';
  const textColor = isLight ? '#111' : 'white';
  const iconColor = isLight ? '#111' : 'white';
  const borderColor = ACCENT_RED;

  return (
    <Box display="flex" flexWrap="wrap" gap={2} my={4} alignItems="center">
      <TextField
        placeholder="Search campaigns..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ flex: '1 1 360px' }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: iconColor }} />
            </InputAdornment>
          ),
          sx: {
            background: bgColor,
            borderRadius: '50px',
            color: textColor,
            '& .MuiOutlinedInput-notchedOutline': { borderColor }
          }
        }}
      />

      <Select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value as Props['filterStatus'])}
        sx={{
          color: textColor,
          background: bgColor,
          borderRadius: '50px',
          minWidth: 140
        }}
      >
        <MenuItem value="all">All Status</MenuItem>
        <MenuItem value="Active">Active</MenuItem>
        <MenuItem value="Inactive">Inactive</MenuItem>
      </Select>

      <Select
        value={sortKey}
        onChange={(e) => setSortKey(e.target.value as Props['sortKey'])}
        sx={{
          color: textColor,
          background: bgColor,
          borderRadius: '50px',
          minWidth: 140
        }}
      >
        <MenuItem value="newest">Newest</MenuItem>
        <MenuItem value="oldest">Oldest</MenuItem>
        <MenuItem value="alpha">Alphabetical</MenuItem>
      </Select>

      {onUploadClick && (
        <Button variant="contained" startIcon={<CloudUploadIcon />} onClick={onUploadClick} sx={{ bgcolor: ACCENT_RED }}>
          Upload Campaign
        </Button>
      )}
    </Box>
  );
};

export default CampaignControls;
