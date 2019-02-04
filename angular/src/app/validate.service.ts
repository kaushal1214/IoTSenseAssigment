import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidateService {

  constructor() { }

  validateLogin(user){
    if(user.username == undefined || user.password == undefined || user.username==""|| user.password=="")
      return false;
    else
      return true;
  }
}
