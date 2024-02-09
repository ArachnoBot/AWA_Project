import { 
  Stack, 
  Container, 
  Typography, 
  Box,
  IconButton,
  Alert,
} 
from '@mui/material';
import Menu from "./Menu"
import "../App.css"
import ThumbDown from "@mui/icons-material/ThumbDown"
import { ThumbUp } from "@mui/icons-material"
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserInfo from './UserInfo';

const Home = () => {
  // States
  const [name, setName] = useState("")
  const [bioHead, setBioHead] = useState("")
  const [bioText, setBioText] = useState("")
  const [likeEmail, setLikeEmail] = useState("")
  const [alertText, setAlertText] = useState("")
  const [severity, setSeverity] = useState("")

  const navigate = useNavigate();

  useEffect(() => {
    // Send user back to login page if no token found
    if (!localStorage.getItem("auth_token")) {
      navigate("/login")
    }

    getRandomUser()
  }, [navigate]);

  const handleLike = () => {
    fetch("/api/addLikes", {
      method: "POST",
      headers: {
        "authorization": localStorage.getItem("auth_token"),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: likeEmail,
        choice: "like"
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        getRandomUser()
      } else {
        setSeverity("error")
        setAlertText(data.errmsg)
      }
    })
  }
  
  const handleDislike = () => {
    fetch("/api/addLikes", {
      method: "POST",
      headers: {
        "authorization": localStorage.getItem("auth_token"),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: likeEmail,
        choice: "dislike"
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        getRandomUser()
      } else {
        setSeverity("error")
        setAlertText(data.errmsg)
      }
    })
  }

  const getRandomUser = () => {
    fetch("/api/getRandomUser", {
      method: "GET",
      headers: {
        "authorization": localStorage.getItem("auth_token"),
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        if (data.email) {
          setLikeEmail(data.email)
          setName(data.name)
          setBioHead(data.bioHead)
          setBioText(data.bioText)
        } else {
          setLikeEmail("")
          setName("")
          setBioHead("No more new users, try again later")
          setBioText("")
        }
      } else {
        setSeverity("error")
        setAlertText(data.errmsg)
      }
    })
  }

  return (
    <Container className='mainContainer'>
      <Typography align='center' variant='h2'>Match</Typography>
      <Box className="contentBox">
        <Stack className='homeStack'>
          <UserInfo name={name} bioHead={bioHead} bioText={bioText}/>
          <Box
          display={"flex"}
          flexDirection={"row"}
          justifyContent={"space-evenly"}
          height={"fit-content"}
          p={3}
          >
            <IconButton onClick={handleLike} color='primary'>
                <ThumbUp style={{fontSize:50}}/>
            </IconButton>
            <IconButton onClick={handleDislike} style={{color:"red"}}>
                <ThumbDown style={{fontSize:50}}/>
            </IconButton>
          </Box>
        </Stack>
        <Menu></Menu>
      </Box>
      {severity !== "" && <Alert severity={severity}>{alertText}</Alert>}
    </Container>
  )
}

export default Home