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
  Avatar,
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
  
  const [messageList, setMessageList] = useState()
  const [userList, setUserList] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [msgInput, setMsgInput] = useState("")
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
      headers: {"authorization": localStorage.getItem("auth_token")}
    })
    const data = await res.json()
    // If hasNewMessages flag is true, get messages again from server
    if (data.hasNewMessages) {
      getMessageData(selectedIndex)
    }
    else if(!data.success) {
      alertFunc("error", data.errmsg)
    }
  }

  const getMessageData = async (userIndex) => {
    // Get the users you can chat with
    let localUserList = []
    const userRes = await fetch("/api/getMessageUsers", {
      headers: {"authorization": localStorage.getItem("auth_token")}
    })
    const userData = await userRes.json() 
    if (userData.success) {
      setUserList(userData.users)
      localUserList = userData.users
    } else {
      alertFunc("error", userData.errmsg)
    }
    // If nobody found, stop here
    if (localUserList.length === 0) {
      return
    }
    // Otherwise get messages from user in user list with parameter index
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
    // Handle unexpected data
    if (!messageData.success) {
      alertFunc("error", messageData.errmsg)
      return
    } else if (messageData.messageDoc == null) {
      setMessageList(null)
      return
    }
    // Create the data that will be send to MessageList to render the messages
    let localMessageList = []
    const awayEmail = localUserList[userIndex].email
    const doc = messageData.messageDoc
    for (const log of doc.log) {
      // Check who sent the message
      const sentByAway = awayEmail === doc.group[log.sender]
      // Format time to easily readable form
      const dateString = new Date(log.timestamp).toLocaleString('en-GB')
      localMessageList.push({
        sentByAway: sentByAway,
        text: log.text,
        timestamp: dateString
      })
    }
    setMessageList(localMessageList)
  }

  const createUserList = () => {
    // Inform user if there is nobody to chat with
    if (userList.length === 0) {
      return (
        <Typography color={theme.palette.textColor}>
          There are no users you can chat with yet
        </Typography>
      )
    }
    // Create a list of buttons with usernames and avatars
    const listItems = userList.map((user, index) => {
      return (
        <ListItemButton
          key={index} 
          selected={index === selectedIndex}
          onClick={(event)=> handleItemClick(event, index)}
          sx={{paddingX: "5px", paddingY: 0, minWidth: "fit-content"}}
        >
          <Avatar src={user.avatarFile} sx={{height: 32, width: 32}}></Avatar>
          <ListItemText
            sx={{
              wordBreak: "break-word",
              padding: 1, 
              color: theme.palette.textColor
            }}
          >
            {user.name}
          </ListItemText>
        </ListItemButton>
      )
    })
    return (<Stack>{listItems}</Stack>)
  }

  const handleItemClick = async (event, index) => {
    getMessageData(index)
    setSelectedIndex(index)
  }

  const checkForSend = (event) => {
    if (event.key === "Enter" && msgInput.length > 0) {
      sendMessage()
    }
  }

  const handleKeystroke = (event) => {
    if (event.nativeEvent.inputType !== "insertLineBreak") {
      setMsgInput(event.target.value)
    }
  }

  const sendMessage = () => {
    // Send receiver email and message content to backend
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
        // If successful get messages again and clear input box content
        getMessageData(selectedIndex)
        setMsgInput("")
      } else {
        alertFunc("error", data.errmsg)
      }
    })
  }
  
  if (desktop) {
    return (
      <Container 
        sx={{
          display: "flex", 
          flexDirection: "row",  
          maxWidth: "900px", 
          flexGrow: 1,
          minHeight: "310px",
          paddingBottom: "16px"
        }}
      >
        <Stack sx={{flexGrow: 1}}>
          <Stack 
            className='border' 
            sx={{
              padding: "15px", 
              justifyContent: "flex-end", 
              minHeight: 0, 
              flexGrow: 1
            }}
          >
            <MessageList 
              messageList={messageList} 
              alertFunc={alertFunc}
            />
            {userList.length !== 0 && 
            <Box sx={{display: "flex", flexDirection: "row", alignItems: "center"}}>
              <TextField
                color="primary"
                id='msgInput'
                fullWidth
                multiline
                margin="normal"
                type="text"
                InputProps={{sx: {backgroundColor: theme.palette.textFieldBg}}}
                sx={{'& textarea': {color: theme.palette.textColor}}}
                value={msgInput}
                onKeyDown={checkForSend}
                onChange={handleKeystroke}
              />
              <IconButton onClick={sendMessage} style={{marginTop: 5}}>
                <SendIcon sx={{fontSize: 30, color: theme.palette.iconColor}}/>
              </IconButton>
            </Box>}
          </Stack>
        </Stack>
        <Stack>
          <Menu></Menu>
          <Stack
            className="border"
            sx={{
              padding: "10px", 
              marginLeft: "10px", 
              marginTop: "10px", 
              overflowY: "auto",
              flexGrow: 1,
              width: "180px"
            }}
          >
            <List>{createUserList()}</List>
          </Stack>
        </Stack>
      </Container>
    )
  } else {
    return (
      <Container 
        sx={{
          display: "flex", 
          flexDirection: "column",
          flexGrow: 1,
          minHeight: "400px"
        }}
      >
        <TabMenu index={2}></TabMenu>
        <Stack sx={{flexGrow: 1, minHeight: 0}}>
          <Stack 
            className='border' 
            sx={{
              padding: "15px", 
              justifyContent: "flex-end", 
              minHeight: 0, 
              flexGrow: 1
            }}
          >
            <MessageList messageList={messageList} alertFunc={alertFunc}/>
            <Box sx={{display: "flex", flexDirection: "row", alignItems: "center"}}>
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
              <IconButton onClick={sendMessage} style={{marginTop: 5}}>
                <SendIcon sx={{fontSize: 30, color: theme.palette.iconColor}}/>
              </IconButton>
            </Box>
          </Stack>
          <Stack
            className="border"
            sx={{
              padding: "10px",
              marginY: "10px",
              overflowY: "auto",
              height: "100px",
              minHeight: "100px"
            }}
          >
            <List>{createUserList()}</List>
          </Stack>
        </Stack>
      </Container>
    )
  }
}

export default Messages