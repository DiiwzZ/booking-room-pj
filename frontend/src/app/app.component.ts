import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavmenuComponent } from './navmenu/navmenu.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavmenuComponent],
  template: `
    <app-navmenu *ngIf="!isAuthPage"></app-navmenu>
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isAuthPage: boolean = false;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // ตรวจสอบว่าอยู่ที่หน้า login หรือ register หรือไม่
        this.isAuthPage = event.url === '/login' || event.url === '/register';
      }
    });
  }
}
