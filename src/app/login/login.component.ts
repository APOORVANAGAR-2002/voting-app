import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['roman45@gmail.com', [Validators.required, Validators.email]],
      password: ['123456', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {}

  async login() {
    console.log(this.form.value);
    const { session, error } = await this.authService.logIn(this.form.value);
    console.log(session);
    if (error) {
    } else {
      this.router.navigateByUrl('/app', { replaceUrl: true });
    }
  }

  async register() {
    console.log(this.form.value);
    const { session, error } = await this.authService.createAccount(
      this.form.value
    );
    console.log(session);
    if (error) {
    } else {
      this.router.navigateByUrl('/app', { replaceUrl: true });
    }
  }
}
