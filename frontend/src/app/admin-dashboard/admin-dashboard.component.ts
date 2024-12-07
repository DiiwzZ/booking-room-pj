import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';

interface User {
  id?: number;
  username: string;
  email: string;
  role: string;
}

interface Booking {
  id: number;
  name: string;
  booking_date: string;
  time_slot: string;
  room_number: string;
  status: string;
  user_id: number;
}

enum TimeSlot {
  'SLOT_9_11' = '9-11',
  'SLOT_11_13' = '11-13',
  'SLOT_13_15' = '13-15',
  'SLOT_15_17' = '15-17'
}

const TIME_SLOT_DISPLAY: Record<TimeSlot, string> = {
  [TimeSlot.SLOT_9_11]: '09:00 - 11:00',
  [TimeSlot.SLOT_11_13]: '11:00 - 13:00',
  [TimeSlot.SLOT_13_15]: '13:00 - 15:00',
  [TimeSlot.SLOT_15_17]: '15:00 - 17:00'
};

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatDividerModule
  ]
})
export class AdminDashboardComponent implements OnInit {
  bookings: Booking[] = [];
  users: any[] = [];

  showEditModal = false;
  selectedUser: User | null = null;
  editingUser: User = {
    username: '',
    email: '',
    role: 'user'
  };

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.getAllBookings();
    this.getAllUsers();
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

  getAllBookings() {
    const headers = this.getHeaders();
    this.http.get(`${environment.apiBaseUrl}/bookings`, { headers }).subscribe({
      next: (response: any) => {
        console.log('Bookings response:', response);
        this.bookings = response.data;
      },
      error: (error) => {
        console.error('Error fetching bookings:', error);
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  getAllUsers() {
    const headers = this.getHeaders();
    this.http.get(`${environment.apiBaseUrl}/users`, { headers }).subscribe({
      next: (response: any) => {
        console.log('Users response:', response);
        this.users = response.data;
      },
      error: (error) => {
        console.error('Error fetching users:', error);
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  updateBookingStatus(bookingId: number, status: string) {
    const headers = this.getHeaders();
    const normalizedStatus = status.toLowerCase();

    console.log('Sending status update:', {
      bookingId,
      status: normalizedStatus
    });

    this.http.put(`${environment.apiBaseUrl}/bookings/${bookingId}/status`, 
      { status: normalizedStatus }, 
      { headers }
    ).subscribe({
      next: (response: any) => {
        console.log('Update successful:', response);
        this.getAllBookings();
      },
      error: (error) => {
        console.error('Update failed:', error);
        alert(error.error?.message || 'Failed to update booking status');
      }
    });
  }

  getPendingBookings(): number {
    return this.bookings.filter(booking => booking.status === 'pending').length;
  }

  openAddUserModal() {
    this.selectedUser = null;
    this.editingUser = {
      username: '',
      email: '',
      role: 'user'
    };
    this.showEditModal = true;
  }

  editUser(user: User) {
    this.selectedUser = user;
    this.editingUser = { ...user };
    this.showEditModal = true;
  }

  closeModal() {
    this.showEditModal = false;
    this.selectedUser = null;
  }

  saveUser() {
    const headers = this.getHeaders();
    if (this.selectedUser) {
      // Update existing user
      this.http.put(`${environment.apiBaseUrl}/users/${this.selectedUser.id}`, 
        this.editingUser, 
        { headers }
      ).subscribe({
        next: () => {
          this.getAllUsers();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error updating user:', error);
          alert('Failed to update user');
        }
      });
    } else {
      // Add new user
      this.http.post(`${environment.apiBaseUrl}/users`, 
        this.editingUser, 
        { headers }
      ).subscribe({
        next: () => {
          this.getAllUsers();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error adding user:', error);
          alert('Failed to add user');
        }
      });
    }
  }

  updateUserRole(userId: number, event: Event) {
    const newRole = (event.target as HTMLSelectElement).value;
    const headers = this.getHeaders();

    this.http.patch(`${environment.apiBaseUrl}/users/${userId}/role`, 
      { role: newRole },
      { headers }
    ).subscribe({
      next: () => {
        this.getAllUsers();
      },
      error: (error) => {
        console.error('Error updating user role:', error);
        alert('Failed to update user role');
      }
    });
  }

  deleteUser(userId: number) {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    const headers = this.getHeaders();
    this.http.delete(`${environment.apiBaseUrl}/users/${userId}`, { headers })
      .subscribe({
        next: () => {
          this.getAllUsers();
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          alert('Failed to delete user');
        }
      });
  }

  getTimeSlotDisplay(slot: string): string {
    return TIME_SLOT_DISPLAY[slot as TimeSlot] || slot;
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'warn';
      case 'approved':
        return 'primary';
      case 'rejected':
        return 'accent';
      default:
        return 'default';
    }
  }
}
