const express = require("express");
const bodyParser = require("body-parser");
const userRoute = require('./Routes/userRoute');
const dotenv = require("dotenv");
const socket = require("socket.io");

const app = express();

dotenv.config();

const port = process.env.PORT;

const server = app.listen(port, () => {
    console.log(`Server is live at http://localhost:${port}`);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("Views", "./Views");

app.use(express.static('public'));
app.use("/", userRoute);

//initializing signaling server with socket io

var io = socket(server);

io.on("connection", function (socket) {
    console.log("User Connected", socket.id);

    socket.on("join", function (roomName) {
        var rooms = io.sockets.adapter.rooms;
        console.log("rooms", rooms);
        var room = rooms.get(roomName);
        if (room == undefined) {
            socket.join(roomName);
            console.log("Room created");
        } else if (room.size == 1) {
            socket.join(roomName);
            console.log("Room join");
        } else {
            console.log("Room is full");
        };
        console.log("room", room);
    });
});