var Server = require('socket.io');
var io = new Server();

io.serveClient(false);
exports.io = io;


io.on('connection', function(socket){
    socket.on('chat message', function(msg){
        console.log(msg)
        io.emit('chat message', msg);
    });
});
