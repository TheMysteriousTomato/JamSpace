let app    = require('express')();
let server = require('http').Server(app);
let io     = require('socket.io')(server);

let users = [];
let connections = [];

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

    socket.on('get users', updateUsernames);

    function updateUsernames() {
        io.sockets.emit('get users', users);
    }

    // Disconnect
    socket.on('disconnect', function(){
        users.splice(users.indexOf(socket.username, 1));
        updateUsernames();

        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s sockets connected', connections.length);
    });
});

server.listen(3000, function(){
    console.log('listening on *:3000');
});