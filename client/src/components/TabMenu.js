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

  const handleTabClick = (e) => {
    setValue(e.target.tabIndex);
  }

  const handleLogout = () => {
    localStorage.removeItem("auth_token")
    navigate("/login")
  }

  return (
    <Container
      className='border'
      sx={{
        display: "flex",
        flexDirection: "row",
        paddingY: 0,
        marginBottom: "10px",
        alignItems: "center"
      }}
    >
      <Tabs 
        sx={{flexGrow: 1, '& .MuiTab-root': {color: theme.palette.textColor}}} 
        variant='fullWidth' 
        value={value} 
        onChange={handleTabClick}
      >
        <Tab label="home" tabIndex={0} component={Link} to="/home"></Tab>
        <Tab label="profile" tabIndex={1} component={Link} to="/editinfo"></Tab>
        <Tab label="messages" tabIndex={2} component={Link} to="/messages"></Tab>
      </Tabs>
      <Divider 
        sx={{marginX: 1}} 
        color={theme.palette.dividerColor} 
        orientation='vertical' 
        flexItem
      >
      </Divider>
      <Button
        sx={{minWidth: "fit-content"}} 
        onClick={handleLogout} 
        color="primary"
      >
        Sign out
      </Button>
    </Container>
  )
}

export default TabMenu