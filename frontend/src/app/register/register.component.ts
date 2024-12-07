import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { environment } from '../../environment/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [FormsModule, RouterModule]
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onRegister() {
    // ตรวจสอบการกรอกข้อมูล
    if (!this.username || !this.email || !this.password || !this.confirmPassword) {
      alert('Please fill in all fields');
      return;
    }

    // ตรวจสอบรหัสผ่านตรงกัน
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // ตรวจสอบรูปแบบอีเมล
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      alert('Please enter a valid email address');
      return;
    }

    const body = {
      username: this.username,
      email: this.email,
      password: this.password
    };

    console.log('Sending registration request:', body);

    this.http.post(`${environment.apiBaseUrl}/auth/register`, body)
      .subscribe({
        next: (response: any) => {
          console.log('Registration successful:', response);
          alert('Registration successful! Please login.');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Registration error:', error);
          alert(error.error?.message || 'Registration failed. Please try again.');
        }
      });
  }
}
