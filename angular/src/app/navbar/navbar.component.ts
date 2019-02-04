import { Component, OnInit } from '@angular/core';
import {LoginService} from '../login.service';
import {FlashMessagesService} from 'angular2-flash-messages';
import {Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private loginService: LoginService, private router: Router, private flashMessagesService: FlashMessagesService) { }

  ngOnInit() {
  }

  onLogout(){
      this.loginService.logout();
      this.flashMessagesService.show("Logged Out",{cssClass:"alert-success", timeout:1000});
      this.router.navigate(['/login']);
      return false;

  }

}
