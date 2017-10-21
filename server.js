let app    = require('express')();
let server = require('http').Server(app);
let io     = require('socket.io')(server);

let users = [];
let connections = [];

let bands = [];

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length);
    console.log(users);
    // New User
    socket.on('new user', function (user, callback) {
        callback(true);
        socket.username = user.username;
        socket.bandname = user.bandname;
        users.push(socket.username);

        // Join Room

        // check if room exists && number of users in room
        if(io.nsps['/'].adapter.rooms[socket.bandname] && io.nsps['/'].adapter.rooms[socket.bandname].length > 5) {

            // fail
            callback(false);
            return;

        } else {

            // join room
            socket.join(socket.bandname);
            // broadcast to room: band name
            io.sockets.in(socket.bandname).emit('connectToRoom', socket.bandname);
            // only add band the first time
            if ( bands.indexOf(socket.bandname) === -1 )
                bands.push(socket.bandname);
            getBands();
        }
        updateUsernames();
    });

    // Key Press Received
    socket.on('new key press', function (keyEventData) {
        socket.broadcast.to(socket.bandname).emit('get key press', keyEventData.keyCode);
    });

    // Get List of All Users and Bands
    socket.on('get active users', function() { updateUsernames();getBands(); console.log("Rooms", Object.keys(io.nsps['/'].adapter.rooms)); });

    function getBands() {
        io.sockets.emit('get bands', bands);
    }
    function updateUsernames() {
        io.sockets.emit('get users', users);
    }

    // Disconnect
    socket.on('disconnect', function(){
        let userIndex = users.indexOf(socket.username);
        if (userIndex !== -1)
            users.splice(userIndex, 1);
        updateUsernames();

        let currentRoom = io.nsps['/'].adapter.rooms[socket.bandname];
        let bandIndex = bands.indexOf(socket.bandname);
        if (currentRoom) {
            if (Object.keys(currentRoom).length === 1)
                if (bandIndex !== -1)
                    bands.splice(bandIndex, 1);
        } else {
            if (bandIndex !== -1)
                bands.splice(bandIndex, 1);
        }

        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s sockets connected', connections.length);
    });
});

server.listen(3000, function(){
    console.log('listening on *:3000');
});