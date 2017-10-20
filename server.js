let app    = require('express')();
let server = require('http').Server(app);
let io     = require('socket.io')(server);

let users = [];

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    console.log('a user connected');

    // New User
    socket.on('new user', function (user, callback) {
        callback(true);
        socket.username = user.username;
        users.push(socket.username);
        updateUsernames();
    });

    function updateUsernames() {
        io.sockets.emit('get users', users);
    }

    // Disconnect
    socket.on('disconnect', function(){
        users.splice(users.indexOf(socket.username, 1));
        updateUsernames();
        console.log('user disconnected');
    });
});

server.listen(3000, function(){
    console.log('listening on *:3000');
});