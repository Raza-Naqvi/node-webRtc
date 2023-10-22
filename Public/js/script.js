var socket = io();
var videoChatForm = document.getElementById("video-chat-form");
var videoChatRooms = document.getElementById("video-chat-rooms");
var joinBtn = document.getElementById("join");
var roomInput = document.getElementById("roomName");
var userVideo = document.getElementById("user-video");
var peerVideo = document.getElementById("peer-video");
var roomName = roomInput.value;
var creator;

navigator.getUserMedia = navigator.getUserMedia;

joinBtn.addEventListener("click", function () {
    if (roomInput.value != '') {
        socket.emit("join", roomName);
    } else {
        alert("Please add room Id");
    };
});

socket.on("created", function () {
    creator = true;
    navigator.getUserMedia(
        {
            audio: true,
            video: { width: 1280, height: 720 }
        },
        function (stream) {
            videoChatForm.style = "display:none";
            userVideo.srcObject = stream;
            userVideo.onloadedmetadata = function (e) {
                userVideo.play();;
            };
        },
        function (err) {
            alert("something went wrong");
        }
    );
});

socket.on("joined", function () {
    creator = false;
    navigator.getUserMedia(
        {
            audio: true,
            video: { width: 1280, height: 720 }
        },
        function (stream) {
            videoChatForm.style = "display:none";
            userVideo.srcObject = stream;
            userVideo.onloadedmetadata = function (e) {
                userVideo.play();;
            };
        },
        function (err) {
            alert("something went wrong");
        }
    );
});

socket.on("full", function () {
    alert("Room full");
});

socket.on("ready", function () { });
socket.on("candidate", function () { });
socket.on("offer", function () { });
socket.on("answer", function () { });