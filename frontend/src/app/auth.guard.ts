import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    // ตรวจสอบว่า Token มีอยู่ใน localStorage หรือไม่
    const token = localStorage.getItem('token');
    if (token) {
      return true; // ให้เข้าถึงได้
    } else {
      // หากไม่มี Token ให้พาไปหน้า Login
      alert('You must be logged in to access this page.');
      this.router.navigate(['/login']);
      return false;
    }
  }
}
