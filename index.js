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
        var room = rooms.get(roomName);
        if (room == undefined) {
            socket.join(roomName);
            socket.emit("created");
        } else if (room.size == 1) {
            socket.join(roomName);
            socket.emit("joined");
        } else {
            socket.emit("full");
        };
    });

    //4 steps of creating a signaling server
    socket.on("ready", function (roomName) {
        console.log("ready", roomName);
        socket.broadcast.to(roomName).emit("ready");
    });

    socket.on("candidate", function (candidate, roomName) {
        console.log("candidate", candidate);
        socket.broadcast.to(roomName).emit("candidate", candidate);
    });

    socket.on("offer", function (offer, roomName) {
        console.log("offer", offer);
        socket.broadcast.to(roomName).emit("offer", offer);
    });

    socket.on("answer", function (answer, roomName) {
        console.log("answer", answer);
        socket.broadcast.to(roomName).emit("answer", answer);
    });
});