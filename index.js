const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

var board = ['','','','','','','','',''];
var gameState= {
  board: board,
  playerTurn: '1',
  winner: '',
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log("socket.id joined: ", socket.id)
  
  socket.on('move', (board) => {
    console.log("move event: ", board);
    socket.broadcast.emit('move', board)
  });

});

http.listen(3000, () => {
  console.log('listening on *:3000');
});