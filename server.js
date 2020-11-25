const express = require('express');
const app = express();
const cors = require('cors');
const server = require('http').createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: true,
    methods: ["GET", "POST"]
  }
});

app.use(express.json());
app.use(cors());
app.set('port', process.env.PORT || 3001);

app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next()
});

io.on( "connect", ( socket ) => {
  console.log('A user has connected!');

  socket.on( 'move', (groupID, newX, newY) => {
    socket.broadcast.emit('move', groupID, newX, newY)
  })
})

server.listen(app.get('port'), () => {
  console.log(`Listening on port ${app.get('port')}.`);
});
