const joinRoom = asyncHandler(async (req, res) => {
  const { roomCode } = req.params;
  const userId = req.user._id;

  if (!roomCode) {
    throw new ApiError(400, "RoomCode is required");
  }


  const room = await Room.findOne({ roomCode });

  if (!room) {
    throw new ApiError(404, "Room not found");
  }

  if (!room.isActive) {
    throw new ApiError(410, "Room is inactive");
    // 410 = Gone (perfect HTTP status)
  }

  const isAlreadyParticipant = room.participants.some(
    (id) => id.toString() === userId.toString()
  );

  if (isAlreadyParticipant) {
    return res.status(200).json({
      success: true,
      alreadyJoined: true,
      message: "You are already a participant of this room",
      roomId: room._id,
      roomCode: room.roomCode,
    });
  }

  room.participants.push(userId);
  await room.save();

  return res.status(200).json({
    success: true,
    alreadyJoined: false,
    message: "Joined room successfully",
    roomId: room._id,
    roomCode: room.roomCode,
  });
});