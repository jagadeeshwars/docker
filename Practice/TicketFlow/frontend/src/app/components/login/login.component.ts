import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  isLoginMode = true;
  user = { name: '', email: '', password: '', role: 'user' };
  error = '';

  constructor(private api: ApiService, private router: Router) {}

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.error = '';
  }

  onSubmit() {
    if (this.isLoginMode) {
      this.api.login({ email: this.user.email, password: this.user.password }).subscribe({
        next: () => this.router.navigate(['/']),
        error: (err) => this.error = err.error.message || 'Login failed'
      });
    } else {
      this.api.register(this.user).subscribe({
        next: () => this.router.navigate(['/']),
        error: (err) => this.error = err.error.message || 'Registration failed'
      });
    }
  }
}
