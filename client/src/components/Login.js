import { 
  Stack, 
  Container, 
  Typography, 
  TextField, 
  Button,
  Link,
  Alert
} 
from '@mui/material';
import "../App.css"
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Login = () => {

  // States for showing errors to user
  const [alertText, setAlertText] = useState("error")
  const [alert, setAlert] = useState(false)

  const navigate = useNavigate();

  const handleLogin = () => {
    // Send email and password to backend for login
    fetch("/api/login", {
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
      console.log(data)
      if (data.success) {
        localStorage.setItem("auth_token", data.token)
        console.log(localStorage.getItem("auth_token"))
        navigate("/home")
      } else {
        // If not successful display alert with error message
        setAlertText(data.errmsg)
        setAlert(true)
      }
    })
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h2" align="center" style={{ marginBottom: '25px' }}>Match</Typography>
      <Stack border={2} borderColor="grey.300" borderRadius={5} p={3}>
        <Typography variant="h5" align="center" gutterBottom>Sign In</Typography>
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
        <Button variant="contained" color="primary" fullWidth onClick={handleLogin}>
          Sign In
        </Button>
        <Link href="/register" marginTop={2}>
          {"Don't have an account? Sign Up"}
        </Link>
      </Stack>
      {alert && <Alert severity='error'>{alertText}</Alert>}
    </Container>
  )
}

export default Login