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
  const server=  app.listen(process.env.PORT, () => {
      console.log(
        "connected to the db and listening at port : ",
        process.env.PORT
      );
    });
    const io = require("socket.io")(server, {
      pingTimeout: 60000,
      cors: {
        origin: "http://localhost:3001 " 
      },
    });
    io.on("connection", (socket) => {
      console.log("connected to socket");
      socket.on("setup",(UserData)=>{
        socket.join(UserData._id);
        console.log("user connected",UserData._id)
        socket.emit("connected")
      })

        socket.on("join Chat", (room) => {
        socket.join(room);
        console.log("user joined room", room);
      });
      socket.on("new message", (newMessageReceived)=>{
        var chat =newMessageReceived.chat;
        console.log(chat);
        if(!chat.users) return console.log("chat.users not defined");

        chat.users.forEach(user => {
          if(user === newMessageReceived.sender._id) return;
          console.log("emitting to user",user);
          socket.in(user).emit("received",newMessageReceived);
        });
      })
     });
  })
  .catch((error) => console.log(error.message));
