const express = require('express');
const app = express();
const cors = require('cors');
const server = require('http').createServer(app);
let users = [];

const io = require("socket.io")(server, {
  cors: {
    origin: true,
    methods: ["GET", "POST"]
  }
});

app.use(express.json());
app.use(cors());
app.set('port', process.env.PORT || 3001);

io.on( 'connect', ( socket ) => {
  console.log('A user has connected!');
  users.push(socket.id)
  console.log(`Current Users: ${users}`)

  socket.on('disconnect', (socket) => {
    console.log('A user has disconnected!');
    let i = users.indexOf(socket.id)
    users.splice(i, 1);
    console.log(`Current Users: ${users}`)
  });
});

server.listen(app.get('port'), () => {
  console.log(`Listening on port ${app.get('port')}.`);
});
