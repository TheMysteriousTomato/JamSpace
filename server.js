let app    = require('express')();
let server = require('http').Server(app);
let io     = require('socket.io')(server);

let users = [];
let connections = [];

let currentRoomNo = 0;

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length);

    // New User
    socket.on('new user', function (user, callback) {
        callback(true);
        socket.username = user.username;
        users.push(socket.username);
        updateUsernames();
    });

    // Get List of All Users
    socket.on('get active users', function() { updateUsernames(); });
    function updateUsernames() {
        io.sockets.emit('get users', users);
    }

    //Increase currentRoomNo 5 clients are present in a room.
    if(io.nsps['/'].adapter.rooms["room-"+currentRoomNo] && io.nsps['/'].adapter.rooms["room-"+currentRoomNo].length > 5) currentRoomNo++;
    socket.join("room-"+currentRoomNo);
    //Send this event to everyone in the room.
    io.sockets.in("room-"+currentRoomNo).emit('connectToRoom', " "+currentRoomNo);

    // Disconnect
    socket.on('disconnect', function(){
        let userIndex = users.indexOf(socket.username);
        if (userIndex !== -1)
            users.splice(userIndex, 1);
        updateUsernames();

        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s sockets connected', connections.length);
    });
});

server.listen(3000, function(){
    console.log('listening on *:3000');
});