import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { MatDialogModule, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { OverlayModule } from '@angular/cdk/overlay';

interface User {
  id?: number;
  username: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    OverlayModule
  ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {
  @ViewChild('editUserDialog') editUserDialog!: TemplateRef<any>;
  users: any[] = [];
  showEditModal = false;
  selectedUser: User | null = null;
  editingUser: User = {
    username: '',
    email: '',
    role: 'user'
  };
  dialogRef: MatDialogRef<any> | null = null;

  constructor(
    private http: HttpClient,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getAllUsers();
  }

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAllUsers() {
    const headers = this.getHeaders();
    this.http.get(`${environment.apiBaseUrl}/users`, { headers }).subscribe({
      next: (response: any) => {
        this.users = response.data;
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      }
    });
  }

  editUser(user: User) {
    this.selectedUser = user;
    this.editingUser = { ...user };
    this.showEditModal = true;
    this.dialogRef = this.dialog.open(this.editUserDialog, {
      width: '500px',
      data: { user: this.editingUser },
      autoFocus: false,
      restoreFocus: false,
      ariaLabel: 'Edit user dialog'
    });
  }

  closeModal() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
    this.showEditModal = false;
    this.selectedUser = null;
  }

  saveUser() {
    const headers = this.getHeaders();
    if (this.selectedUser) {
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
    }
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
}
