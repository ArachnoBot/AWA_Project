import { 
  Stack, 
  Container, 
  Typography, 
  Divider,
  Avatar,
}

from '@mui/material';
import "../App.css"
import { useTheme } from '@emotion/react';

const UserInfo = (props) => {
  const theme = useTheme()
  const name = props.name
  const bioHead = props.bioHead
  const bioText = props.bioText
  const avatarUrl = props.avatarUrl

  return (
    <Container sx={{padding: 0}}>
      <Stack 
        className='border' 
        sx={{
          padding: "15px", 
          backgroundColor: theme.palette.background.box,
          marginBottom: "10px",
          maxWidth: "800px"
        }}
      >
        <Container sx={{display: "flex", flexDirection: "row", alignItems: "center"}}>
          <Avatar src={avatarUrl} sx={{height: 120, width: 120}}></Avatar>
          <Stack sx={{flexGrow: 1, minWidth: 0, marginLeft: "16px"}}>
            <Typography
              variant="h5" 
              align="center"
              sx={{color: theme.palette.textColor, wordBreak: "break-word"}}
            >
              {name}
            </Typography>
            <Divider color={theme.palette.dividerColor}></Divider>
            <Typography 
              variant="h6" 
              align="center" 
              sx={{marginTop: "8px", color: theme.palette.textColor}}
            >
              {bioHead}
            </Typography>
          </Stack>
        </Container>
        <Typography 
          variant="p" 
          align="center" 
          sx={{marginTop: "8px", color: theme.palette.textColor}}
        >
          {bioText}
        </Typography>
      </Stack>
    </Container>
  )
}

export default UserInfo