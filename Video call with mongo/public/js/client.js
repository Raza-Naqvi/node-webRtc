var connection = new WebSocket("ws://localhost:8000");
var local_video = document.querySelector('#local-video');
var call_to_username_input = document.querySelector('#username-input');
var call_btn = document.querySelector('#call-btn');
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
            {
                audio: true,
                video: true
            },
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
            },
            function (err) {
                alert("something went wrong", err);
            },
        );
    } else {
        alert("something went wrong");
    };
};