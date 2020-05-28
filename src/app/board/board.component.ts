import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit(): void {
  }

  makeMove(i: string) {
    this.tiles[i].clicked = true;
  }

}
