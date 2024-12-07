import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-booking-list',
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.css'],
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule
  ]
})
export class BookingListComponent implements OnInit {
  bookings: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getBookings();
  }

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getBookings() {
    const headers = this.getHeaders();
    this.http.get(`${environment.apiBaseUrl}/bookings`, { headers })
      .subscribe({
        next: (response: any) => {
          if (response && response.data) {
            this.bookings = response.data;
          }
        },
        error: (error) => {
          console.error('Error fetching bookings:', error);
        }
      });
  }

  cancelBooking(id: number) {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    const headers = this.getHeaders();
    this.http.delete(`${environment.apiBaseUrl}/bookings/${id}`, { headers })
      .subscribe({
        next: () => {
          this.getBookings();
        },
        error: (error) => {
          console.error('Error cancelling booking:', error);
          alert('Unable to cancel booking');
        }
      });
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
