import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
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
  Button
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import { LOGO_WHITE, LOGO_RED, LOGO_BLACK, ACCENT_RED, DARK_BG } from '../styles/themeConstants';
import { useNavigate } from 'react-router-dom';

const NavBar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const prefersLightMode = useMediaQuery('(prefers-color-scheme: light)');
  const navigate = useNavigate();

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

  const GlassAppBar = styled(AppBar)(() => ({
    backgroundColor: getAppBarBg(),
    boxShadow: scrolled ? '0 4px 10px rgba(0,0,0,0.5)' : 'none',
    transition: 'background-color 0.3s, box-shadow 0.3s',
    top: 0,
    zIndex: 1100,
  }));

  const goToDashboard = () => navigate('/dashboard');
  const logout = () => navigate('/login');

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', height: '4rem' }}>
      <Box sx={{ p: 2 }}>
        <img src={getLogo()} alt="Logo" style={{ height: '4rem' }} onClick={goToDashboard} />
      </Box>
      <List>
        <ListItem disablePadding>
          <ListItemButton sx={{ color: prefersLightMode ? 'black' : 'white' }}>
            <AccountCircleIcon sx={{ mr: 1, color: prefersLightMode ? 'black' : 'white' }} />
            <ListItemText primary="John Doe" secondary="Current User" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={logout}>
            <ListItemText primary="Logout" sx={{ color: prefersLightMode ? 'black' : 'white' }} />
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
          <Toolbar disableGutters>

  {/* LEFT — LOGO */}
  <Box
    sx={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
    }}
    onClick={goToDashboard}
  >
    <img
      src={getLogo()}
      alt="Logo"
      style={{ height: '3.5rem', marginRight: 8 }}
    />
  </Box>

  {/* CENTER — TITLE */}
  <Box
    sx={{
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
    }}
  >
    <Typography
      variant="h5"
      fontWeight="bold"
      sx={{ color: getTextColor() }}
    >
      Campaign Manager
    </Typography>
  </Box>

  {/* RIGHT — USER + LOGOUT (DESKTOP) */}
  <Box
    sx={{
      flex: 1,
      display: { xs: 'none', md: 'flex' },
      justifyContent: 'flex-end',
      alignItems: 'center',
    }}
  >
    <Typography sx={{ color: getTextColor(), mr: 1.5 }}>John Doe</Typography>
    <AccountCircleIcon sx={{ fontSize: 32, color: getTextColor(), mr: 2 }} />

    <Button
      variant="outlined"
      size="small"
      onClick={logout}
      sx={{
        color: getTextColor(),
        borderColor: getTextColor(),
        '&:hover': { borderColor: getTextColor() },
      }}
    >
      Logout
    </Button>
  </Box>

  {/* MOBILE MENU BUTTON (still right side) */}
  <IconButton
    color="inherit"
    aria-label="open drawer"
    edge="end"
    onClick={handleDrawerToggle}
    sx={{ display: { md: 'none' } }}
  >
    <MenuIcon sx={{ color: getTextColor() }} />
  </IconButton>

</Toolbar>

        </Container>
      </GlassAppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: '80%', maxWidth: 300, bgcolor: prefersLightMode ? '#fff' : DARK_BG },
        }}
      >
        {drawer}
      </Drawer>

      <Toolbar />
    </>
  );
};

export default NavBar;
