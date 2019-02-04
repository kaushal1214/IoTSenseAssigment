import { Component, OnInit } from '@angular/core';
import {ValidateService} from '../validate.service';
import {LoginService} from '../login.service';
import {FlashMessagesService} from 'angular2-flash-messages';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username:String;
  password:String;

  constructor(
    private validateService: ValidateService,
    private flashMessageService: FlashMessagesService,
    private loginService: LoginService,
    private router:Router) { }

  ngOnInit() {
  }

  onLogin(){
    //token:Boolean;
    const user = {
      username: this.username,
      password: this.password
    }

    console.log(user);
    if(this.validateService.validateLogin(user))
    {
       this.loginService.loginUser(user).subscribe((data)=>{
        if(data.status)
        {
          //When the correct user matches on Nodejs server.
          //User will be navigated to the device page(dashboard)
            this.loginService.storeData(data.user);
            this.flashMessageService.show("Logged In",{cssClass:'alert-success', timeout: 3000});
            this.router.navigate(['/device']);

        }
        else
          this.flashMessageService.show(data.msg,{cssClass:'alert-danger', timeout: 3000});
      });
      //this.flashMessageService.show("Good to go",{cssClass:'alert-success', timeout: 3000});
    }
    else
    {
      this.flashMessageService.show("Please fill all boxes",{cssClass:'alert-danger', timeout: 3000});
      console.log("Missing");
    }
  }

}
