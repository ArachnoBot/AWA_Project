import { 
  Stack, 
  Container, 
  Box,
  IconButton,
  useMediaQuery,
}
from '@mui/material';
import Menu from "./Menu"
import "../App.css"
import ThumbDown from "@mui/icons-material/ThumbDown"
import { ThumbUp } from "@mui/icons-material"
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserInfo from './UserInfo';
import { useTheme } from '@emotion/react';
import TabMenu from './TabMenu';

const Home = ({alertFunc}) => {
  const theme = useTheme()
  const desktop = useMediaQuery(theme.breakpoints.up("desktop"))
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [bioHead, setBioHead] = useState("")
  const [bioText, setBioText] = useState("")
  const [likeEmail, setLikeEmail] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")

  useEffect(() => {
    // Send user back to login page if no token found
    if (!localStorage.getItem("auth_token")) {
      navigate("/login")
    }
    getRandomUser()
  }, [navigate]);

  const handleLike = (choice) => {
    // Tell the server you have liked/disliked a user
    fetch("/api/addLikes", {
      method: "POST",
      headers: {
        "authorization": localStorage.getItem("auth_token"),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({email: likeEmail, choice: choice})
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        getRandomUser()
      } else {
        alertFunc("error", data.errmsg)
      }
    })
  }
  
  const getRandomUser = () => {
    // Get random user from server to show on homepage
    fetch("/api/getRandomUser", {
      method: "GET",
      headers: {"authorization": localStorage.getItem("auth_token")}
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        if (data.email) {
          setLikeEmail(data.email)
          setName(data.name)
          setBioHead(data.bioHead)
          setBioText(data.bioText)
          setAvatarUrl(data.avatarUrl)
        } else {
          setLikeEmail("")
          setName("")
          setBioHead("No more new users, try again later")
          setBioText("")
          setAvatarUrl("")
        }
      } else {
        alertFunc("error", data.errmsg)
      }
    })
  }

  return (
    <Container>
      {!desktop && localStorage.getItem("auth_token") &&
      <TabMenu index={0}></TabMenu>}
      <Box className="contentBox">
        <Stack 
          className='border' 
          sx={{maxWidth:"800px", flexGrow:1, padding:"15px"}}
        >
          <UserInfo 
            name={name} 
            bioHead={bioHead} 
            bioText={bioText} 
            avatarUrl={avatarUrl}
          />
          <Box
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"space-evenly"}
            height={"fit-content"}
            p={1}
          >
            <IconButton onClick={()=>{handleLike("like")}} color='primary'>
              <ThumbUp style={{fontSize:50}}/>
            </IconButton>
            <IconButton onClick={()=>{handleLike("dislike")}} color="secondary">
              <ThumbDown style={{fontSize:50}}/>
            </IconButton>
          </Box>
        </Stack>
        {desktop && <Menu></Menu>}
      </Box>
    </Container>
  )
}

export default Home