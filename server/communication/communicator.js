var Communicator = function(io) {
    io.on('connection', function(){
        console.log('work');
    });
};

module.exports = Communicator;