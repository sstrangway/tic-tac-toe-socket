const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

var board = ['','','','','','','','',''];
var gameState= {
  board: board,
  playerTurn: '1',
  winner: '',
}
let x = 0;
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {

  console.log("Total sockets joined: ", Object.keys(io.sockets.sockets).length);
  socket.emit('gameStart', {color: x++ == 0 ? 'red' : 'blue'});
  
  socket.on('move', (board) => {
    console.log("move event: ", board);
    socket.broadcast.emit('move', board)
  });

  socket.on('disconnect', () => {
    x--;
    io.emit('user disconnected');
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});