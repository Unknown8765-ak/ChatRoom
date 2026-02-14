import cors from "cors"
import express from "express"
import cookieParser from "cookie-parser"
import errorHandler from "./middleware/error.middleware.js"
const app = express()
app.use(cookieParser())

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json())
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))

import userRouter from "./routes/auth.routes.js"
import chatRouter from "./routes/chat.routes.js"
import roomRouter from "./routes/room.routes.js";

app.use("/api/v1/users", userRouter) 
app.use("/api/v1/chat", chatRouter) 
app.use("/api/v1/rooms/" , roomRouter)

app.use(errorHandler);


export { app }