var Room = (function (Communicator) {
    var constraints = {video: true},
        selectors = {
            offerButton: '#offer',
            localVideo: '.local-video-stream',
            remoteVideo: 'remote-video-stream',
            remoteVideoContainer: '.remote-video-stream-container'
        },
        mediaConstraints = {
            'mandatory': {
                'OfferToReceiveAudio':true,
                'OfferToReceiveVideo':true
            }
        },
        ice = {
            iceServers: [
                {url: "stun:global.stun.twilio.com:3478?transport=udp" }
            ]
        },
        messageHandlers = {
            offer: offer,
            candidate: createIceCandidate,
            answer: answer,
            bye: stop
        },
        offerButton = document.querySelector(selectors.offerButton),
        localPC = new RTCPeerConnection(ice),
        localSignalingChannel = localPC.createDataChannel("sendDataChannel", {reliable: false}),
        communicator = Communicator.getCommunicator();

    function init() {
        getUserMedia(constraints, successCallback, errorCallback);
        initEvents();
    }

    function connect() {
        localPC.createOffer(setLocalAndSendMessage, errorCallback, mediaConstraints);
    }

    function onChannelOpened(evt) {
        console.log('Channel opened.');
    }

    function successCallback(stream) {
        var video = document.querySelector(selectors.localVideo);
        video.src = window.URL.createObjectURL(stream);
        localPC.addStream(stream);
        video.play();
    }

    function errorCallback(error){
        console.error(error);
    }

    function onRemoteStreamAdded(event) {
        var video = $('<video></video>').addClass(selectors.remoteVideo);

        video.attr('src', window.URL.createObjectURL(event.stream));
        $(selectors.remoteVideoContainer).prepend(video);
        video.get(0).play();
    }

    function setLocalAndSendMessage(sessionDescription) {
        localPC.setLocalDescription(sessionDescription);
        communicator.send(sessionDescription);
    }

    function addIceCandidate(evt) {
        if (!evt.candidate) return;

        communicator.send({type: "candidate",
            sdpMLineIndex: evt.candidate.sdpMLineIndex,
            sdpMid: evt.candidate.sdpMid,
            candidate: evt.candidate.candidate});

    }

    function createIceCandidate(options) {
        var candidate = new IceCandidate({
            sdpMLineIndex: options.sdpMLineIndex,
            sdpMid: options.sdpMid,
            candidate: options.candidate
        });
        localPC.addIceCandidate(candidate);
    }

    function answer(options) {
        localPC.setRemoteDescription(new SessionDescription(options));
    }

    function offer(options) {
        localPC.setRemoteDescription(new SessionDescription(options), function () {
            localPC.createAnswer(setLocalAndSendMessage, errorCallback, mediaConstraints);
        }, errorCallback);
    }

    function onMessage(evt) {
        var handler = messageHandlers[evt.type];

        handler(evt);
    }

    function stop(pc) {
        localPC.close();
        communicator.disconnect();
    }

    function initEvents() {
        //communicator events
        communicator.on('connect', onChannelOpened);
        communicator.on('message', onMessage);

        //room events
        localPC.addEventListener('icecandidate', addIceCandidate, false);
        localPC.addEventListener("addstream", onRemoteStreamAdded, false);
        window.onunload = stop;

        //ui events
        offerButton.addEventListener('click', connect, false);
    }

    init();
})(
    Communicator
);
