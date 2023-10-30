var socket = io();
var videoChatForm = document.getElementById("video-chat-form");
var videoChatRooms = document.getElementById("video-chat-rooms");
var joinBtn = document.getElementById("join");
var roomInput = document.getElementById("roomName");
var userVideo = document.getElementById("user-video");
var peerVideo = document.getElementById("peer-video");
var divBtnGroup = document.getElementById("btn-group");
var muteButton = document.getElementById("muteButton");
var hideCameraBtn = document.getElementById("hideButton");
var roomName = roomInput.value;
var muteFlag = false;
var hideCameraFlag = false;
var creator;
var rtcPeerConnection;
var userStream;

var iceServers = {
    iceServers: [
        { urls: "stun:stun1.l.google.com:19302", }
    ],
};

navigator.getUserMedia = navigator.getUserMedia;

joinBtn.addEventListener("click", function () {
    if (roomInput.value != '') {
        socket.emit("join", roomName);
    } else {
        alert("Please add room Id");
    };
});

muteButton.addEventListener("click", function () {
    muteFlag = !muteFlag;
    if (muteFlag) {
        muteButton.textContent = "Unmute";
        userStream.getTracks()[0].enabled = false;
    } else {
        userStream.getTracks()[0].enabled = true;
        muteButton.textContent = "Mute"
    };
});

hideCameraBtn.addEventListener("click", function () {
    hideCameraFlag = !hideCameraFlag;
    if (hideCameraFlag) {
        hideCameraBtn.textContent = "Show Camera";
        userStream.getTracks()[1].enabled = false;
    } else {
        userStream.getTracks()[1].enabled = true;
        hideCameraBtn.textContent = "Hide Camera"
    };
});

socket.on("created", function () {
    creator = true;
    navigator.getUserMedia(
        {
            audio: true,
            video: { width: 500, height: 500 }
        },
        function (stream) {
            userStream = stream;
            videoChatForm.style = "display:none";
            divBtnGroup.style = "display:flex";
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
            video: { width: 500, height: 500 }
        },
        function (stream) {
            userStream = stream;
            videoChatForm.style = "display:none";
            divBtnGroup.style = "display:flex";
            userVideo.srcObject = stream;
            userVideo.onloadedmetadata = function (e) {
                userVideo.play();;
            };
            socket.emit("ready", roomName);
        },
        function (err) {
            alert("something went wrong");
        }
    );
});

socket.on("full", function () {
    alert("Room full");
});

socket.on("ready", function () {
    if (creator) {
        rtcPeerConnection = new RTCPeerConnection(iceServers);
        rtcPeerConnection.onicecandidate = OnIceCandidateFunction;
        rtcPeerConnection.ontrack = OnTrackFunction;
        rtcPeerConnection.addTrack(userStream.getTracks()[0], userStream);  //for audio stream
        rtcPeerConnection.addTrack(userStream.getTracks()[1], userStream);  //for video stream
        rtcPeerConnection.createOffer(
            function (offer) {
                rtcPeerConnection.setLocalDescription(offer);
                socket.emit('offer', offer, roomName);
            },
            function (err) {
                console.log("Creating offer err", err);
            }
        );
    };
});

socket.on("candidate", function (candidate) {
    var iceCandidate = new RTCIceCandidate(candidate);
    rtcPeerConnection.addIceCandidate(iceCandidate);
});

socket.on("offer", function (offer) {
    if (!creator) {
        rtcPeerConnection = new RTCPeerConnection(iceServers);
        rtcPeerConnection.onicecandidate = OnIceCandidateFunction;
        rtcPeerConnection.ontrack = OnTrackFunction;
        rtcPeerConnection.addTrack(userStream.getTracks()[0], userStream);  //for audio stream
        rtcPeerConnection.addTrack(userStream.getTracks()[1], userStream);  //for video stream
        rtcPeerConnection.setRemoteDescription(offer)
        rtcPeerConnection.createAnswer(
            function (answer) {
                rtcPeerConnection.setLocalDescription(answer);
                socket.emit('answer', answer, roomName);
            },
            function (err) {
                console.log("Creating answer err", err);
            }
        );
    };
});

socket.on("answer", function (answer) {
    rtcPeerConnection.setRemoteDescription(answer);
});

function OnIceCandidateFunction(event) {
    if (event.candidate) {
        socket.emit("candidate", event.candidate, roomName);
    };
};

function OnTrackFunction(event) {
    peerVideo.srcObject = event.streams[0];
    peerVideo.onloadedmetadata = function (e) {
        peerVideo.play();;
    };
};