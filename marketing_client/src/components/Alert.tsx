import React from 'react'; 
import { 
  Modal, 
  Box, 
  Typography, 
  IconButton, 
  useTheme,
  Button as MuiButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ErrorIcon from '@mui/icons-material/Cancel';      
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; 
import WarningIcon from '@mui/icons-material/Warning';  

import { ACCENT_RED } from '../styles/themeConstants';
import { StyledModalBox } from '../styles/sharedStyles';

type AlertType = 'error' | 'success' | 'warning';

interface AlertProps {
  open: boolean;
  onClose: () => void;
  type: AlertType;
  title: string;
  message: string;
}

const colorMap = {
  error: { 
    icon: ErrorIcon, 
    color: '#FF4444',
    titleColor: '#FFC8C8'
  },
  success: { 
    icon: CheckCircleIcon, 
    color: '#10b981',
    titleColor: '#B0FFD9' 
  },
  warning: { 
    icon: WarningIcon, 
    color: '#FFB844',
    titleColor: '#FFEFB0'
  },
};

const Alert: React.FC<AlertProps> = ({ open, onClose, type, title, message }) => {
  const theme = useTheme();
  const { icon: Icon, color, titleColor } = colorMap[type];
  const isDark = theme.palette.mode === 'dark';

  return (
    <Modal
      open={open}
      onClose={onClose}
      disableEscapeKeyDown
      slotProps={{
        backdrop: {
          style: { backgroundColor: 'rgba(0, 0, 0, 0.8)' }
        }
      }}
    >
      <StyledModalBox
        sx={{
          width: { xs: '90%', sm: 450, md: 550 },
          bgcolor: isDark ? theme.palette.background.default : '#222222',
          p: 4,
          borderRadius: 2,
          border: `2px solid ${color}`,
          boxShadow: `0 0 15px ${color}50`,
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Icon sx={{ fontSize: 72, color: color, mr: 2, flexShrink: 0 }} />

          <Box flexGrow={1} minWidth={0}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: titleColor }}>
              {title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'white', mt: 0.5 }}>
              {message}
            </Typography>
          </Box>

          <IconButton 
            onClick={onClose} 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              ml: 2,
              '&:hover': {
                color: ACCENT_RED,
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* CONFIRMATION BUTTONS ONLY FOR DELETE WARNING */}
        {type === 'warning' && title.includes("Are you sure") && (
          <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
            <MuiButton variant="outlined" onClick={onClose}>Cancel</MuiButton>
            <MuiButton 
              variant="contained" 
              color="error" 
              onClick={(e) => {
                e.stopPropagation();
                (window as any).__confirmDelete && (window as any).__confirmDelete();
              }}
            >
              Delete
            </MuiButton>
          </Box>
        )}
      </StyledModalBox>
    </Modal>
  );
};

export default Alert;
