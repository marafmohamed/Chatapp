const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const userRoutes = require("./routes/userRoute");
const messagesRoutes = require("./routes/messagesRoute");
const chatRouter = require("./routes/chatRouter");
const { requireAuth } = require("./requireAuth/requireAuth");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRouter);
app.use("/api/message", messagesRoutes);
mongoose
  .connect(process.env.URI)
  .then(() => {
    const server = app.listen(process.env.PORT, () => {
      console.log(
        "connected to the db and listening at port : ",
        process.env.PORT
      );
    });
    const io = require("socket.io")(server, {
      pingTimeout: 60000,
      cors: {
        origin: "http://localhost:3001 ",
      },
    });
    io.on("connection", (socket) => {
      console.log("connected to socket");
      socket.on("setup", (UserData) => {
        socket.join(UserData._id);
        socket.emit("connected");
      });

      socket.on("join Chat", (room) => {
        socket.join(room);
      });
      socket.on("new message", (newMessageReceived) => {
        var chat = newMessageReceived.chat;
        console.log(chat);
        if (!chat.users) return console.log("chat.users not defined");
        if (chat.isGroupChat) {
          socket.in(chat.GroupAdmin).emit("received", newMessageReceived);
        }
        chat.users.forEach((user) => {
          if (user === newMessageReceived.sender._id) return;
          socket.in(user).emit("received", newMessageReceived);
        });
      });
      socket.on("typing", (room, user) => {
        if (room.isGroupChat) {
          if (room.GroupAdmin._id !== user._id) {
            socket.in(room.GroupAdmin._id).emit("UserTyping", user.Name);
          }
        }
        room.users.forEach((usr) => {
          if (usr._id != user._id) {
            console.log("user : ",usr);
            socket.in(usr._id).emit("UserTyping", user.Name);
          }
        });
      });
    });
  })
  .catch((error) => console.log(error.message));
