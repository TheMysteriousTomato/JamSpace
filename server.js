const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
  path: '/socket.io',
});

const users = [];
const connections = [];

const bands = new Map();

const instruments = Object.freeze(['drums', 'guitar']);

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

app.get('/sounds/:instrument/:sound', (req, res) => {
  if (instruments.indexOf(req.params.instrument) === -1) {
    res.sendStatus(403).end();
  } else {
    res.sendFile(`${__dirname}/sounds/${req.params.instrument}/${req.params.sound}`);
  }
});

app.get('/play', (req, res) => {
  res.sendFile(`${__dirname}/templates/play.html`);
});
app.get('/join', (req, res) => {
  res.sendFile(`${__dirname}/templates/join.html`);
});
app.get('/paper.min.css', (req, res) => {
  res.sendFile(`${__dirname}/templates/paper.min.css`);
});

function updateBands() {
  const bandObj = {
    count: Array.from(bands.values()),
    bands: Array.from(bands.keys()),
  };
  io.sockets.emit('get bands', JSON.stringify(bandObj));
}
function updateUsernames() {
  io.sockets.emit('get users', users);
}
function updateAll() {
  updateUsernames();
  updateBands();
  /* eslint-disable no-console */
  console.log('Rooms', Object.keys(io.nsps['/'].adapter.rooms));
  /* eslint-enable no-console */
}

io.on('connection', (socket) => {
  connections.push(socket);
  /* eslint-disable no-console */
  console.log('Connected: %s sockets connected', connections.length);
  console.log(users);
  /* eslint-enable no-console */
  /* New User */
  socket.on('new user', (user, callback) => {
    callback(true);
    socket.username = user.username;
    socket.instrument = user.instrument;
    users.push(socket.username);
    /* Join Room */
    // check if room exists && number of users in room
    if (io.nsps['/'].adapter.rooms[user.bandname] &&
      io.nsps['/'].adapter.rooms[user.bandname].length > 5) {
      // fail if too many users
      callback(false);
      // return;
    } else {
      // join room
      socket.join(user.bandname);
      // broadcast to room: band name
      io.sockets.in(user.bandname).emit('connectToRoom', user.bandname);
      // only add band the first time
      if (bands.get(user.bandname) === undefined) {
        bands.set(user.bandname, 1);
      } else {
        bands.set(user.bandname, bands.get(user.bandname) + 1);
      }
      updateBands();
    }
    updateUsernames();
  });

  /* Key Press Received */
  socket.on('new key press', (keyEventData) => {
    socket.broadcast
      .to(keyEventData.bandname)
      .emit('get key press', {
        instrument: keyEventData.instrument,
        key: keyEventData.keyCode,
      });
  });

  // Get List of All Users and Bands
  socket.on('get active users', () => {
    updateAll();
  });

  /* On Before Disconnect */
  socket.on('disconnecting', () => {
    if (typeof this.rooms !== 'undefined') {
      const currentRooms = Object.keys(this.rooms);
      currentRooms.forEach((currentRoom) => {
        const bandCount = bands.get(currentRoom);
        // if room is a band
        if (bandCount !== undefined) {
          if (bandCount !== 1) {
            bands.set(currentRoom, bands.get(currentRoom) - 1);
          } else {
            bands.delete(currentRoom);
          }
        }
      });
    }
    updateBands();
  });

  // Disconnect
  socket.on('disconnect', () => {
    const userIndex = users.indexOf(socket.username);
    if (userIndex !== -1) {
      users.splice(userIndex, 1);
    }
    updateAll();

    connections.splice(connections.indexOf(socket), 1);
    /* eslint-disable no-console */
    console.log('Disconnected: %s sockets connected', connections.length);
    /* eslint-enable no-console */
  });
});

server.listen(3000, () => {
  /* eslint-disable no-console */
  console.log('listening on *:3000');
  /* eslint-enable no-console */
});
