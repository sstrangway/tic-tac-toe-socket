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
  color;
  id;
  winnerId;
  gameOver = false;
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

    this.socketService.getSocket().on("win", (id) => {
      this.gameOver = true;
      this.winnerId = id;
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
