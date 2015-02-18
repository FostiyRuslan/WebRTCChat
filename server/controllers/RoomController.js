var passport = require('passport');

var RoomController = function(eventEmitter){

    function room(req, res) {
            eventEmitter.emit('create room or join', req.params.room);
            res.render('room.html');
    }

    return {
        room: room
    };
};

module.exports = RoomController;