var socket = io();
var videoChatForm = document.getElementById("video-chat-form");
var videoChatRooms = document.getElementById("video-chat-rooms");
var joinBtn = document.getElementById("join");
var roomName = document.getElementById("roomName");
var userVideo = document.getElementById("user-video");
var peerVideo = document.getElementById("peer-video");

joinBtn.addEventListener("click", function () {
    if (roomName.value != '') {
        socket.emit("join", roomName.value);
        navigator.getUserMedia = navigator.getUserMedia;
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
    } else {
        alert("Please add room Id");
    };
});