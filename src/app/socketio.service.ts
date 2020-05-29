import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {
  socket;
  host = false;
  
  constructor() { }

  setupSocketConnection(namespace) {
    this.socket = io(environment.SOCKET_ENDPOINT + namespace);
  }
  
  createRoom(nspId: string) {
    this.socket.nsp = '/' + nspId;
  }

  joinRoom(nspId: string) {
    this.socket.emit('joinRoom', nspId);
  }

  getSocket() {
    return this.socket;
  }

  getHost() {
    return this.host;
  }

  setHost(isHost) {
    return this.host = isHost;
  }

}
