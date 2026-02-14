import { socket } from "./socket"

export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect()
  }
}

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect()
  }
}

export const joinRoom = (roomCode) => {
  socket.emit("join-room", {roomCode})
}

export const sendMessage = ({ roomCode, message, sender }) => {
  socket.emit("send-message", {
    roomCode,
    message,
    // sender
  })
}


export const receiveMessage = (callback) => {
  socket.off("receive-message")
  socket.on("receive-message", callback)
}

export const removeReceiveMessage = () => {
  socket.off("receive-message")
}

