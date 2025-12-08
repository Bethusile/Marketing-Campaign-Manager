/*
   Authors: Bandile and Ndumiso
   Date: 08 December 2025
   Task Description: This component renders a login page that adapts to the user's system theme (dark or light mode).
                It includes a welcome message for the marketing user and a login button to continue with Google auth.
*/

import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery, Box, Card } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import darkLogo from '../assets/logos/dark-mode.png';
import lightLogo from '../assets/logos/light-mode.png';
import '../styles.css';

const Login = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = useMediaQuery('(prefers-color-scheme: dark)');
  const [showCursor, setShowCursor] = useState(true);
  const currentLogo = isDark ? darkLogo : lightLogo;

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.style.setProperty('--bg-gradient', 'linear-gradient(135deg, #1a1a1a, #232323, #1f1f1f)');
      root.style.setProperty('--card-bg', 'rgba(255, 255, 255, 0.06)');
      root.style.setProperty('--card-border', 'rgba(255, 255, 255, 0.14)');
      root.style.setProperty('--border-gradient', 'linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.2))');
      root.style.setProperty('--text-color', '#ffffff');
    } else {
      root.style.setProperty('--bg-gradient', 'linear-gradient(135deg, #f5f5f5, #fafafa)');
      root.style.setProperty('--card-bg', 'rgba(255, 255, 255, 0.95)');
      root.style.setProperty('--card-border', '1px solid #e0e0e0');
      root.style.setProperty('--border-gradient', 'linear-gradient(135deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.15))');
      root.style.setProperty('--text-color', theme.palette.text.primary);
    }
    root.style.setProperty('--accent-color', theme.palette.primary.main);
  }, [theme, isDark]);

  useEffect(() => {
    const timeout = setTimeout(() => setShowCursor(false), 1400);
    return () => clearTimeout(timeout);
  }, []);

  const handleLogin = () => {
    navigate('/dashboard');
  };

  return (
    <Box className="pageWrapper" component="main">
      <Card className="loginCard" component="section">
        <img src={currentLogo} alt="Login Logo" className="logo" />
        <h1 className={`welcome ${showCursor ? 'with-cursor' : ''}`}>Welcome To Marketing</h1>
        <button className="button" onClick={handleLogin}>
          <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" viewBox="0 0 256 262" className="svg" aria-hidden="true">
            <path fill="#4285F4" className="blue" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" />
            <path fill="#34A853" className="green" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" />
            <path fill="#FBBC05" className="yellow" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" />
            <path fill="#EB4335" className="red" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" />
          </svg>
          Continue with Google
        </button>
      </Card>
    </Box>
  );
};
export default Login;
