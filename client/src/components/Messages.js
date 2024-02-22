import { 
  Stack, 
  Container, 
  Typography, 
  Box,
  ListItemButton,
  ListItemText,
  List,
  TextField,
  IconButton,
  useMediaQuery,
} 
from '@mui/material'
import Menu from "./Menu"
import "../App.css"
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MessageList from './MessageList'
import SendIcon from '@mui/icons-material/Send'
import { useTheme } from '@emotion/react'
import TabMenu from './TabMenu'

const Messages = ({alertFunc}) => {
  const theme = useTheme()
  const desktop = useMediaQuery(theme.breakpoints.up("desktop"))
  
  // States
  const [messageList, setMessageList] = useState()
  const [userList, setUserList] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [msgInput, setMsgInput] = useState("")

  // Navigate for redirects
  const navigate = useNavigate()

  useEffect(() => {
    // Send user back to login page if no token found
    if (!localStorage.getItem("auth_token")) {
      navigate("/login")
      return
    }
    if (userList.length === 0) {
      getMessageData(0);
    }
    let messageCheckTimer = setInterval(async () => {
        checkForNewMessages();
    }, 3000)
    return () => {clearInterval(messageCheckTimer)}
  }, [navigate])

  const checkForNewMessages = async () => {
    const res = await fetch("/api/checkNewMessages", {
      headers: {
        "authorization": localStorage.getItem("auth_token")
      }
    })
    const data = await res.json()
    if (data.hasNewMessages) {
      getMessageData(selectedIndex)
      console.log("new messages found")
    }
    else if(!data.success) {
      alertFunc("error", data.errmsg)
    }
  }

  const getMessageData = async (userIndex) => {
    let localUserList = []
    const userRes = await fetch("/api/getMessageUsers", {
      headers: {
        "authorization": localStorage.getItem("auth_token")
      }
    })
    const userData = await userRes.json() 
    if (userData.success) {
      setUserList(userData.users)
      localUserList = userData.users
    } else {
      alertFunc("error", userData.errmsg)
    }
    if (localUserList.length === 0) {
      return
    }
    const messageRes = await fetch("/api/getMessages", {
      method: "POST",
      headers: {
        "authorization": localStorage.getItem("auth_token"),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        secondUser: localUserList[userIndex].email
      })
    })
    const messageData = await messageRes.json()
    if (!messageData.success) {
      console.log("failed to get messages")
      return
    } else if (messageData.messageDoc == null) {
      setMessageList(null)
      return
    }
    let localMessageList = []
    const awayEmail = localUserList[userIndex].email
    const doc = messageData.messageDoc
    for (const log of doc.log) {
      const sentByAway = awayEmail === doc.group[log.sender]
      console.log(log.timestamp)
      const dateString = new Date(log.timestamp).toLocaleString('en-GB')
      localMessageList.push({
        sentByAway: sentByAway,
        text: log.text,
        timestamp: dateString
      })
    }
    setMessageList(localMessageList)
  }

  const createSideButtons = () => {
    if (userList.length === 0) {
      return (
        <Typography color={theme.palette.textColor}>
          There are no users you can chat with yet
        </Typography>
      )
    }
    const listItems = userList.map((user, index) => {
      const username = user.email.split("@")[0]
      return (
        <ListItemButton
          key={index}
          selected={selectedIndex === index}
          onClick={(event)=> handleItemClick(event, index)}
        >
          <ListItemText 
            sx={{wordBreak:"break-word", padding:1, color: theme.palette.textColor}}>
            {username}
          </ListItemText>
        </ListItemButton>
      )
    })
    return (<Stack>{listItems}</Stack>)
  }

  const handleItemClick = (event, index) => {
    getMessageData(index)
    setSelectedIndex(index)
  }

  const checkForSend = (event) => {
    if (event.key === "Enter" && msgInput.length > 0) {
      sendMessage()
    }
  }

  const handleKeystroke = (event) => {
    console.log()
    if (event.nativeEvent.inputType !== "insertLineBreak") {
      setMsgInput(event.target.value)
    }
  }

  const sendMessage = () => {
    fetch("/api/sendMessage", {
      method: "POST",
      headers: {
        "authorization": localStorage.getItem("auth_token"),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        secondUser: userList[selectedIndex].email,
        msgText: msgInput
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        getMessageData(selectedIndex)
        setMsgInput("")
      } else {
        alertFunc("error", data.errmsg)
      }
    })
  }

  if (userList && desktop) {
    return (
      <Container sx={{display:"flex", flexDirection:"row",  maxWidth:"900px", height:"80%", maxHeight:"80%"}}>
        <Stack sx={{flexGrow:1, maxHeight:"100%"}} className='shitstack'>
          <Stack className="messageContentStack" >
              <MessageList messageList={messageList} alertFunc={alertFunc}/>
              <Box className="sendMessageBox">
                <TextField
                  color="primary"
                  id='msgInput'
                  fullWidth
                  multiline
                  margin="normal"
                  type="text"
                  InputProps={{ sx: { backgroundColor: theme.palette.textFieldBg }}}
                  sx={{'& textarea': {color: theme.palette.textColor}}}
                  value={msgInput}
                  onKeyDown={checkForSend}
                  onChange={handleKeystroke}
                />
                <IconButton onClick={sendMessage} style={{marginTop:5}}>
                  <SendIcon sx={{fontSize:30, color: theme.palette.iconColor}}/>
                </IconButton>
              </Box>
            </Stack>
        </Stack>
        <Stack>
          <Menu></Menu>
          <Stack className="sideButtonStack">
            <List>{createSideButtons()}</List>
          </Stack>
        </Stack>
        
      </Container>
    )
  } else if (userList && !desktop) {
    return (
      <Container sx={{display:"flex", flexDirection:"column", height:"80%", maxHeight:"80%"}}>
        <TabMenu index={2}></TabMenu>
        <Stack sx={{flexGrow:1, maxHeight:"100%"}}>
          <Stack className='messageContentStack' sx={{maxHeight:"70%"}}>
            <MessageList messageList={messageList} alertFunc={alertFunc}/>
            <Box className="sendMessageBox">
            <TextField
              id='msgInput'
              fullWidth
              multiline
              margin="normal"
              type="text"
              InputProps={{ sx: { backgroundColor: theme.palette.textFieldBg }}}
              sx={{'& textarea': {color: theme.palette.textColor}}}
              value={msgInput}
              onKeyDown={checkForSend}
              onChange={handleKeystroke}
            />
              <IconButton onClick={sendMessage} style={{marginTop:5}}>
                <SendIcon sx={{fontSize:30, color: theme.palette.iconColor}}/>
              </IconButton>
            </Box>
          </Stack>
          <Stack className="underButtonStack">
            <List>{createSideButtons()}</List>
          </Stack>
        </Stack>
      </Container>
    )
  }
}

export default Messages