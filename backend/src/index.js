import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import http from "http";
import connectDB from "./db/index.js";
import { app } from "./app.js";
import { initSocket } from "./socket/index.js";


const PORT = process.env.PORT || 8000;

// ✅ express app se HTTP server banao
const server = http.createServer(app);

// ✅ socket.io attach karo
initSocket(server);

// ✅ pehle DB, phir server start
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("❌ MongoDB connect failed", err);
  });





























// import dotenv from "dotenv"
// dotenv.config({
//     path : './.env'
// })

// console.log("ACCESS 👉", process.env.ACCESS_TOKEN_SECRET);
// console.log("REFRESH 👉", process.env.REFRESH_TOKEN_SECRET);

// import connectDB from "./db/index.js";
// import {app} from './app.js'



// connectDB()
// .then(()=>{
//     app.listen(process.env.PORT || 8000 , ()=>{
//         console.log(`server is running at port : ${process.env.PORT}`)
//     })
// })
// .catch((err)=>{
//     console.log("mongoDB connect Failed" ,err)
// })