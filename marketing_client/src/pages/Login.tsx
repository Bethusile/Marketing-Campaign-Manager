import { Box, Card, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';
import darkLogo from '../assets/BBD_BBD_Full_Colour_-_Black_1.png';
import lightLogo from '../assets/BBD_BBD_Full_Colour_-_White_1.png';
import '../styles.css';

const Login = () => {
  const navigate = useNavigate();

  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const currentLogo = isDark ? lightLogo : darkLogo;

  const handleLogin = () => navigate('/dashboard');  //Google OAuth to be implemented

  return (
    <Box className="loginContainer" component="main">
      <Card className="loginCard" component="section">
        <img src={currentLogo} alt="Login Logo" className="logo" />

        <h1 className="welcome">Welcome To AR Marketing Hub</h1>
        <p className="subtitle"> Create, manage, and deploy Augmented R eality 
          <br /> marketing campaigns </p>

         <Button
          variant="outlined"
          onClick={handleLogin}
          startIcon={<GoogleIcon />}
          className="googleButton">
          Sign-in with Google
        </Button>

      </Card>
    </Box>
  );
};

export default Login;
