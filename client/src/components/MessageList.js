import { 
  Stack, 
  Typography
} 
from '@mui/material'
import "../App.css"
import { useTheme } from '@emotion/react'

const MessageList = (props) => {
  const theme = useTheme()
  let messageList = props.messageList

  const createMessages = () => {
    const reversedList = [...messageList].reverse()
    const msgItems = reversedList.map((item, index) => {
      let alignment = "end"
      let boxStyle = {
        maxWidth:"90%",
        padding: "10px",
        borderRadius: "5px",
        margin: "5px",
        backgroundColor: theme.palette.message.home
      }
      if (item.sentByAway) {
        alignment = "start"
        boxStyle.backgroundColor = theme.palette.message.away
      }
      return (
        <Stack key={index} alignSelf={alignment} sx={boxStyle}>
          <Typography 
            variant='p'
            alignSelf={alignment}
            sx={{wordBreak: "break-word", color: theme.palette.textColor}}>
          {item.text}
          </Typography>
          <Typography 
            variant='p' 
            fontSize={11}
            alignSelf={alignment}
            color={theme.palette.message.time}
          >{item.timestamp}</Typography>
        </Stack>
      )
    })
    return msgItems
  }

  if(messageList) {
    return (
      <Stack 
        sx={{
          display: "flex", 
          flexDirection: "column-reverse", 
          overflowY: "auto", 
          height: "100%",
          maxHeight: "100%"
        }}>
        {createMessages()}
      </Stack>
    )
  } else {
    return (
      <Typography alignSelf={"center"} color={theme.palette.textColor}>No messages</Typography>
    )
  }
}

export default MessageList