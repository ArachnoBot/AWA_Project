import { 
  Stack, 
  Container, 
  Typography, 
  TextField, 
  Button,
  Alert,
  Link,
} 
from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Register = () => {
  // States for showing errors to user
  const [alertText, setAlertText] = useState("error")
  const [alert, setAlert] = useState(false)

  const navigate = useNavigate();

  const handleRegister = () => {
    // Send email and password to backend for registering
    fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: document.getElementById("emailInput").value,
        password: document.getElementById("passwordInput").value
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        // If successful, set the token to storage and go to page where you can edit account info
        localStorage.setItem("auth_token", data.token)
        navigate("/editInfo")
      } else {
        // If not successful display alert with error message
        setAlertText(data.errmsg)
        setAlert(true)
      }
    })
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h2" align="center" style={{ marginBottom: '25px' }}>
        Match
      </Typography>
      <Stack border={2} borderColor="grey.300" borderRadius={5} p={3}>
        <Typography variant="h5" align="center" gutterBottom>Register</Typography>
          <Typography align='left'>Email address</Typography>
          <TextField
            id='emailInput'
            fullWidth
            margin="normal"
            type="email"
            style={{ marginBottom: '25px' }}
          />
        <Typography align='left'>Password</Typography>
          <TextField
            id='passwordInput'
            fullWidth
            margin="normal"
            type="password"
            style={{ marginBottom: '30px' }}
          />
        <Button variant="contained" color="primary" fullWidth onClick={handleRegister}>
          Register
        </Button>
        <Link href="/login" marginTop={2}>
          {"Already have an account? Sign in"}
        </Link>
      </Stack>
      {alert && <Alert severity='error'>{alertText}</Alert>}
    </Container>
  )
}

export default Register