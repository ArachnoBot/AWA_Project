import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login"
import Register from "./components/Register"
import EditInfo from "./components/EditInfo"
import Home from "./components/Home"
import Messages from "./components/Messages"

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/editinfo" element={<EditInfo/>}/>
          <Route path="/home" element={<Home/>}/>
          <Route path="/messages" element={<Messages/>}/>
        </Routes>
      </div>
    </Router>
  )
}

export default App;
