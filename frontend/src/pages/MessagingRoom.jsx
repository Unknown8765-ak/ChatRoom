import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import socket from "../socket/socket.js";

function MessagingRoom() {
  const { roomCode } = useParams();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [typingUser, setTypingUser] = useState(null);
  const [roomCreator, setRoomCreator] = useState(null);

  useEffect(() => {
    if (!socket.connected) {
      console.log("🔌 Socket not connected, connecting...");

      socket.connect();
    }else {
      console.log("✅ Socket already connected");
    }

    socket.emit("join-room", roomCode);

    socket.on("me", (user) => {
      setCurrentUser(user);
    });

    // room info (creator)
    socket.on("room-info", (data) => {
      setRoomCreator(data.createdBy);
    });

    socket.on("receive-message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("typing", (data) => {
      setTypingUser(data.name);
      setTimeout(() => setTypingUser(null), 4000);
    });

    socket.on("system-message", (data) => {
      setMessages((prev) => [...prev, { ...data, system: true }]);
    });

    socket.on("room-deleted", () => {
      alert("Room has been deleted by creator");
      navigate("/");
    });

    return () => {
      socket.emit("leave-room", roomCode);

  socket.off("me");
  socket.off("room-info");
  socket.off("receive-message");
  socket.off("typing");
  socket.off("system-message");
  socket.off("room-deleted");
    };
  }, [roomCode]);

  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("send-message", {
      roomCode,
      message,
    });

    setMessage("");
  };

  const deleteRoom = () => {
    socket.emit("delete-room", { roomCode });
  };


  return (
  <div className="h-screen flex flex-col bg-linear-to-br from-indigo-600 via-purple-600 to-pink-500">

    <div className="backdrop-blur-xl bg-white/10 border-b border-white/20 
                    text-white p-4 flex justify-between items-center shadow-lg">
      <div>
        <h3 className="font-semibold text-lg">💬 Messaging Room</h3>
        <p className="text-sm text-white/80">Room Code: {roomCode}</p>
      </div>

      {currentUser?._id === roomCreator && (
        <button
          onClick={deleteRoom}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl text-sm 
                     transition-all duration-300 shadow-md"
        >
          Delete
        </button>
      )}
    </div>

    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3">

      {typingUser && (
        <p className="text-xs text-white/80 animate-pulse">
          {typingUser} is typing...
        </p>
      )}

      {messages.map((msg, index) => {
        if (msg.system) {
          return (
            <div key={index} className="text-center text-xs text-white/70">
              {msg.text}
            </div>
          );
        }

        const isMe = msg.sender._id === currentUser?._id;

        return (
          <div
            key={index}
            className={`flex ${isMe ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs sm:max-w-sm px-4 py-3 rounded-2xl text-sm shadow-lg
                ${isMe
                  ? "bg-white text-purple-700 rounded-br-none"
                  : "bg-white/20 backdrop-blur-md text-white rounded-bl-none"
                }`}
            >
              <p className={`text-xs mb-1 ${isMe ? "text-gray-500" : "text-white/70"}`}>
                {msg.sender.name}
              </p>
              <p>{msg.content}</p>
            </div>
          </div>
        );
      })}
    </div>

    <div className="backdrop-blur-xl bg-white/10 border-t border-white/20 
                    p-4 flex gap-3">

      <input
        type="text"
        value={message}
        placeholder="Type a message..."
        onChange={(e) => {
          setMessage(e.target.value);
          socket.emit("typing", { roomCode });
        }}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        className="flex-1 px-4 py-3 rounded-full bg-white/20 text-white 
                   placeholder-white/70 border border-white/30 
                   focus:outline-none focus:ring-2 focus:ring-white transition-all"
      />

      <button
        onClick={sendMessage}
        className="bg-white text-purple-700 px-6 rounded-full 
                   font-semibold hover:bg-purple-100 
                   transition-all duration-300 shadow-lg"
      >
        Send
      </button>
    </div>

  </div>
);

}


export default MessagingRoom;






















// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import socket from "../socket/socket.js";


// function MessagingRoom() {
//   const { roomCode } = useParams();

//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [typingUser, setTypingUser] = useState(null);


//   useEffect(() => {
//     if (!socket.connected) {
//       console.log("🔌 Socket not connected, connecting...");
//       socket.connect();
//       console.log("hello");
//     } else {
//       console.log("✅ Socket already connected");
//     }

//     socket.emit("join-room", roomCode);

//     socket.on("me", (user) => {
//     setCurrentUser(user);
//   });
    
//     socket.on("receive-message", (data) => {
//       setMessages((prev) => [...prev, data]);
//     });

//     socket.on("typing", (data) => {
//     setTypingUser(data.name);

//     // typing ko 2 sec baad hata do
//     setTimeout(() => {
//       setTypingUser(null);
//     }, 4000);
//   });

//     socket.on("system-message", (data) => {
//     setMessages((prev) => [...prev, { ...data, system: true }]);
//     });

//     return () => {
//       socket.off("receive-message");
//   socket.off("typing");
//   socket.off("system-message");
//   socket.off("me");

//   socket.emit("leave-room", roomCode);
  
//     };
//   }, [roomCode]);


//   const sendMessage = () => {
//     if (!message.trim()) return;

//     const msgData = {
//       roomCode,
//       message: message,
//     };

//     socket.emit("send-message", msgData);
//     setMessage("");
//   };

//   return (
//     <div className="h-screen flex flex-col bg-[#ece5dd]">
//       <div className="bg-[#075e54] text-white p-4">
//         <h3 className="font-semibold">Messaging Room</h3>
//         <p className="text-sm">Room Code: {roomCode}</p>
//       </div>

//       <div className="flex-1 overflow-y-auto p-4 space-y-2">
//         {typingUser && (
//   <p className="text-xs text-gray-500 px-4">
//     {typingUser} is typing...
//   </p>
// )}
//   {messages.map((msg, index) => {

//     // 🔔 SYSTEM MESSAGE (join / leave)
//     if (msg.system) {
//       return (
//         <div
//           key={index}
//           className="text-center text-xs text-gray-500 my-2"
//         >
//           {msg.text}
//         </div>
//       );
//     }

//     // 💬 NORMAL CHAT MESSAGE
//     return (
//       <div
//         key={index}
//         className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
//           msg.sender._id === currentUser?._id
//             ? "bg-[#dcf8c6] ml-auto"
//             : "bg-white mr-auto"
//         }`}
//       >
//         <p className="text-xs text-gray-500">{msg.sender.name}</p>
//         <p>{msg.content}</p>

//         <div className="flex justify-end">
//           <span className="text-[10px] text-gray-400">
//             {new Date(msg.createdAt).toLocaleTimeString([], {
//               hour: "2-digit",
//               minute: "2-digit",
//             })}
//           </span>
//         </div>
//       </div>
//     );
//   })}
// </div>

//       <div className="bg-[#f0f0f0] p-3 flex gap-2">
//         <input
//           type="text"
//           placeholder="Type a message"
//           value={message}
//           onChange={(e) => {
//               setMessage(e.target.value);

//               if (currentUser) {
//               socket.emit("typing", {
//               roomCode,
//               user: currentUser,
//             });
//           }}
          
//         }
//           className="flex-1 p-2 rounded border outline-none"
//           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//         />

//         <button
//           onClick={sendMessage}
//           className="bg-[#075e54] text-white px-4 rounded"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }

// export default MessagingRoom;
