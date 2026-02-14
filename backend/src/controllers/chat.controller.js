import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Message } from "../models/chat.model.js";
import { Room } from "../models/room.model.js";



const sendMessage = asyncHandler(async (req, res) => {
  const { roomCode, message } = req.body;

  if (!roomCode || !text) {
    throw new ApiError(400, "RoomCode and text required");
  }

  const room = await Room.findOne({ roomCode });

  if (!room) {
    throw new ApiError(404, "Room not found");
  }

  res.status(201).json({
    success: true,
    message,
  });
});

const getRoomMessages = asyncHandler(async (req, res) => {
    const { roomId } = req.params;

    if(!roomId){
        throw new ApiError(400, "RoomId required");
    }

    const messages = await Message.find({ roomId })
        .populate("sender", "name email")
        .sort({ createdAt: 1 });

    if (!messages){
        throw new ApiError(400, "message is required")};

    res.json({
        success: true,
        messages,
    });
});


export {
    sendMessage,
    getRoomMessages
}