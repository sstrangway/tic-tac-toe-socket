const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const bodyPaser = require('body-parser')

app.set('views', __dirname);
app.set("view engine","hbs");

let games = {};

app.use(bodyPaser.urlencoded({extended: false}));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/start.html');
});

app.post('/start-game', (req, res) => {
  let r = Math.random().toString(36).substring(7) + Math.random().toString(36).substring(7);

  let game = {};
  game.player1 = req.body.name;
  games[r] = game;

  createNewRoom(r);
  res.redirect(307, '/'+r);
});

app.post('/:id', (req, res) => {
  games[req.params.id].waitingForPlayer2 = true;
  games[req.params.id].board = [null,null,null,null,null,null,null,null,null];
  res.render('index', { name: games[req.params.id].player1, room: req.params.id, color: "red"});
});

app.get('/:id', (req, res) => {
  games[req.params.id].waitingForPlayer2 = false;

  games[req.params.id].player2 = "player2"
  res.render('index', { name: games[req.params.id].player2, room: req.params.id, color: "blue"});
});


function createNewRoom(name) {
  let nsp = io.of('/'+name);

  nsp.on('connection', (socket) => {

    // console.log("Total sockets joined: ", Object.keys(io.sockets.sockets).length);
    socket.emit('gameStart');
    
    socket.on('move', (data) => {
      // console.log("move event: ", data);

      //update current game board
      console.log(data)

      // TODO: do some validation that move was legal
      games[data.room].board[data.moveIndex] = data.color;

      socket.broadcast.emit('move', { color: data.color, tileId: data.tileId, game: games[data.room]} )


      console.log(games[data.room].board[data.moveIndex]);
      // [ 'blue', 'red', 'red', 
      //   'null', 'red', 'red', 
      //   'red', 'null', 'blue' ],
      // check if someone has won
      // 0 1 2 
      // 3 4 5 
      // 6 7 8
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