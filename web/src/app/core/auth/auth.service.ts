import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, BehaviorSubject, of } from 'rxjs';
import { tap, delay, catchError, map } from 'rxjs/operators';
import { User } from './models/user';
import { HttpService } from '../../shared/providers/http.service';
import { CookieService } from 'ngx-cookie-service';


@Injectable()
export class AuthService {

  private currentUserSubject: BehaviorSubject<User>;
  //private cookieValue : BehaviorSubject<User>;
  constructor(private router: Router, private http: HttpService, private cookieService: CookieService) {
    let cu = this.cookieService.get('currentUser')
    this.currentUserSubject = new BehaviorSubject<User>(cu ? JSON.parse(this.cookieService.get('currentUser')) : null);
  }

  // login user - call API from Integration platform
  login(formData): Promise<boolean> {
    return this.http.post('/TellStoryUser/Login', formData)
      .then(
        (res: any) => {
          if (res.succeeded) {
            var user = new User();
            user.password = formData.password;
            user.username = formData.username;
            user.token = res.token;
            this.cookieService.set('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
            this.router.navigate(['/']);
            return true;
          }
          return false;
        },
        err => {
          this.resetUser();
          return false
        }
      );;
  }


  //registration user - call API from Integration platform
  register(formData): Promise<string> {
    var data = {
      UserName: formData.username,
      Email: formData.email,
      Password: formData.password,
    }
    return this.http.post('/TellStoryUser/Register', data).then(
      (res: any) => {
        if (res.succeeded) {
          this.router.navigate(['/login']);
          return "";
        } else {
          res.errors.forEach(element => {
            switch (element.code) {
              case 'DuplicateUserName':
                return "Duclicate Username";
              //break;
              default:
                return "Unexpected error";
              //break;
            }
          });
        }
      },
      err => {
        this.resetUser();
        return "Wrong username or password";
      }
    );
  }

  // get current user information
  getUserInfo() {
    return this.currentUserSubject.value;
  }

  // upload file
  uploadFile(formData) {
    return this.http.post('/FileUpload/Upload', formData);
  }

  // logout authentication user - token to null and navigate to login page
  logout() {
    this.resetUser();
    this.router.navigate(['/login']);
    return this.currentUserSubject;
  }

  // delete cookies object for current user
  private resetUser() {
    //localStorage.setItem('currentUser', null);
    //localStorage.setItem("token", null);
    this.cookieService.delete('currentUser');
    this.currentUserSubject.next(null);
  }

  // check that current user is authenticated
  get isAuthenticated(): Observable<boolean> {
    const cookieUserExists: boolean = this.cookieService.check('currentUser');
    if (cookieUserExists == false) {
      this.router.navigate(['/login']);
    }

    return this.currentUserSubject.pipe(map(x => !!x));
  }
}