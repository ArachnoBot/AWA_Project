import { 
  Stack, 
  Container, 
  Typography, 
  TextField, 
  Button,
  Link
} 
from '@mui/material';
import "../App.css"
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@emotion/react';


const Login = ({alertFunc}) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleLogin = async () => {
    // Send email and password to backend for login
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: document.getElementById("emailInput").value,
        password: document.getElementById("passwordInput").value
      })
    })
    const data = await res.json()
    if (data.success) {
      localStorage.setItem("auth_token", data.token)
      navigate("/home")
    } else {
      // If not successful display alert with error message
      alertFunc("error", data.errmsg)
    }
  }

  return (
    <Container sx={{width:"450px"}}>
      <Stack className='border' p={3}>
        <Typography variant="h5" align="center" color={theme.palette.textColor} gutterBottom>Sign In</Typography>
        <Typography align='left' color={theme.palette.textColor}>Email address</Typography>
        <TextField
          id='emailInput'
          fullWidth
          margin="normal"
          type="email"
          InputProps={{ sx: { backgroundColor: theme.palette.textFieldBg }}}
          sx={{ marginBottom: '25px', '& input': {color: theme.palette.textColor}}}
        />
        <Typography align='left' color={theme.palette.textColor}>Password</Typography>
        <TextField
          id='passwordInput'
          fullWidth
          margin="normal"
          type="password"
          InputProps={{ sx: { backgroundColor: theme.palette.textFieldBg }}}
          sx={{ marginBottom: '30px', '& input': {color: theme.palette.textColor}}}
        />
        <Button variant="contained" fullWidth onClick={handleLogin}>
          Sign In
        </Button>
        <Link href="/register" marginTop={2}>
          {"Don't have an account? Sign Up"}
        </Link>
      </Stack>
    </Container>
  )
}

export default Login