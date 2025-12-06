// Created by Bethusile Mafumana :  src/components/NavBar/NavBar.tsx
import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  CssBaseline,
  Container,
  styled,
  useMediaQuery,
  
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import { LOGO_WHITE, LOGO_RED, LOGO_BLACK, ACCENT_RED, DARK_BG } from '../styles/themeConstants';

interface NavBarProps {
  onUploadClick: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ onUploadClick }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const prefersLightMode = useMediaQuery('(prefers-color-scheme: light)');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const getAppBarBg = () => {
    if (prefersLightMode) return scrolled ? ACCENT_RED : 'white';
    return scrolled ? ACCENT_RED : '#000';
  };

  const getTextColor = () => {
    if (prefersLightMode) return scrolled ? 'white' : 'black';
    return 'white';
  };

  const getLogo = () => {
    if (prefersLightMode) return scrolled ? LOGO_RED : LOGO_BLACK;
    return scrolled ? LOGO_RED : LOGO_WHITE;
  };

  const getUploadBtnColor = () => {
    if (scrolled) return 'black'; // Black on scroll for both dark and light modes
    return ACCENT_RED;            // Original red when not scrolled
  };

  const GlassAppBar = styled(AppBar)({
    backgroundColor: getAppBarBg(),
    boxShadow: scrolled ? '0 4px 10px rgba(0,0,0,0.5)' : 'none',
    transition: 'background-color 0.3s, box-shadow 0.3s',
    top: 0,
    zIndex: 1100,
  });

const drawer = (
  <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', height: '100%' }}>
    <Box sx={{ p: 2 }}>
      <img src={getLogo()} alt="Logo" style={{ height: 30 }} />
    </Box>
    <List>
      <ListItem disablePadding>
        <ListItemButton 
          sx={{ color: prefersLightMode ? 'black' : 'white' }} 
          onClick={onUploadClick}
        >
          <CloudUploadIcon sx={{ mr: 1, color: ACCENT_RED }} />
          <ListItemText primary="Upload Campaign" />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton sx={{ color: prefersLightMode ? 'black' : 'white' }}>
          <AccountCircleIcon sx={{ mr: 1, color: prefersLightMode ? 'black' : 'white' }} />
          <ListItemText 
            primary="John Doe" 
            secondary="Current User" 
            sx={{ '& .MuiListItemText-secondary': { color: prefersLightMode ? 'grey.700' : 'grey' } }}
          />
        </ListItemButton>
      </ListItem>
    </List>
  </Box>
);


  return (
    <>
      <CssBaseline />
      <GlassAppBar position="fixed">
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            {/* Logo and Title */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <img src={getLogo()} alt="Logo" style={{ height: 30, marginRight: 8 }} />
              <Typography variant="h6" fontWeight="bold" sx={{ color: getTextColor() }}>
                AR Manager
              </Typography>
            </Box>

            {/* Desktop Actions */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
              <Button
                variant="contained"
                startIcon={<CloudUploadIcon />}
                onClick={onUploadClick}
                sx={{
                  bgcolor: getUploadBtnColor(),
                  color: 'white',
                  '&:hover': { bgcolor: '#333' },
                  mr: 2,
                }}
              >
                Upload Campaign
              </Button>
              <Typography sx={{ color: getTextColor(), mr: 1.5 }}>John Doe</Typography>
              <AccountCircleIcon sx={{ fontSize: 32, color: getTextColor() }} />
            </Box>

            {/* Mobile Hamburger */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { md: 'none' } }}
            >
              <MenuIcon sx={{ color: getTextColor() }} />
            </IconButton>
          </Toolbar>
        </Container>
      </GlassAppBar>

      {/* Mobile Drawer */}
      <nav>
        // Inside NavBar component, replace the Drawer JSX with this:
<Drawer
  variant="temporary"
  open={mobileOpen}
  onClose={handleDrawerToggle}
  ModalProps={{ keepMounted: true }}
  sx={{
    display: { xs: 'block', md: 'none' },
    '& .MuiDrawer-paper': {
      width: '80%',
      maxWidth: 300,
      bgcolor: prefersLightMode ? '#fff' : DARK_BG, // Light mode = white, dark mode = black
    },
  }}
>
  {drawer}
</Drawer>

      </nav>

      <Toolbar /> {/* Spacer */}
    </>
  );
};

export default NavBar;
