import { Component, OnInit } from '@angular/core';
import { SocketioService } from '../socketio.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  tiles = ['','','','','','','','',''];

  constructor(private socketService: SocketioService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const id = this.route.snapshot.params.id;
    this.socketService.setupSocketConnection();

    if(this.socketService.getHost()) {
      this.socketService.createRoom(id);
    } else {
      this.socketService.getSocket().emit('joinRoom', id);
      console.log('joining!');
    }
    this.socketService.getSocket().on('update', (board) => {
      console.log('updated');
      this.tiles = board;
    });
    console.log(this.socketService.getHost());
  }

  makeMove(i: string) {
    this.socketService.getSocket().emit('move', i);
  }

}
