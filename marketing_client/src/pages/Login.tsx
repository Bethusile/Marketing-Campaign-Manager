import { Box, Card, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';
import darkLogo from '../assets/BBD_BBD_Full_Colour_-_Black_1.png';
import lightLogo from '../assets/BBD_BBD_Full_Colour_-_White_1.png';
import '../styles.css';

const Login = () => {
  const navigate = useNavigate();
  const handleLogin = () => navigate('/dashboard'); 

  return (
    <Box className="loginContainer" component="main">
      <Card className="loginCard" component="section">
        <img src={lightLogo} alt="Login Logo" className="logo light-logo" />
        <img src={darkLogo} alt="Login Logo" className="logo dark-logo" />

        <h1 className="welcome">Welcome to AR Marketing Hub</h1>
        <p className="tagline"> Create, manage, and deploy Augmented Reality marketing campaigns </p>

         <Button
          variant="outlined"
          onClick={handleLogin}
          startIcon={<GoogleIcon />} className="googleButton"> Sign-in with Google </Button>

      </Card>
    </Box>
  );
};

export default Login;
