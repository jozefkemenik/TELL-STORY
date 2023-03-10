import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { emailValidator, matchingPasswords } from '../utils/app-validators';
import { AuthService } from '../core/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  public form: FormGroup;
  loading = false;
  public showerror: boolean = false;
  public submitted: boolean = false;

  result: string;

  constructor(public fb: FormBuilder, public router: Router, private authService: AuthService) {
    this.form = this.fb.group({
      username: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ]),
      ],
      'email': [null, Validators.compose([Validators.required, emailValidator])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ])
      ],
      'confirmPassword': ['', Validators.required]
    }, { validator: matchingPasswords('password', 'confirmPassword') });
  }

  public onSubmit(values: Object): void {
    this.submitted = true;
    if (this.form.valid) {
      this.authService.register(values).then(result => {
        if (result) {
          //error
          this.showerror = !this.showerror;
        };
      }).finally(() => {
        this.form.reset();
      });
    }
  }
}