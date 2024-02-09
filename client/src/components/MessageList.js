import { 
  Stack, 
  Typography
} 
from '@mui/material'
import "../App.css"

const MessageList = (props) => {
  let messageList = props.messageList

  const createMessages = () => {
    const reversedList = [...messageList].reverse()
    const msgItems = reversedList.map((item, index) => {
      let alignment = "end"
      let textStyle = {
        padding: "10px",
        borderRadius: "5px",
        margin: "5px",
        backgroundColor: "lightblue"
      }

      if (item.sentByAway) {
        alignment = "start"
        textStyle.backgroundColor = "lightgray"
      }

      return (
        <Typography className="chatMessage" key={index} alignSelf={alignment} style={textStyle}>
          {item.text}
        </Typography>
      )
    })
    return msgItems
  }

  if(messageList) {
    return (
      <Stack flexGrow={1} overflow={"auto"} flexDirection={"column-reverse"}>
        {createMessages()}
      </Stack>
    )
  } else {
    return <Typography alignSelf={"center"}>Loading messages...</Typography>
  }
}

export default MessageList