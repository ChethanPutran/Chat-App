//Importing neccessary modules
const path = require("path");
const http = require("http");
const socketIO = require("socket.io");
const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "../config.env" });
const router = require("./routes/router");
const generateMessage = require("./modals/msg");
const Filter = require("bad-words");
const {
  addUser,
  getUserCount,
  removeUser,
  getUsersByRoom,
} = require("./users");

const port = 3000 || process.env.PORT;

//Getting public folder path
const publicPath = path.join(__dirname + "/../public");

const app = express();

//Creating server for socket.io
const server = http.createServer(app);
const io = socketIO(server);

//Setting public directory path
app.use(express.static(publicPath));

//Setting up different routes
app.use(router);
app.set("view engine", "hbs");

//Listening for connection
io.on("connection", (socket) => {
  let room_ = null;

  //Alloting rooms
  socket.on("join", ({ username, room }, callBack) => {
    //Adding user
    const { error, user } = addUser({ id: socket.id, username, room });
    if (error) {
      return callBack(error);
    }

    room_ = user.room;
    socket.join(user.room);

    //Welcoming user for the first-time
    socket.emit(
      "newMessage",
      generateMessage({
        from: "Admin",
        to: user.username,
        message: "Welcome to the chat app!",
      })
    );
    //Sending room data for side-bar
    io.to(room_).emit("roomData", {
      users: getUsersByRoom(room_),
      room: room_,
    });

    //Displaying the message to the users in a room when a new user joins
    socket.broadcast.to(room_).emit(
      "userJoined",
      generateMessage({
        from: "Admin",
        to: room_,
        message: `${username} joined the room.`,
      })
    );
    io.to(room_).emit("userUpdated", getUserCount(room_));
  });
  //socket.emit
  //socket.broadcast.emit
  //io.emit
  //io.to.emit
  //socket.broadcast.to.emit

  //Broadcastings
  socket.on("newMessage", ({ from, message = null, to }, callBack) => {
    const filter = new Filter();
    if (filter.isProfane(message)) {
      return callBack(undefined, "Profanity is not allowed!");
    }
    callBack("Message delivered", undefined);
    //Displaying the message to the users
    socket.broadcast
      .to(room_)
      .emit("newMessage", generateMessage({ from, message, to }));
  });

  //Share location
  socket.on("shareLocation", (data, callBack) => {
    io.to(room_).emit(
      "getLocation",
      generateMessage({
        from: data.from,
        to: data.to,
        link: `q=${data.location.latitude},${data.location.longitude}`,
      })
    );
    callBack("Location shared!");
  });

  //Listening for custom events

  socket.on("disconnect", () => {
    const user = removeUser(socket.id, room_);
    if (!user) {
      return;
    }
    socket.broadcast.to(room_).emit("userUpdated", getUserCount(room_));
    socket.broadcast.to(room_).emit(
      "userJoined",
      generateMessage({
        from: "Admin",
        to: "all",
        message: `${user.username} has left!`,
      })
    );
    io.to(room_).emit("roomData", {
      users: getUsersByRoom(room_),
      room: room_,
    });
  });
});

//Listening on perticular port
server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
