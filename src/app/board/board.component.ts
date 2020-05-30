import { Component, OnInit } from "@angular/core";
import { SocketioService } from "../socketio.service";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-board",
  templateUrl: "./board.component.html",
  styleUrls: ["./board.component.css"],
})
export class BoardComponent implements OnInit {
  tiles = ["", "", "", "", "", "", "", "", ""];
  result = "";
  color;
  id;
  constructor(
    private socketService: SocketioService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params.id;
    this.socketService.setupSocketConnection('/' + id);
    console.log("called");
    this.socketService.getSocket().on("assignColor", data => {
      if(!this.color) {
        this.color = data.color;
        this.id= data.id;
        return;
      }
    });
    this.socketService.getSocket().on("updated", (board) => {
      this.tiles = board;
    });
  }

  checkWin() {
    const winningTiles = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    const indexes = [];
    this.tiles.forEach((tile, i) => {
      if(tile === this.color) {
        indexes.push(i);
      }
    });

    winningTiles.forEach(tile => {
      if(tile.every(i => indexes.includes(i))) {
        this.result = this.color;
        this.socketService.getSocket().emit('win', this.color);
      }
    });
  }

  makeMove(i: number) {
    // console.log("test");
    // console.log(i);
    // const updatedTiles = [...this.tiles];
    // updatedTiles[i] = this.color;
    
    this.socketService.getSocket().emit("move", {index: i, id: this.id});
    // this.tiles = updatedTiles;
    // this.checkWin();
  }
}
