import { useTheme } from '@emotion/react';
import { 
  Stack, 
  Container, 
  Typography, 
  TextField, 
  Button,
  Link,
} 
from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Register = ({alertFunc}) => {
  const navigate = useNavigate()
  const theme = useTheme()

  const handleRegister = async () => {
    // Send email and password to backend for registering
    const res = await fetch("/api/register", {
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
      // If successful, set the token to storage and go to page where you can edit account info
      localStorage.setItem("auth_token", data.token)
      navigate("/editInfo")
    } else {
      // If not successful display alert with error message
      alertFunc("error", data.errmsg)
    }
  }

  return (
    <Container sx={{width:"450px"}}>
      <Stack className='border' p={3}>
        <Typography 
          variant="h5" 
          align="center" 
          gutterBottom 
          color={theme.palette.textColor}>
          Register
        </Typography>
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
        <Button variant="contained" fullWidth onClick={handleRegister}>
          Register
        </Button>
        <Link href="/login" marginTop={2}>
          {"Already have an account? Sign in"}
        </Link>
      </Stack>
    </Container>
  )
}

export default Register