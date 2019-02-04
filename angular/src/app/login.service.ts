import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { catchError, map, tap} from 'rxjs/operators';
import {Observable,of} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  user:any;

  constructor(private http:HttpClient) { }

  private handleError<T> (operation = 'operation', result?: T) {

    return (error: any): Observable<T> => {

    // TODO: send the error to remote logging infrastructure
    console.error(error); // log to console instead

    // TODO: better job of transforming error for user consumption
    this.log(`${operation} failed: ${error.message}`);

    // Let the app keep running by returning an empty result.
    return of(result as T);
    };
  }

  private log(data:string){
    console.log(data);
  }

//To log in
  public loginUser(user): Observable<any>{

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http.post('http://localhost:3300/login',user,httpOptions)
    .pipe(
        tap(_=> {console.log("Request success")}),
        catchError(this.handleError<any>('@loginUser'))
      );
  }

//To store the user data on Browser localStorage
  storeData(user){
    localStorage.setItem('user',user);
    this.user = user;
  }

//To check if the user is logged in already
//True: Then we will make a Request
//False: Not Authorized Request failure
//We can Added JWT Authorization here
  getDeviceDetails():  Observable<any>{
    this.getUser();
    if(this.user!=null){
      return this.http.post('http://localhost:3300/device',null)
      .pipe(
          tap(_=> {console.log("Request success")}),
          catchError(this.handleError<any>('@loginUser'))
        );
    }
    else
        return of({enabled:false});
  }
  getUser(){
    const user = localStorage.getItem('user');
    this.user = user;
  }
  isLoggedIn(){
    if(this.user!=null)
      return true;
    else
      return false;
  }

//To log out the user
  logout(){
    this.user = null;
    localStorage.clear();
  }
}
