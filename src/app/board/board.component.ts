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
  constructor(
    private socketService: SocketioService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params.id;
    this.socketService.setupSocketConnection('/' + id);
    console.log("called");
    this.socketService.getSocket().on("assignColor", (color) => {
      if(!this.color) {
        this.color = color;
        return;
      }
    });
    this.socketService.getSocket().on("updated", (board) => {
      this.tiles = board;
    });
  }

  makeMove(i: string) {
    const updatedTiles = [...this.tiles];
    updatedTiles[i] = this.color;
    this.socketService.getSocket().emit("move", updatedTiles);
  }
}
