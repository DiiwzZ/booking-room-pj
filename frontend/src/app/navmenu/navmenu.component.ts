import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navmenu',
  imports: [RouterModule, CommonModule],
  standalone: true,
  templateUrl: './navmenu.component.html',
  styleUrls: ['./navmenu.component.css'],
})
export class NavmenuComponent implements OnInit {
  userRole: string = '';

  ngOnInit() {
    // ดึงข้อมูล role จาก localStorage
    const role = localStorage.getItem('role');
    this.userRole = role || '';
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/login';
  }

  getDashboardRoute(): string {
    return this.userRole === 'admin' ? '/admin-dashboard' : '/user-dashboard';
  }
}
