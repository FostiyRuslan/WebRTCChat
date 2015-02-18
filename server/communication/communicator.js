var Communicator = function(io, eventEmitter) {
    var communicator = null;
    var rooms = {};


    function init(newRoom) {
        io.on('connection', function(socket) {

            function createRoom(room) {
                if (!room) return;

                if (!rooms[room]) {
                    rooms[room] = [];
                    socket.emit('update rooms', rooms);
                }
                socket.room = room;
                socket.join(room);
                socket.emit('joined', room);
            }

            function addUser(username) {
                if (rooms[socket.room]) {
                    socket.username = username;
                    rooms[socket.room].push(username);
                    socket.broadcast.to(socket.room).emit('update room', rooms[socket.room], username, socket.room);
                }
            }

            function leaveRoom() {
                socket.leave(socket.room);
                socket.broadcast.to(socket.room).emit('update room', rooms, socket.room);
            }

            //socket events
            socket.removeAllListeners('create room').on('create room', createRoom);
            socket.removeAllListeners('add user').on('add user', addUser);
            socket.removeAllListeners('leave room').on('leave room', leaveRoom);
            socket.removeAllListeners('message').on('message', function (data) {
                socket.broadcast.to(socket.room).emit('message', data);
            });

            createRoom(newRoom);
            communicator = socket;
        });
    }

    //external events
    eventEmitter.on('create room or join', init);

};

module.exports = Communicator;