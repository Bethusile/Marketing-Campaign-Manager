// Created by Bethusile Mafumana
import { Card, Box, styled } from '@mui/material';
import { ACCENT_RED } from './themeConstants';

export const GlassCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255,255,255,0.05)',
  backdropFilter: 'blur(5px)',
  borderRadius: Number(theme.shape.borderRadius) * 2,
  border: '1px solid rgba(255,255,255,0.1)',
  color: theme.palette.common.white,
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: `0 8px 30px ${ACCENT_RED}`,
    cursor: 'pointer',
  },
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
}));

export const StyledModalBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 800,
  maxHeight: '90vh',
  overflowY: 'auto',
  borderRadius: Number(theme.shape.borderRadius) * 2,
  background: 'rgba(0,0,0,0.95)',
  backdropFilter: 'blur(15px)',
  boxShadow: '0 0 40px rgba(0, 0, 0, 0.7)',
  padding: theme.spacing(4),
  color: theme.palette.common.white,
  border: `2px solid ${ACCENT_RED}`,
}));
