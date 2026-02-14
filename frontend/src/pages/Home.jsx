import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import { logout } from "../features/auth/authSlice"


function Home() {
  // const authStatus = useSelector((state) => state.auth.status)
  const { status: authStatus, loading } = useSelector(
    (state) => state.auth
  )
  const navigate = useNavigate()
  const dispatch = useDispatch()
  console.log("AUTH STATE 👉", authStatus)
  if (loading) {
    return (
      <div className="w-full py-16 text-center">
        Loading...
      </div>
    )
  }
  async function handleLogout(){
    try {
      const response = await fetch("http://localhost:8000/api/v1/users/logout", {
        method: "POST",
        credentials: "include",
      });

    const data = await response.json()

    dispatch(logout());
    navigate("/");
    } catch (error) {
          dispatch(logout());
          navigate("/");

      
    }
  }

  return (
  <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-600 via-purple-600 to-pink-500 px-4">
    
    <div className="bg-white/10 backdrop-blur-lg shadow-2xl rounded-3xl p-10 w-full max-w-lg text-center border border-white/20">
      
      <h1 className="text-4xl font-extrabold text-white mb-4 tracking-wide">
        🚀 Welcome to ChatRoom
      </h1>

      {loading ? (
        <div className="text-white text-lg animate-pulse">
          Loading...
        </div>
      ) : !authStatus ? (
        <>
          <p className="text-white/80 mb-8 text-lg">
            Login or Signup to create or join a room
          </p>

          <div className="flex justify-center gap-4">
            <Button
              onClick={() => navigate("/login")}
              bgColor="bg-black/70 text-white hover:bg-black"
            >
              Login
            </Button>

            <Button
              onClick={() => navigate("/signup")}
              bgColor="bg-black/70 text-white hover:bg-black"
            >
              Signup
            </Button>
          </div>
        </>
      ) : (
        <>
          <p className="text-white/80 mb-8 text-lg">
            Start chatting now 🔥
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              bgColor="bg-green-500 hover:bg-green-600 text-white"
              onClick={() => navigate("/create-room")}
            >
              Create Room
            </Button>

            <Button
              bgColor="bg-purple-500 hover:bg-purple-600 text-white"
              onClick={() => navigate("/join-room")}
            >
              Join Room
            </Button>

            <Button
              bgColor="bg-red-500 hover:bg-red-600 text-white"
              onClick={async () => {
                await handleLogout();
                navigate("/");
              }}
            >
              Logout
            </Button>
          </div>
        </>
      )}
    </div>
  </div>
)

}

export default Home
