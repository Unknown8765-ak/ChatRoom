import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";

import {
    sendMessage,
    getRoomMessages,
} from "../controllers/chat.controller.js";

const router = Router();

router.post("/", verifyJWT, sendMessage);
router.post("/:roomId/messages", verifyJWT, getRoomMessages);


export default router;
