var Communicator = (function (io) {
    var communicator = null;

    function createCommunicator() {
        var socket = io.connect('http://localhost:3000');

        var username = prompt('Username');

        socket.on('connect', function () {

            socket.emit('add user', username);

            socket.on('update rooms', function (rooms) {
                console.log(rooms);
            });

            socket.on('joined', function (room) {
                console.log('joined to room ' + room);
            });

            socket.on('update room', function (participient, username, room) {
                console.log(participient, username, room);
            });
        });

        return socket;
    }

    function getCommunicator() {
        if (!communicator) {
            communicator = createCommunicator();
        }
        return communicator;
    }

    return {
        getCommunicator: getCommunicator
    }

})(io);
