let app    = require('express')();
let server = require('http').Server(app);
let io     = require('socket.io')(server);

let users = [];
let connections = [];

let bands = new Map();

const instruments = Object.freeze(["drums", "guitar"]);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index_original.html');
});

app.get('/sounds/:instrument/:sound', function (req, res) {
    if ( instruments.indexOf(req.params.instrument) === -1 ) res.sendStatus(403).end();
    else res.sendFile(__dirname + `/sounds/${req.params.instrument}/${req.params.sound}`);
});

io.on('connection', function(socket){
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length);
    console.log(users);
    // New User
    socket.on('new user', function (user, callback) {
        callback(true);
        socket.username = user.username;
        socket.instrument = user.instrument;
        users.push(socket.username);

        // Join Room

        // check if room exists && number of users in room
        if(io.nsps['/'].adapter.rooms[user.bandname] && io.nsps['/'].adapter.rooms[user.bandname].length > 5) {

            // fail
            callback(false);
            return;

        } else {

            // join room
            socket.join(user.bandname);
            // broadcast to room: band name
            io.sockets.in(user.bandname).emit('connectToRoom', user.bandname);
            // only add band the first time
            if ( bands.get(user.bandname) === undefined )
                bands.set(user.bandname, 1);
            else
                bands.set(user.bandname, bands.get(user.bandname) + 1);
            updateBands();
        }
        updateUsernames();
    });

    // Key Press Received
    socket.on('new key press', function (keyEventData) {
        socket.broadcast.to(keyEventData.bandname).emit('get key press', { instrument: keyEventData.instrument, key: keyEventData.keyCode });
    });

    // Get List of All Users and Bands
    socket.on('get active users', function() { updateUsernames();updateBands(); console.log("Rooms", Object.keys(io.nsps['/'].adapter.rooms)); });

    function updateBands() {
        let bandObj = {
            count: Array.from(bands.values()),
            bands: Array.from(bands.keys())
        };
        io.sockets.emit('get bands', JSON.stringify(bandObj));
    }
    function updateUsernames() {
        io.sockets.emit('get users', users);
    }

    // On Before Disconnect
    socket.on('disconnecting', function () {
        let currentRooms = Object.keys(this.rooms);
        currentRooms.forEach(function (currentRoom) {
            let bandCount = bands.get(currentRoom);
            // if room is a band
            if (bandCount !== undefined) {
                if (bandCount !== 1)
                    bands.set(currentRoom, bands.get(currentRoom) - 1);
                else
                    bands.delete(currentRoom);
            }
        });
        updateBands();
    });

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