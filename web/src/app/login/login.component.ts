import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { AuthService } from '../core/auth/auth.service';
import { tap, delay, catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  public form:FormGroup;
  public showerror:boolean = false;
  public submitted:boolean = false;

  constructor(public fb: FormBuilder, public router:Router,  public authService:AuthService ){

    this.form = this.fb.group({
      username: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ]),
    ],
      password: ['', Validators.compose([
				Validators.required,
				Validators.minLength(3),
				Validators.maxLength(50)
			])
			]
    });

    // //redirect to app if user is already authorized
    this.authService.isAuthenticated.subscribe(x => {
        if (x) {
          this.router.navigate(['/']);
        }
      }
    )
  }

  public onSubmit(values: Object): void {
    this.submitted = true;
    if (this.form.valid) {
      this.authService.login(values).then(isok=>{
        if(isok){
          //todo 
        }
        else{
          this.showerror = !this.showerror;
        }
      });
    }
  }


}