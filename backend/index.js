const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const bodyPaser = require('body-parser')

app.set('views', __dirname);
app.set("view engine","hbs");

let games = {};

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(bodyPaser.urlencoded({extended: false}));



app.get('/', (req, res) => {
  res.sendFile(__dirname + '/start.html');
});

app.post('/start-game', (req, res) => {
  let r = Math.random().toString(36).substring(7) + Math.random().toString(36).substring(7);

  // let game = {};
  // game.player1 = req.body.name;
  // games[r] = game;

  // createNewRoom(r);
  // res.redirect(307, '/'+r);
  
  let nsp = io.of(r);
  nsp.on('connection', (socket) => {
    let board = ['','','','','','','','',''];
    socket.emit('update', board);
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
    socket.on('my message', (msg) => {
      console.log('message: ' + msg);
    });
    socket.on('move', (i) => {
      console.log(i);
      board[i] = 'red';
      socket.emit('update', board);
    });
  });
  res.send(r);
});

app.post('/:id', (req, res) => {
  games[req.params.id].waitingForPlayer2 = true;
  games[req.params.id].board = [null,null,null,null,null,null,null,null,null];
  games[req.params.id].player1Id = Math.random().toString(36).substring(7);
  res.render('index', { name: games[req.params.id].player1Id, room: req.params.id, color: "red"});
});

app.get('/:id', (req, res) => {
  // asign unique id's to each player
  // create a currentTurn object
  // create a lastTurn object
  games[req.params.id].waitingForPlayer2 = false;

  // make sure player2Id is not equal to player one id
  let player2Id;
  do {
    player2Id = Math.random().toString(36).substring(7);
  }
  while (player2Id === games[req.params.id].player1Id)
  games[req.params.id].player2Id = player2Id;

  games[req.params.id].player2 = "player2"
  res.render('index', { name: games[req.params.id].player2Id, room: req.params.id, color: "blue"});
});




function createNewRoom(name) {
  let nsp = io.of('/'+name);

  nsp.on('connection', (socket) => {

    // console.log("Total sockets joined: ", Object.keys(io.sockets.sockets).length);
    socket.emit('gameStart');
    
    socket.on('move', (data) => {
        //update current game board
      // TODO: do some validation that move was legal
      games[data.room].board[data.moveIndex] = data.color;

      games[data.room].lastMove = data.playerId
      console.log("move event: ", games[data.room]);
      socket.broadcast.emit('move', { game: games[data.room]} )
      const winningTiles = [
        [0,1,2], [3,4,5], [6,7,8],
        [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6]
      ];

      let board = games[data.room].board;
      gameOver = winningTiles.some( (winningCombo) => {
        return board[winningCombo[0]] === board[winningCombo[1]] && 
          board[winningCombo[1]] === board[winningCombo[2]] &&
          board[winningCombo[0]] && board[winningCombo[1]] && board[winningCombo[2]] ;
      });

      if(gameOver){
        nsp.emit('gameOver', { winner: data.color } )
      }
    });
  });
}

http.listen(3000, () => {
  console.log('listening on *:3000');
});