import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {
  socket;
  
  constructor() { }

  setupSocketConnection(nspId: string) {
    this.socket = io(environment.SOCKET_ENDPOINT);
    this.socket.emit('my message', 'Your joined the game');
    this.socket.nsp = '/' + nspId;
  }

  getSocket() {
    return this.socket;
  }

}
