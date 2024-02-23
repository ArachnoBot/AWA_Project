import { 
  Stack, 
  Container, 
  Typography, 
  TextField, 
  Button,
  Box,
  useMediaQuery,
  Avatar,
  Input,
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
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [bioHead, setBioHead] = useState("")
  const [bioText, setBioText] = useState("")
  const [avatarUrl, setavatarUrl] = useState()

  useEffect(() => {
    if (!localStorage.getItem("auth_token")) {
      navigate("/login");
      return;
    }
    // Get the user's information to show on profile page
    fetch("/api/getUserInfo", {
      method: "GET",
      headers: {
        "authorization": localStorage.getItem("auth_token")
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setName(data.name)
        setBioHead(data.bioHead)
        setBioText(data.bioText)
        setavatarUrl(data.avatarUrl)
      } else {
        alertFunc("error", data.errmsg)
      }
    });
  }, [navigate, alertFunc]);

  const handleSave = () => {
    // Send new user information to the backend to be updated
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

  const handleImageUpload = async (event) => {
    // Send new avatar picture to server and use the avatar url given in response
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('image', file)
    const res = await fetch("/api/addProfilePicture", {
      method: "POST",
      headers: {"authorization": localStorage.getItem("auth_token")},
      body: formData
    })
    const data = await res.json()
    setavatarUrl(data.path)
  }

  const handleThemeChange = () => {
    // Cycle to next theme and save it in localStorage
    let newTheme = colorTheme
    if (colorTheme > 1) {
      newTheme = 0
    } else {
      newTheme += 1
    }
    localStorage.setItem("matchTheme", newTheme)
    setColorTheme(newTheme)
  }

  const handleTextInput = (event) => {
    // Check field value lengths to limit character count
    if (event.target.id === "name" && event.target.value.length < 30) {
      setName(event.target.value)
    }
    else if (event.target.id === "bioHead" && event.target.value.length < 50) {
      setBioHead(event.target.value)
    }
    else if (event.target.id === "bioText" && event.target.value.length < 250) {
      console.log(event.target.value.length)
      setBioText(event.target.value)
    }
  }

  return (
    <Container>
      {!desktop && localStorage.getItem("auth_token") && 
      <TabMenu index={1}></TabMenu>}
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
          <Container 
            sx={{display: "flex", flexDirection: "row", alignItems: "center"}}
          >
            <Avatar 
              src={avatarUrl} 
              sx={{width: 100, height: 100, marginRight: "30px"}}
            ></Avatar>
            <Typography 
              variant="h5" 
              sx={{color: theme.palette.textColor}}
            >
              Your account's information
            </Typography>
          </Container>
          <Container 
            sx={{
              display: "flex", 
              flexDirection: "row", 
              alignItems: "baseline", 
              padding: 0
            }}
          >
            <Typography
              align='left' 
              color={theme.palette.textColor}
              sx={{marginRight: "10px"}}
            >
              Username:
            </Typography>
            <TextField
              id='name'
              fullWidth
              margin="normal"
              type="text"
              InputProps={{sx: {backgroundColor: theme.palette.textFieldBg}}}
              sx={{'& input': {color: theme.palette.textColor}}}
              value={name}
              onChange={handleTextInput}
            />
          </Container>
          <Container 
            sx={{
              display: "flex", 
              flexDirection: "row", 
              alignItems: "center", 
              padding: 0
            }}
          >
            <Typography 
              align='left' 
              color={theme.palette.textColor} 
              sx={{minWidth: "fit-content", marginRight: "10px"}}
            >
              Bio heading:
            </Typography>
            <TextField
              id='bioHead'
              fullWidth
              margin="normal"
              type="text"
              InputProps={{sx: {backgroundColor: theme.palette.textFieldBg}}}
              sx={{
                marginBottom: '5px', 
                '& input': {color: theme.palette.textColor}
              }}
              value={bioHead}
              onChange={handleTextInput}
            />
          </Container>
          <Typography 
            align='left' 
            color={theme.palette.textColor}
          >
            Bio content:
          </Typography>
          <TextField
            id='bioText'
            multiline
            rows={3}
            fullWidth
            margin="normal"
            type="text"
            InputProps={{sx: {backgroundColor: theme.palette.textFieldBg}}}
            sx={{
              marginBottom: '15px', 
              '& textarea': {color: theme.palette.textColor}
            }}
            value={bioText}
            onChange={handleTextInput}
          />
          <Container 
            sx={{display:"flex", justifyContent: 'space-between', padding:0}}
          >
            <Button
              component="label"
              variant="contained"
              sx={{width:"150px"}}
            > 
              Upload avatar
              <Input 
                type="file" 
                sx={{display: "none"}} 
                onChange={handleImageUpload}
              />
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
            >
              Save text
            </Button>
            <Button
              variant="contained"
              onClick={handleThemeChange}
            >
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