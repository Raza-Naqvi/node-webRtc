var connection = new WebSocket("ws://localhost:8000");
var local_video = document.querySelector('#local-video');

connection.onopen = function () {
    console.log("Connected to server");
};

connection.onmessage = function (msg) {
    JSON.parse(msg);
};

connection.onerror = function (err) {
    console.log("connection.onerror", err);
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