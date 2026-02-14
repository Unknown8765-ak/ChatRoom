import { Room } from "../models/room.model.js";
import { ApiError } from "../utils/ApiError.js";
import {asyncHandler} from "../utils/asyncHandler.js";

const createRoom = asyncHandler(async (req, res) => {
  const { name, roomCode } = req.body;

  if (!name || !roomCode) {
    throw new ApiError(400, "All fields are required");
  }

  const existingRoom = await Room.findOne({ roomCode });
  if (existingRoom) {
    throw new ApiError(409, "Room code already exists");
  }


  const room = await Room.create({
    name,
    roomCode,
    createdBy: req.user._id,
    participants: [req.user._id],
    isActive: true,
  });

  res.status(201).json({
    success: true,
    room,
    // isActive
  });
});



 
// const joinRoom = asyncHandler(async (req, res) => {
//   const { roomCode } = req.params;

//   if (!roomCode) {
//     throw new ApiError(400, "RoomCode is required");
//   }

//   const userId = req.user._id;

//   const room = await Room.findOne({ roomCode });

//   if (!room) {
//     throw new ApiError(404, "Room not found");
//   }

//   if (!room.isActive) {
//     throw new ApiError(410, "Room is inactive");
//     // 410 = Gone (perfect HTTP status)
//   }

//   const isAlreadyParticipant = room.participants.some(
//     (id) => id.toString() === userId.toString()
//   );

//   if (isAlreadyParticipant) {
//     return res.status(200).json({
//       success: true,
//       alreadyJoined: true,
//       message: "You are already a participant of this room",
//       roomId: room._id,
//       roomCode: room.roomCode,
//     });
//   }

//   room.participants.push(userId);
//   await room.save();

//   return res.status(200).json({
//     success: true,
//     alreadyJoined: false,
//     message: "Joined room successfully",
//     roomId: room._id,
//     roomCode: room.roomCode,
//   });
// });

const joinRoom = asyncHandler(async (req, res) => {
  const { roomCode } = req.params;
  const userId = req.user._id;

  if (!roomCode) {
    throw new ApiError(400, "Room code is required");
  }

  // 1️⃣ room find karo
  const room = await Room.findOne({ roomCode });

  // ❌ room exist hi nahi karta
  if (!room || !room.isActive) {
    throw new ApiError(404, "Room not found or inactive");
  }

  // 2️⃣ already joined?
  const isAlreadyParticipant = room.participants.some(
    (id) => id.toString() === userId.toString()
  );

  if (isAlreadyParticipant) {
    return res.status(200).json({
      success: true,
      alreadyJoined: true,
      message: "You are already a participant",
      roomCode: room.roomCode,
    });
  }

  // 3️⃣ add participant
  room.participants.push(userId);
  await room.save();

  return res.status(200).json({
    success: true,
    alreadyJoined: false,
    message: "Joined room successfully",
    roomCode: room.roomCode,
  });
});



 
const leaveRoom = asyncHandler(async (req, res) => {
    const { roomCode } = req.params;

    const room = await Room.findByIdAndUpdate(
        roomCode,
        { $pull: { members: req.user._id } },
        { new: true }
    );

    if (!room) {
        throw new ApiError(404, "Room not found");
    }

    res.json({
        success: true,
        message: "Left room successfully",
        room,
    });
});



const getMyRooms = asyncHandler(async (req, res) => {
    const rooms = await Room.find({
        members: req.user._id,
    }).sort({ updatedAt: -1 });

    res.json({
        success: true,
        rooms,
    });
});


export {
    createRoom,
    joinRoom,
    getMyRooms,
    leaveRoom,
}