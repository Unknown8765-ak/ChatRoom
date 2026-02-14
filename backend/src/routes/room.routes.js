import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";

import {
  createRoom,
  joinRoom,
  leaveRoom,
  getMyRooms,
} from "../controllers/room.controller.js";

const router = Router();

router.post("/create", verifyJWT, createRoom);
router.post("/:roomCode/join", verifyJWT, joinRoom);
router.post("/:roomId/leave", verifyJWT, leaveRoom);
router.get("/my", verifyJWT, getMyRooms);

export default router;
