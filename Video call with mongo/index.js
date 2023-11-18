require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const userRoute = require('./routes/userRoute');
const bodyParser = require('body-parser');
const webSocketServ = require("ws").Server;

const app = express();

mongoose.connect(process.env.MONGODB_ATLAS_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

app.listen(process.env.PORT, () => {
    console.log('Server is running');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));
app.use('/', userRoute);

//webSocket code
var wss = new webSocketServ({
    port: 8000
});

var users = {};

wss.on("connection", function (conn) {
    console.log("User connected");

    conn.on("message", function (message) {
        var data;
        try {
            data = JSON.parse(message);
        } catch (error) {
            console.log("message error", error);
        };
        switch (data.type) {
            case "online":
                users[data.name] = conn;
                conn.name = data.name;
                sendToOtherUser(conn, { type: "online", success: true });
                break;
            case "offer":
                var connect = users[data.name];
                if (connect != null) {
                    conn.otherUser = data.name;
                    sendToOtherUser(connect, { type: "offer", offer: data.offer, name: conn.name, image: data.image });
                } else {
                    conn.otherUser = data.name;
                    sendToOtherUser(conn, { type: "not_available", offer: data.offer, name: data.name });
                };
                break;
            case "answer":
                var connect = users[data.name];
                if (connect != null) {
                    conn.otherUser = data.name;
                    sendToOtherUser(connect, { type: "answer", answer: data.answer });
                };
                break;
            case "candidate":
                var connect = users[data.name];
                if (connect != null) {
                    sendToOtherUser(connect, { type: "candidate", answer: data.candidate });
                };
                break;
        };
    });

    conn.on("close", function () {
        console.log("Connection closed");
    });
});

function sendToOtherUser(connection, message) {
    connection.send(JSON.stringify(message));
};