const express = require('express');
const app = express();
const cors = require('cors');
const server = require('http').createServer(app);
let users = {};

const io = require("socket.io")(server, {
  cors: {
    origin: true,
    methods: ["GET", "POST"]
  }
});

app.use(express.json());
app.use(cors());
app.set('port', process.env.PORT || 3003);

io.on( 'connect', ( socket ) => {
  console.log('A user has connected!');
  users[socket.id] = {};

  socket.on('combine', (group1ID, group2ID, joinTileID) => {
    socket.broadcast.emit('combine', group1ID, group2ID, joinTileID);
  });

  socket.on('getRoomData', () => {
    let source = Object.keys(users).find( userID => userID !== socket.id );
    if (source) return io.to(source).emit('dataRequest', socket.id)
    io.to(socket.id).emit('newRoom')
  });

  socket.on('returnRoomData', (clientID, roomData) => {
    io.to(clientID).emit('roomData', roomData)
  })

  socket.on( 'move', (groupID, newX, newY) => {
    socket.broadcast.emit('move', groupID, newX, newY);
  });

  socket.on( 'rotate', (tileID, rotation) => {
    socket.broadcast.emit('rotate', tileID, rotation);
  });

  socket.on('disconnect', () => {
    console.log('A user has disconnected! ID:', socket.id);
    delete users[socket.id];
  });
})

server.listen(app.get('port'), () => {
  console.log(`Listening on port ${app.get('port')}.`);
});
