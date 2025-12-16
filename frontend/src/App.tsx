import ChatInterface from "./Pages/ChatInterface"
import JoinActiveRoom from "./Pages/JoinActiveRoom"
import { Routes, Route } from "react-router-dom"

function App() {
  return (
    <>
      <Routes>
        <Route path="/join-room" element= {<JoinActiveRoom />} />
        <Route path="/room/:roomId" element= {<ChatInterface />} />
      </Routes>
    </>
  )
}

export default App