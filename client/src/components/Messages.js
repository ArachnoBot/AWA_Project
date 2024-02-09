import { 
  Stack, 
  Container, 
  Typography, 
  Box,
  Alert,
  ListItemButton,
  ListItemText,
  List,
  TextField,
  IconButton,
} 
from '@mui/material'
import Menu from "./Menu"
import "../App.css"
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MessageList from './MessageList'
import SendIcon from '@mui/icons-material/Send'

const Messages = () => {
  // States
  const [messageList, setMessageList] = useState()
  const [userList, setUserList] = useState()
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [msgInput, setMsgInput] = useState("")
  const [alertText, setAlertText] = useState("")
  const [severity, setSeverity] = useState("")

  // Navigate for redirects
  const navigate = useNavigate()
  
  useEffect(() => {
    // Send user back to login page if no token found
    if (!localStorage.getItem("auth_token")) {
      navigate("/login")
      return
    }
    getMessageData(0)
  }, [navigate]);

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
    }

    let localMessageList = []
    const awayEmail = localUserList[userIndex].email
    const doc = messageData.messageDoc
    for (const log of doc.log) {
      const sentByAway = awayEmail === doc.group[log.sender]
      localMessageList.push({
        sentByAway: sentByAway,
        text: log.text
      })
    }

    setMessageList(localMessageList)
  }

  const createSideButtons = () => {
    if (userList.length === 0) {
      return <Typography>There are no users you can chat with yet</Typography>
    }

    const listItems = userList.map((user, index) => {
      return (
        <ListItemButton
          key={index}
          selected={selectedIndex === index}
          onClick={(event)=> handleItemClick(event, index)}
        >
          <ListItemText>{user.email}</ListItemText>
        </ListItemButton>
      )
    })
    return listItems
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

  const alertFunc = (severity, text) => {
    setSeverity(severity)
    setAlertText(text)
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
        //setLoaded(false)
      } else {
        alertFunc("error", data.errmsg)
      }
    })
  }

  if (userList) {
    return (
      <Container className='mainContainer'>
        <Typography align='center' variant='h2'>Match</Typography>
        <Box className="contentBox">
          <Stack className="sideButtonStack">
            <List>{createSideButtons()}</List>
          </Stack>
          <Stack className="messageContentStack">
            <MessageList className="messageList" messageList={messageList} alertFunc={alertFunc}/>
            <Box className="sendMessageBox">
              <TextField
                id='msgInput'
                fullWidth
                multiline
                margin="normal"
                type="text"
                value={msgInput}
                onKeyDown={checkForSend}
                onChange={handleKeystroke}
              />
              <IconButton onClick={sendMessage} style={{marginTop:5}}>
                <SendIcon style={{fontSize:30}}/>
              </IconButton>
            </Box>
          </Stack>
          <Menu></Menu>
        </Box>
        {severity !== "" && <Alert severity={severity}>{alertText}</Alert>}
      </Container>
    )
  }
}

export default Messages