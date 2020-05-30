const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const bodyPaser = require("body-parser");

let games = {};

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(bodyPaser.urlencoded({ extended: false }));

app.post("/start-game", (req, res) => {

  let roomToken =
    Math.random().toString(36).substring(7) +
    Math.random().toString(36).substring(7);
  res.send(roomToken);
  // set up room
  const nsp = io.of("/" + roomToken);
  let board = ["", "", "", "", "", "", "", "", ""];
  const colors = ["red", "blue"];
  let ids = [];
  let users = 0;
  let turn;
  let lastTurn;
  let gameOver = false;
  // handle events
  nsp.on("connection", (socket) => {

    // assign color to user, maximum 2
    if (users <= 2) {
      ids[users] = Math.random().toString(36).substring(7);

      nsp.emit("assignColor", { color: colors[users], id: ids[users]});
      users++;

      if(users === 1) {
        turn = ids[0]; // first player allowed to move
      }

      if(users === 2) {
        lastTurn = ids[1]; // second player who joins goes second
      }
      console.log("a user connected" + users);
    }

    nsp.emit("updated", board);
    // reset the board when disconnected
    socket.on("disconnect", () => {
      console.log("user disconnected");
      users--;
      board = ["", "", "", "", "", "", "", "", ""];
      gameOver = false;
    });
    // handle moves
    socket.on("move", (data) => {

      //check if game is over
      if(gameOver){
        return ; 
      }

      // check if game started
      if(users < 2){
        return ;
      }

      // check if valid move
      if(board[data.index]){
        return ;
      }

      // player can't go twice in a row
      if(turn !== data.id ){
        return ;
      }

      // update who's turn it is
      turn = lastTurn
      lastTurn = data.id;

      // update board with ids
      board[data.index] = data.id;

      // get colorBoard together for FE
      colorBoard = board.map( id => {
        const color = colors[ids.indexOf(id)];
        return color
      });

      // emit colorBoard to FE
      nsp.emit("updated", colorBoard);

      // is game over
      if(winnder(board)) {
        gameOver = true;
        nsp.emit("win", data.id);        
      }

      function winnder(board) {
        const winningTiles = [
          [0,1,2], [3,4,5], [6,7,8],
          [0,3,6], [1,4,7], [2,5,8],
          [0,4,8], [2,4,6]
        ];
      
        return gameOver = winningTiles.some( (winningCombo) => {
          return board[winningCombo[0]] === board[winningCombo[1]] && 
            board[winningCombo[1]] === board[winningCombo[2]] &&
            board[winningCombo[0]] !== "" && board[winningCombo[1]] !== "" && board[winningCombo[2]] !== "" ;
        });
      }
      
    });

  });
});

http.listen(3000, () => {
  console.log("listening on *:3000");
});
