import { Component, OnInit } from '@angular/core';

import { AuthService } from "../_services/auth.service";


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: []
})
export class HeaderComponent implements OnInit {

  constructor(public auth:AuthService) {
  }

  ngOnInit() {
    this.auth.updateUser();
  }

  logout(){
    this.auth.clearSession();     
  }
}

  