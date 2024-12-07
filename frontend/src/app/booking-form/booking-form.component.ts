import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environment/environment';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';

interface Room {
  id: number;
  room_number: string;
  status: string;
}

@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule
  ]
})
export class BookingFormComponent {
  booking = {
    name: '',
    booking_date: '',
    time_slot: '',
    room_number: ''
  };
  availableRooms: Room[] = [];
  minDate = new Date();

  constructor(private http: HttpClient, private router: Router) {
    this.minDate = new Date();
    this.minDate.setHours(0, 0, 0, 0);
    this.getAvailableRooms();
  }

  getAvailableRooms() {
    const headers = this.getHeaders();
    this.http.get<{data: Room[]}>(`${environment.apiBaseUrl}/rooms/available`, { headers })
      .subscribe({
        next: (response) => {
          this.availableRooms = response.data;
        },
        error: (error) => {
          console.error('Error fetching rooms:', error);
          alert('Failed to load available rooms');
        }
      });
  }

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  onSubmit() {
    if (!this.booking.name || !this.booking.booking_date || !this.booking.time_slot || !this.booking.room_number) {
      alert('Please fill in all fields');
      return;
    }

    const selectedDate = new Date(this.booking.booking_date);
    const formattedDate = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;

    const formattedBooking = {
      ...this.booking,
      booking_date: formattedDate
    };

    console.log('Submitting booking:', formattedBooking);

    const headers = this.getHeaders();
    this.http.post(`${environment.apiBaseUrl}/bookings`, formattedBooking, { headers })
      .subscribe({
        next: (response: any) => {
          console.log('Booking response:', response);
          alert('Booking created successfully!');
          this.router.navigate(['/booking-list']);
        },
        error: (error) => {
          console.error('Error creating booking:', error);
          alert('Failed to create booking: ' + (error.error?.message || 'Please try again.'));
        }
      });
  }
}
