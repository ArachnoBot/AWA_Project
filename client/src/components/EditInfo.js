import { 
  Stack, 
  Container, 
  Typography, 
  TextField, 
  Button,
  Box,
  Alert,
} 
from '@mui/material';
import Menu from "./Menu"
import "../App.css"
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const EditInfo = () => {

  const [name, setName] = useState("")
  const [bioHead, setBioHead] = useState("")
  const [bioText, setBioText] = useState("")
  const [alertText, setAlertText] = useState("")
  const [severity, setSeverity] = useState("")

  const navigate = useNavigate()

  useEffect(() => {
    // Send user back to login page if no token found
    if (!localStorage.getItem("auth_token")) {
      navigate("/login")
      return
    }

    fetch("/api/getUserInfo", {
      method: "GET",
      headers: {
        "authorization": localStorage.getItem("auth_token")
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        console.log(data)
        setName(data.name)
        setBioHead(data.bioHead)
        setBioText(data.bioText)
      } else {
        console.log(data.errmsg)
      }
    })

  }, [navigate]);

  const handleSave = () => {
    // Send user info to the backend to be updated
    fetch("/api/updateUserInfo", {
      method: "POST",
      headers: {
        "authorization": localStorage.getItem("auth_token"),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: document.getElementById("name").value,
        bioHead: document.getElementById("bioHead").value,
        bioText: document.getElementById("bioText").value,
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setSeverity("success")
        setAlertText("Saving successful")
      } else {
        setSeverity("error")
        setAlertText(data.errmsg)
      }
    })
  }

  return (
    <Container className="mainContainer">
      <Typography align='center' variant='h2'>Match</Typography>
      <Box marginBottom={3} className="contentBox">
          <Stack
          border={2} 
          borderColor="grey.300" 
          borderRadius={5} 
          p={3}
          className='accountInfo'>
            <Typography variant="h5" align="center" style={{ marginBottom: '25px' }}>
              Your account's information
            </Typography>

            <Typography align='left'>Username</Typography>
            <TextField
              id='name'
              fullWidth
              margin="normal"
              type="text"
              style={{ marginBottom: '25px' }}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Typography align='left'>Bio heading</Typography>
            <TextField
              id='bioHead'
              fullWidth
              margin="normal"
              type="text"
              style={{ marginBottom: '25px' }}
              value={bioHead}
              onChange={(e) => setBioHead(e.target.value)}
              />
            
            <Typography align='left'>Bio content</Typography>
            <TextField
              id='bioText'
              multiline
              fullWidth
              margin="normal"
              type="text"
              style={{ marginBottom: '30px' }}
              value={bioText}
              onChange={(e) => setBioText(e.target.value)}
            />

            <div align="center">
              <Button variant="contained" color="primary" onClick={handleSave}>
                Save
              </Button>
            </div>
          </Stack>
          <Menu></Menu>
      </Box>
      {severity !== "" && <Alert severity={severity}>{alertText}</Alert>}
    </Container>
  )
}

export default EditInfo