import ChatInterface from "./Pages/ChatInterface"
import JoinActiveRoom from "./Pages/JoinActiveRoom"
import { Routes, Route } from "react-router-dom"
import SignUpPage from "./Pages/SignUpPage"
import LoginPage from "./Pages/LoginPage"

function App() {
  return (
    <>
      <Routes>
        <Route path="/signup" element= {<SignUpPage />} />
        <Route path="/login" element= {<LoginPage />} />
        <Route path="/join-room" element= {<JoinActiveRoom />} />
        <Route path="/room/:roomId" element= {<ChatInterface />} />
      </Routes>
    </>
  )
}

export default App