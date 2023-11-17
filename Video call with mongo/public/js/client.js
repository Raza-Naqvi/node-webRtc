var connection = new WebSocket("ws://localhost:8000");
var local_video = document.querySelector('#local-video');
var name;
var connectedUser;

connection.onopen = function () {
    console.log("Connected to server");
};

connection.onmessage = function (msg) {
    var data = JSON.parse(msg.data);
};

connection.onerror = function (err) {
    console.log("connection.onerror", err);
};

setTimeout(() => {
    if (connection.readyState == 1) {
        if (username != null) {
            name = username;
            console.log("userName", name);
            send({ type: "online", name: name });
        };
    } else {
        console.log("Something wrong");
    };
}, 3000);

function send(message) {
    if (connectedUser) {
        message.name = connected;
    };
    connection.send(JSON.stringify(message));
};

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

navigator.getUserMedia(
    {
        audio: true,
        video: true
    },
    function (myStream) {
        stream = myStream;
        local_video.srcObject = stream;
    },
    function (err) {
        alert("something went wrong", err);
    },
);