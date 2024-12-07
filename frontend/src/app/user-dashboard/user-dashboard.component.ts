import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';

interface User {
  id?: number;
  username: string;
  email: string;
  role?: string;
  created_at?: string;
}

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css'],
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
    MatBadgeModule
  ]
})
export class UserDashboardComponent implements OnInit {
  user: User = {
    username: '',
    email: ''
  };
  bookings: any[] = [];
  stats = {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  };

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.getUserDetails();
    this.getUserBookings();
  }

  private getHeaders() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      this.router.navigate(['/login']);
      return new HttpHeaders();
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getUserDetails() {
    const headers = this.getHeaders();
    this.http.get(`${environment.apiBaseUrl}/auth/me`, { headers })
      .subscribe({
        next: (response: any) => {
          if (response && response.user) {
            this.user = response.user;
          }
        },
        error: (error) => {
          console.error('Error fetching user details:', error);
          if (error.status === 401) {
            this.router.navigate(['/login']);
          }
        }
      });
  }

  getUserBookings() {
    const headers = this.getHeaders();
    this.http.get(`${environment.apiBaseUrl}/bookings/user`, { headers }).subscribe({
      next: (response: any) => {
        this.bookings = response.data;
        this.updateStats();
      },
      error: (error) => {
        console.error('Error fetching bookings:', error);
      }
    });
  }

  updateStats() {
    this.stats = {
      total: this.bookings.length,
      pending: this.bookings.filter(b => b.status === 'pending').length,
      approved: this.bookings.filter(b => b.status === 'approved').length,
      rejected: this.bookings.filter(b => b.status === 'rejected').length
    };
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'pending': return 'warn';
      case 'approved': return 'primary';
      case 'rejected': return 'accent';
      default: return 'primary';
    }
  }

  getStatusText(status: string): string {
    return status;
  }

  cancelBooking(bookingId: number) {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะยกเลิกการจองนี้?')) {
      return;
    }

    const headers = this.getHeaders();
    this.http.delete(`${environment.apiBaseUrl}/bookings/${bookingId}`, { headers })
      .subscribe({
        next: () => {
          this.getUserBookings();
        },
        error: (error) => {
          console.error('Error canceling booking:', error);
          alert('ไม่สามารถยกเลิกการจองได้');
        }
      });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatTimeSlot(slot: string): string {
    switch (slot) {
      case '9-11': return '09:00 - 11:00';
      case '11-13': return '11:00 - 13:00';
      case '13-15': return '13:00 - 15:00';
      case '15-17': return '15:00 - 17:00';
      default: return slot;
    }
  }
}
