// import React, { useEffect, useState } from "react"
// import { useParams } from "react-router-dom"
// import { useDispatch, useSelector } from "react-redux"

// import { socket } from "../socket/socket"
// import {
//   joinRoom,
//   sendMessage as sendSocketMessage,
//   receiveMessage,
//   removeReceiveMessage
// } from "../socket/socketEvents"

// import Input from "../components/Input"
// import Button from "../components/Button"

// import {
//   addMessage,
//   setChatRoom
// } from "../features/chat/chatSlice"

// function ChatRoom() {
//   const { roomCode } = useParams()
//   const dispatch = useDispatch()
//   const { messages } = useSelector((state) => state.chat)
//   const { userData } = useSelector((state) => state.auth)
//   const [message, setMessage] = useState("")

//   useEffect(() => {
//     // 🔌 connect socket
//     if (!socket.connected) {
//       socket.connect()
//     }

//     dispatch(setChatRoom(roomCode))

//     joinRoom(roomCode)

//     // 📩 receive messages
//     receiveMessage((data) => {
//       dispatch(addMessage(data))
//     })

//     return () => {
//       // ❌ cleanup
//       removeReceiveMessage()
//       socket.emit("leave-room", {roomCode})
//       // socket.disconnect()
//     }
//   }, [roomCode, dispatch])

//   const handleSendMessage = (e) => {
//     e.preventDefault()
//     if (!message.trim()) return

//     // sendSocketMessage({
//     //   roomCode,
//     //   message,
//     //   sender: userData?.name || "Anonymous"
//     // })

//     sendSocketMessage({
//       roomCode,
//       message,
//       senderId: socket.id,          // 👈 UI ke liye
//       senderName: userData?.name || "Anonymous" // 👈 display ke liye
// })

//     setMessage("")
//   }

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-100">

//       {/* Header */}
//       <div className="bg-blue-600 text-white p-4 text-center font-semibold">
//         Room ID : {roomCode}
//       </div>

//       {/* Messages */}
//       <div className="flex-1 p-4 overflow-y-auto">
//         {messages.length === 0 && (
//           <p className="text-center text-gray-500">
//             No messages yet. Start chatting 🚀
//           </p>
//         )}

//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             className={`mb-2 p-2 rounded shadow w-fit max-w-xs ${
//               msg.senderId === socket.id

//                 ? "ml-auto bg-blue-500 text-white"
//                 : "bg-white"
//             }`}
//           >
//             <b>{msg.sender}</b>
//             <p>{msg.message}</p>
//           </div>
//         ))}
//       </div>

//       {/* Input */}
//       <form
//         onSubmit={handleSendMessage}
//         className="flex gap-2 p-4 bg-white border-t"
//       >
//         <Input
//           type="text"
//           placeholder="Type a message..."
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           className="flex-1"
//         />

//         <Button type="submit">
//           Send
//         </Button>
//       </form>
//     </div>
//   )
// }

// export default ChatRoom
