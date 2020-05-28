import { Component, OnInit } from '@angular/core';
import { SocketioService } from '../socketio.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  tiles = [
    {
      clicked: false
    },
    {
      clicked: false
    },
    {
      clicked: false
    },
    {
      clicked: false
    },
    {
      clicked: false
    },
    {
      clicked: false
    },
    {
      clicked: false
    },
    {
      clicked: false
    },
    {
      clicked: false
    },
  ];

  constructor(private socketService: SocketioService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const id = this.route.snapshot.params.id;
    if(id) {
      this.socketService.setupSocketConnection(id);
    }
  }

  makeMove(i: string) {
    this.tiles[i].clicked = true;
    this.socketService.getSocket().emit('move', i);
  }

}
