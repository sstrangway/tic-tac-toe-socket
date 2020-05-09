const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const bodyPaser = require('body-parser')

app.set('views', __dirname);
app.set("view engine","hbs");

var board = ['','','','','','','','',''];
var gameState= {
  board: board,
  playerTurn: '1',
  winner: '',
}
let x = 0;
let player1;
let player2;
let room;
let waitingForPlayer2 = false;

app.use(bodyPaser.urlencoded({extended: false}));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/start.html');
});

app.post('/start-game', (req, res) => {
  let r = Math.random().toString(36).substring(7) + Math.random().toString(36).substring(7);
  player1 = req.body.name;
  res.redirect('/'+r);
});

app.use('/:id', (req, res) => {
  room = req.params.id;

  let name = '';

  if(!waitingForPlayer2){
    name = player1;
    color = "red"; 
  } else {
    name = "player2";
    color = "blue"
  }
  waitingForPlayer2 = true;

  res.render('index', {name: name, room: room, color: color});
});


io.on('connection', (socket) => {

  // console.log("Total sockets joined: ", Object.keys(io.sockets.sockets).length);
  socket.emit('gameStart', {color: x++ == 0 ? 'red' : 'blue'});
  
  socket.on('move', (data) => {
    // console.log("move event: ", data);
    socket.broadcast.emit('move', { color: data.color, tileIndex: data.tileIndex } )
    // check if someone has won
    // 0 1 2 
    // 3 4 5 
    // 6 7 8
    const winningTiles = [
      [0,1,2], [3,4,5], [6,7,8],
      [0,3,6], [1,4,7], [2,5,8],
      [0,4,8], [2,4,6]
    ];

    let board = data.board;
    gameOver = winningTiles.some( (winningCombo) => {
      console.log(winningCombo);
      console.log(board);
      return board[winningCombo[0]] === board[winningCombo[1]] && 
        board[winningCombo[1]] === board[winningCombo[2]] &&
        board[winningCombo[0]] && board[winningCombo[1]] && board[winningCombo[2]] ;
    });

    if(gameOver){
      io.emit('gameOver', { winner: data.color } )
    }
  });

  socket.on('disconnect', () => {
    x--;
    io.emit('user disconnected');
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});