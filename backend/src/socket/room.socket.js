import { Room } from "../models/room.model.js";

const registerRoomSocket = (io, socket) => {

  
  socket.on("join-room", async (roomCode) => {
    try {
      const room = await Room.findOne({ roomCode });

      // ❌ room nahi ya inactive
      if (!room || !room.isActive) {
        socket.emit("system-message", {
          text: "Room is inactive or does not exist",
        });
        return;
      }

      socket.join(roomCode);

      console.log(`👤 ${socket.user.name} joined room ${roomCode}`);


      socket.emit("room-info", {
        createdBy: room.createdBy.toString(),
      });


     const isCreator =
        room.createdBy.toString() === socket.user._id.toString();

      console.log(
        `👤 ${socket.user.name} joined room ${roomCode} | creator=${isCreator}`
      );

      if (!isCreator) {
        socket.to(roomCode).emit("system-message", {
          text: `${socket.user.name} joined the room`,
        });
      }
    } catch (error) {
      console.error("Join room error:", error.message);
    }
  });

  
  socket.on("typing", ({ roomCode }) => {
    socket.to(roomCode).emit("typing", {
      name: socket.user.name,
    });
  });

  
  socket.on("leave-room", (roomCode) => {
    socket.leave(roomCode);

    console.log(`👤 ${socket.user.name} left room ${roomCode}`);

    socket.to(roomCode).emit("system-message", {
      text: `${socket.user.name} left the room`,
    });
  });

  
  socket.on("delete-room", async ({ roomCode }) => {
    try {
      const room = await Room.findOne({ roomCode });

      if (!room) return;

      // ❌ agar creator nahi hai
      if (room.createdBy.toString() !== socket.user._id.toString()) {
        return;
      }

      //room inactive
      room.isActive = false;
      await room.save();

      console.log(`❌ Room ${roomCode} deleted by ${socket.user.name}`);

      // 🔥 sab users ko batao
      io.to(roomCode).emit("room-deleted");

      // 🔥 sabko room se bahar nikaal do
      io.socketsLeave(roomCode);

    } catch (error) {
      console.error("Delete room error:", error.message);
    }
  });
};

export default registerRoomSocket;


















// import { Room } from "../models/room.model.js";

// const registerRoomSocket = (io, socket) => {
//   socket.on("join-room", async (roomCode) => {
//     try {
//       const room = await Room.findOne({ roomCode });

//       // ❌ Room nahi hai ya inactive hai
//       if (!room || !room.isActive) {
//         socket.emit("system-message", {
//           text: "Room is inactive or does not exist",
//         });
//         return;
//       }

//       socket.join(roomCode);
//        socket.emit("room-info", {
//       createdBy: room.createdBy.toString(),
//     });
//       console.log(socket.user.name)

//       console.log(`👤 ${socket.user.name} joined room ${roomCode}`);

//       // 🔔 system message (dusro ko)
//       socket.to(roomCode).emit("system-message", {
//         text: `${socket.user.name} joined the room`,
//       });

//     } catch (error) {
//       console.error("Join room error:", error.message);
//     }
//   });

  
//   socket.on("typing", ({ roomCode }) => {
//     socket.to(roomCode).emit("typing", {
//       name: socket.user.name,
//     });
//   });

//   socket.on("leave-room", (roomCode) => {
//     socket.leave(roomCode);

//     console.log(`👤 ${socket.user.name} left room ${roomCode}`);

//     socket.to(roomCode).emit("system-message", {
//       text: `${socket.user.name} left the room`,
//     });
//   });
// };

// export default registerRoomSocket;
 
 
 
 // const registerRoomSocket = (io, socket) => {

  //   socket.on("join-room", (roomCode) => {
  //     socket.join(roomCode);
  //     console.log(`👥 ${socket.id} joined room ${roomCode}`);
  //     console.log(`👤 ${socket.user.name} joined room ${roomCode}`);

  //     // 🔔 system message: user joined
  //     socket.to(roomCode).emit("system-message", {
  //       text: `${socket.user.name} joined the room`,
  //     });
  //   });

  //   socket.on("typing", ({ roomCode, user }) => {
  //     socket.to(roomCode).emit("typing", {
  //     name: user.name,
  //       });
  //     });

  //   socket.on("leave-room", (roomCode) => {
  //     socket.leave(roomCode);
  //     console.log(`🚪 ${socket.id} left room ${roomCode}`);
  //     console.log(`👤 ${socket.user.name} joined room ${roomCode}`);

  //     socket.to(roomCode).emit("system-message", {
  //       text: `${socket.user.name} left the room`,
  //     });
  //   });

  // };

  // export default registerRoomSocket;
