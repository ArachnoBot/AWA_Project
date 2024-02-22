import { 
  Stack, 
  Typography, 
  Button,
  Link,
  Divider,
  Box
} from '@mui/material'
import "../App.css"
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@emotion/react';

const Menu = () => {
  const theme = useTheme()
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("auth_token")
    navigate("/login")
  }

  return (
      <Box className="menuBox">
        <Stack className="menuStack"> 
          <Typography variant="h6" color={theme.palette.textColor}>
            Menu
          </Typography>
          <Divider></Divider>
          <Link href="/home">
            <Button color="primary">
              Home
            </Button>
          </Link>
          <Link href="/editinfo">
            <Button color="primary">
              Edit profile
            </Button>
          </Link>
          <Link href="/messages">
            <Button color="primary">
              Messages
            </Button>
          </Link>
          <Link href="/login">
            <Button color="primary" onClick={handleLogout}>
              Sign out
            </Button>
          </Link>
        </Stack>
      </Box>
  )
}

export default Menu