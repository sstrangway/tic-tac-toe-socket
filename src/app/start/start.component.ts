import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { SocketioService } from "../socketio.service";

@Component({
  selector: "app-start",
  templateUrl: "./start.component.html",
  styleUrls: ["./start.component.css"],
})
export class StartComponent implements OnInit {
  submitted = false;
  name = "";
  roomToken = "";

  constructor(
    private http: HttpClient,
    private router: Router,
    private socketService: SocketioService
  ) {}
  onSubmit() {
    this.http
      .post("http://localhost:3000/start-game", name, { responseType: "text" })
      .subscribe((token) => {
        this.roomToken = token;
        this.router.navigate(["/board", token]);
      });
  }

  ngOnInit(): void {}
}
