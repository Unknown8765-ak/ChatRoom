import { Message } from "../models/chat.model.js";
import { Room } from "../models/room.model.js";

const registerChatSocket = (io, socket) => {

  socket.on("send-message", async ({ roomCode, message }) => {
    console.log(message)
    try {
      
      const room = await Room.findOne({ roomCode });
      if (!room) return;

      const newMessage = await Message.create({
      roomId: room._id,           
      sender: socket.user?._id || "amit", 
      content: message,        
});


      io.to(roomCode).emit("receive-message", {
        _id: newMessage._id,
        content: newMessage.content,
        sender: {
          _id: socket.user._id,
          name: socket.user.name,
        },
        createdAt: newMessage.createdAt,
      });

    } catch (error) {
      console.error("❌ Send message error:", error.message);
    }
  });

};

export default registerChatSocket;
