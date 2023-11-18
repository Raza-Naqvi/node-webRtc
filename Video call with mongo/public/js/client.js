var connection = new WebSocket("ws://localhost:8000");
var local_video = document.querySelector('#local-video');
var call_to_username_input = document.querySelector('#username-input');
var call_btn = document.querySelector('#call-btn');
var call_status = document.querySelector('.call-hang-status');
var name;
var connectedUser;
var myConn;

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

call_btn.addEventListener("click", function () {
    var call_to_username = call_to_username_input.value;
    if (call_to_username.length > 0) {
        connectedUser = call_to_username.toLowerCase();
        myConn.createOffer(
            function (offer) {
                send({ type: "offer", offer: offer });
                myConn.setLocalDescription(offer);
            },
            function (error) {
                alert("something went wrong!");
                console.log("click err", error);
            },
        );
    } else {
        alert("Enter a name to call");
    };
});

connection.onopen = function () {
    console.log("Connected to server");
};

connection.onmessage = function (msg) {
    var data = JSON.parse(msg.data);
    switch (data.type) {
        case "online":
            onlineProcess(data.success);
            break;
        case "offer":
            call_status.innerHTML = `<div class="calling-status-wrap card black white-text"> <div class="user-image"> <img src="/images/user.png" class="caller-image circle" alt=""> </div> <div class="user-name">Unknown User</div> <div class="user-calling-status">Calling...</div> <div class="calling-action"> <div class="call-accept"><i class="material-icons green darken-2 white-text audio-icon">call</i></div> <div class="call-reject"><i class="material-icons red darken-3 white-text close-icon">close</i></div> </div> </div>`
            offerProcess(data.offer, data.name);
            break;
        case "answer":
            answerProcess(data.answer);
            break;
        case "candidate":
            candidateProcess(data.candidate);
            break;
    };
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
        message.name = connectedUser;
    };
    connection.send(JSON.stringify(message));
};

function onlineProcess(success) {
    if (success) {
        navigator.getUserMedia(
            { audio: true, video: true },
            function (myStream) {
                stream = myStream;
                local_video.srcObject = stream;
                var configuration = {
                    "iceServers": [
                        { "urls": "stun:stun2.1.google.com:19302" }
                    ],
                };
                myConn = new webkitRTCPeerConnection(configuration, {
                    optional: [{
                        RtpDataChannels: true,
                    }],
                });
                myConn.addStream(stream);
                myConn.onicecandidate = function (event) {
                    if (event.candidate) {
                        send({ type: "candidate", candidate: event.candidate });
                    };
                };
            },
            function (err) {
                alert("something went wrong", err);
            },
        );
    } else {
        alert("something went wrong");
    };
};

function offerProcess(offer, name) {
    connectedUser = name;
    console.log("offerProcess remote user ==>", connectedUser);
    myConn.setRemoteDescription(new RTCSessionDescription(offer));
    //creating answer from remote user
    myConn.createAnswer(
        function (answer) {
            myConn.setLocalDescription(answer);
            send({ type: "answer", answer: answer });
        },
        function (err) {
            alert("answer creation error");
            console.log("answer err", err);
        },
    );
};

function answerProcess(answer) {
    myConn.setRemoteDescription(new RTCSessionDescription(answer));
};

function candidateProcess(candidate) {
    myConn.addIceCandidate(new RTCIceCandidate(candidate));
};