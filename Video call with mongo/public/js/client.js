var local_video = document.querySelector('#local-video');

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