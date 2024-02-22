import { 
  Stack, 
  Container, 
  Typography, 
  TextField, 
  Button,
  Box,
  useMediaQuery,
} 
from '@mui/material';
import Menu from "./Menu"
import "../App.css"
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTheme } from '@emotion/react';
import TabMenu from './TabMenu';

const EditInfo = ({alertFunc, setColorTheme, colorTheme}) => {
  const theme = useTheme()
  const desktop = useMediaQuery(theme.breakpoints.up("desktop"))

  // States
  const [name, setName] = useState("")
  const [bioHead, setBioHead] = useState("")
  const [bioText, setBioText] = useState("")

  const navigate = useNavigate()

  useEffect(() => {
    if (!localStorage.getItem("auth_token")) {
      navigate("/login");
      return;
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
        setName(data.name);
        setBioHead(data.bioHead);
        setBioText(data.bioText);
      } else {
        alertFunc("error", data.errmsg)
      }
    });
  }, [navigate, alertFunc]);

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
        alertFunc("success", "Saving successful")
      } else {
        alertFunc("error", data.errmsg)
      }
    })
  }

  const handleThemeChange = () => {
    let newTheme = colorTheme
    if (colorTheme > 1) {
      newTheme = 0
    } else {
      newTheme += 1
    }
    localStorage.setItem("matchTheme", newTheme)
    setColorTheme(newTheme)
  }

  return (
    <Container>
      {!desktop && localStorage.getItem("auth_token") && <TabMenu index={1}></TabMenu>}
      <Box className="contentBox">
          <Stack 
            className='border' 
            sx={{
              padding:"15px", 
              height:"fit-content", 
              width:"100%", 
              maxWidth:"700px"
            }}
          >
            <Typography 
              variant="h5" 
              sx={{ alignSelf:"center", color: theme.palette.textColor, marginBottom: 3 }}>
              Your account's information
            </Typography>
            <Typography align='left' color={theme.palette.textColor}>Username</Typography>
            <TextField
              id='name'
              fullWidth
              margin="normal"
              type="text"
              InputProps={{ sx: { backgroundColor: theme.palette.textFieldBg }}}
              sx={{marginBottom: '25px', '& input': {color: theme.palette.textColor}}}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Typography align='left' color={theme.palette.textColor}>Bio heading</Typography>
            <TextField
              id='bioHead'
              fullWidth
              margin="normal"
              type="text"
              color='warning'
              InputProps={{ sx: { backgroundColor: theme.palette.textFieldBg }}}
              sx={{marginBottom: '25px', '& input': {color: theme.palette.textColor}}}
              value={bioHead}
              onChange={(e) => setBioHead(e.target.value)}
            />
            <Typography align='left' color={theme.palette.textColor}>Bio content</Typography>
            <TextField
              id='bioText'
              multiline
              minRows={2}
              fullWidth
              margin="normal"
              type="text"
              InputProps={{ sx: { backgroundColor: theme.palette.textFieldBg }}}
              sx={{marginBottom: '30px', '& textarea': {color: theme.palette.textColor}}}
              value={bioText}
              onChange={(e) => setBioText(e.target.value)}
            />
            <Container sx={{display:"flex", justifyContent: 'space-evenly'}}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}>
                Save
              </Button>
              <Button
                variant="contained"
                onClick={handleThemeChange}>
                Change theme
              </Button>
            </Container>
          </Stack>
          {desktop && <Menu></Menu>}
      </Box>
    </Container>
  )
}

export default EditInfo