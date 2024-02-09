import { 
  Stack, 
  Container, 
  Typography, 
  Box,
  Divider,
}

from '@mui/material';
import "../App.css"

const UserInfo = (props) => {
  const name = props.name
  const bioHead = props.bioHead
  const bioText = props.bioText

  return (
    <Container>
      <Box display={"flex"}>
        <Stack 
        border={2} 
        borderColor="grey.300" 
        borderRadius={5} 
        p={3}
        className='userInfoBox'>
          <Typography variant="h4" align="center" style={{ marginBottom: '25px' }}>
            {name}
          </Typography>
          <Divider></Divider>
          <Typography variant="h6" align="center" style={{ marginBottom: '25px' }}>
            {bioHead}
          </Typography>
          <Typography variant="p" align="center" style={{ marginBottom: '25px' }}>
            {bioText}
          </Typography>
        </Stack>
      </Box>
    </Container>
  )
}

export default UserInfo