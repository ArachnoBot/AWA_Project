import { 
  Stack, 
  Container, 
  Typography, 
  Divider,
}

from '@mui/material';
import "../App.css"
import { useTheme } from '@emotion/react';

const UserInfo = (props) => {
  const theme = useTheme()
  const name = props.name
  const bioHead = props.bioHead
  const bioText = props.bioText

  return (
    <Container sx={{ padding: 0 }}>
      <Stack 
        className='border' 
        sx={{
          padding:"15px", 
          backgroundColor:theme.palette.background.box,
          marginBottom:"10px",
          maxWidth:"800px"
        }}
      >
        <Typography 
          variant="h4" 
          align="center"
          color={theme.palette.textColor}>
          {name}
        </Typography>
        <Divider></Divider>
        <Typography 
          variant="h6" 
          align="center" 
          sx={{ marginTop: "8px", color: theme.palette.textColor}}>
          {bioHead}
        </Typography>
        <Typography 
          variant="p" 
          align="center" 
          sx={{ marginTop: "8px", color: theme.palette.textColor }}>
          {bioText}
        </Typography>
      </Stack>
    </Container>
  )
}

export default UserInfo