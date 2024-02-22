import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login"
import Register from "./components/Register"
import EditInfo from "./components/EditInfo"
import Home from "./components/Home"
import Messages from "./components/Messages"
import lightTheme from "./lightTheme.js"
import darkTheme from "./darkTheme.js"
import blackTheme from "./blackTheme.js"
import { ThemeProvider } from '@emotion/react';
import { Alert, Container, Typography } from '@mui/material';
import { useState } from 'react';

function App() {
  let storedTheme = localStorage.getItem("matchTheme")
  if (storedTheme == null) {
    localStorage.setItem("matchTheme", 0)
  }

  const [alertText, setAlertText] = useState("")
  const [severity, setSeverity] = useState("")
  const [errTimer, setErrTimer] = useState()
  const [colorTheme, setColorTheme] = useState(parseInt(storedTheme))

  let theme = lightTheme
  if (colorTheme == 0) {
    theme = lightTheme
  }
  else if (colorTheme == 1) {
    theme = darkTheme
  }
  else if (colorTheme == 2) {
    theme = blackTheme
  }

  
  // Function for showing alerts
  const alertFunc = (severity, text) => {
    if (errTimer) {
      clearTimeout(errTimer)
    }
    const timer = setTimeout(() => {setSeverity(null)}, 3000)
    setErrTimer(timer)
    setSeverity(severity)
    setAlertText(text)
  }
  
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Container className="App" sx={{backgroundColor: theme.palette.background.main}}>
          <Typography 
            align='center' 
            variant='h3' 
            marginBottom={2} 
            color={theme.palette.textColor}
          >Match</Typography>
            <Routes>
              <Route path="/" element={<Login alertFunc={alertFunc}/>}/>
              <Route path="/login" element={<Login alertFunc={alertFunc}/>}/>
              <Route path="/register" element={<Register alertFunc={alertFunc}/>}/>
              <Route 
                path="/editinfo" 
                element={
                  <EditInfo 
                    alertFunc={alertFunc} 
                    setColorTheme={setColorTheme}
                    
                    colorTheme={colorTheme}
                  />
                }
              />
              <Route path="/home" element={<Home alertFunc={alertFunc}/>}/>
              <Route path="/messages" element={<Messages alertFunc={alertFunc}/>}/>
            </Routes>
            <Container sx={{padding:3, width:"fit-content"}}>
              {severity && <Alert severity={severity}>{alertText}</Alert>}
            </Container>
        </Container>
      </Router>
    </ThemeProvider>
  )


}

export default App;
