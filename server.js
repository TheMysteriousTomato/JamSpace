const path = require('path');

const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
  path: '/socket.io',
});

const users = [];
const connections = [];

const bands = new Map();

const instruments = Object.freeze([
  'drums',
  'guitar',
]);

// Express Routes

app.get('/', (req, res) => {
  const index = path.resolve(__dirname, 'index_original.html');
  res.sendFile(index);
});

app.get('/sounds/:instrument/:sound', (req, res) => {
  if (instruments.indexOf(req.params.instrument) !== -1) {
    const instrument = req.params.instrument;
    const sound = req.params.sound;

    const soundFile = path.resolve(__dirname, `sounds/${instrument}/${sound}`);
    res.sendFile(soundFile);
  } else {
    res.sendStatus(404).end();
  }
});


// Socket.io Events

function updateBands() {
  const bandObj = {
    count: Array.from(bands.values()),
    bands: Array.from(bands.keys()),
  };

  io.sockets.emit('get bands', JSON.stringify(bandObj));
}

function updateUsernames() {
  io.sockets.emit('get active users', users);
}

io.on('connection', (socket) => {
  connections.push(socket);

  // TODO: remove console.log
  // eslint-disable-next-line
  console.log('Connected: %s sockets connected', connections.length);

  // New User
  socket.on('new user', (user, cb) => {
    cb(true); // wat?

    Object.assign(socket, {
      username: user.username,
      instrument: user.instrument,
    });

    users.push(socket.username);

    // Join Room
    const room = io.nsps['/'].adapter.rooms[user.bandname];
    if (room !== undefined && room.length > 5) {
      cb(false);
    } else {
      // join room
      socket.join(user.bandname);

      // broadcast to room: band name
      io.sockets.in(user.bandname).emit('connectToRoom', user.bandname);

      // only add band one time
      if (bands.get(user.bandname) !== undefined) {
        bands.set(user.bandname, bands.get(user.bandname) + 1);
      } else {
        bands.set(user.bandname, 1);
      }

      updateBands();
    }

    updateUsernames();
  });

  // Play Sound
  socket.on('new key press', (keyEventData) => {
    const sound = {
      instrument: keyEventData.instrument,
      key: keyEventData.keyCode,
    };

    socket.broadcast.to(keyEventData.bandname).emit('get key press', sound);
  });

  // Get List of All Users and Bands
  socket.on('get active users', () => {
    updateUsernames();
    updateBands();

    const rooms = Object.keys(io.nsps['/'].adapter.rooms);

    // eslint-disable-next-line
    console.log("Rooms", rooms);
  });


  // Before Disconnect
  socket.on('disconnecting', () => {
    Object.keys(socket.rooms).forEach((room) => {
      const bandCount = bands.get(room);

      if (bandCount !== undefined) {
        if (bandCount > 1) {
          bands.set(room, bands.get(room) - 1)
        } else {
          bands.delete(room);
        }
      }

      updateBands();
    });
  });

  // Disconnect
  socket.on('disconnect', () => {
    const userIndex = users.indexOf(socket.username);
    if (userIndex !== -1) {
      users.splice(userIndex, 1);
    }
    updateUsernames();

    connections.splice(connections.indexOf(socket), 1);

    // eslint-disable-next-line
    console.log('Disconnected: %s sockets connected', connections.length);
  });
});

// eslint-disable-next-line
server.listen(3000, () => (console.log('Listening on port 3000')));
