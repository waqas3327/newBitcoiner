import { Component, OnInit } from "@angular/core";

import { UserService } from "sdk/user.service";

@Component({
  templateUrl: "./dashboard1.component.html",
  styleUrls: ["./dashboard1.component.css"],
  providers: [UserService]
})
export class Dashboard1Component implements OnInit {
  clients = [];

  constructor(private userservice: UserService) {}

  ngOnInit() {
    this.userservice.getallclients().subscribe(
      resClientData => {
        console.log("resClientData", resClientData);
        this.clients = resClientData;
      },
      err => {
        console.log("api error", err);
      }
    );
  }
}
