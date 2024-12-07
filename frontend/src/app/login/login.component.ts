import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environment/environment';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule,RouterModule],
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    const url = `${environment.apiBaseUrl}/auth/login`;
    this.http.post(url, { email: this.email, password: this.password }).subscribe({
      next: (response: any) => {
        console.log('Login response:', response);
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        if (response.role === 'admin') {
          this.router.navigate(['/admin-dashboard']);
        } else {
          this.router.navigate(['/user-dashboard']);
        }
      },
      error: (error) => {
        console.error('Login error:', error);
        if (error.status === 401) {
          alert('Invalid email or password.');
        } else {
          alert('Login failed. Please try again later.');
        }
      }
    });
  }
}
