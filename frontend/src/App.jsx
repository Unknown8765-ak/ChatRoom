import { BrowserRouter, Routes, Route } from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute"
import AuthLoader from "./components/AuthLoader"


import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import CreateRoom from "./pages/CreateRoom"
import JoinRoom from "./pages/JoinRoom"
import MessagingRoom from "./pages/MessagingRoom"
import { useSelector } from "react-redux"

function App() {
  return (
    <BrowserRouter>
    <AuthLoader>
      {/* Public Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/create-room" element={<CreateRoom />} />
          <Route path="/join-room" element={<JoinRoom />} />
          <Route path="/room/:roomCode" element={<MessagingRoom />} />
        </Route>
      </Routes>
      </AuthLoader>
    </BrowserRouter>
  )
}

export default App
