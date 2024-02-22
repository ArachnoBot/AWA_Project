import { 
  Divider,
  Tabs,
  Tab,
  Button,
  Container
} from '@mui/material'
import "../App.css"
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useTheme } from '@emotion/react';

const TabMenu = (props) => {
  const navigate = useNavigate()
  const theme = useTheme()
  const [value, setValue] = useState(props.index);

  const handleInput = (e) => {
    setValue(e.target.tabIndex);
  }

  const handleLogout = () => {
    localStorage.removeItem("auth_token")
    navigate("/login")
  }

  return (
    <Container sx={{display:"flex"}} className='tabMenuContainer'>
        <Tabs sx={{flexGrow:1, '& .MuiTab-root': {color: theme.palette.textColor},}} 
          variant='fullWidth' value={value} onChange={handleInput}>
          <Tab label="home" tabIndex={0} component={Link} to="/home"></Tab>
          <Tab label="profile" tabIndex={1} component={Link} to="/editinfo"></Tab>
          <Tab label="messages" tabIndex={2} component={Link} to="/messages"></Tab>
        </Tabs>
        <Divider sx={{marginX:1}} orientation='vertical' flexItem></Divider>
        <Button
          sx={{minWidth:"fit-content"}} 
          onClick={handleLogout} 
          color="primary">
        Sign out</Button>
    </Container>
  )
}

export default TabMenu