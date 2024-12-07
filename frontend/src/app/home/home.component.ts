import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule,
    MatGridListModule,
    MatDividerModule
  ]
})
export class HomeComponent {
  title = 'Classroom Booking System';
  description = 'จองห้องเรียนได้ง่ายๆ และจัดการการจองของคุณได้อย่างมีประสิทธิภาพ';

  features = [
    {
      icon: 'event_available',
      title: 'จองง่าย',
      description: 'ขั้นตอนการจองห้องเรียนที่ง่ายและรวดเร็ว'
    },
    {
      icon: 'schedule',
      title: 'หลายช่วงเวลา',
      description: 'เลือกช่วงเวลาที่ต้องการได้หลากหลาย'
    },
    {
      icon: 'update',
      title: 'ตรวจสอบแบบเรียลไทม์',
      description: 'ดูสถานะห้องเรียนได้แบบเรียลไทม์'
    },
    {
      icon: 'manage_accounts',
      title: 'จัดการการจอง',
      description: 'ดูและจัดการการจองของคุณได้ง่าย'
    }
  ];

  rooms = [
    { number: '401', capacity: '30 ที่นั่ง', icon: 'meeting_room' },
    { number: '402', capacity: '30 ที่นั่ง', icon: 'meeting_room' },
    { number: '403', capacity: '30 ที่นั่ง', icon: 'meeting_room' },
    { number: '404', capacity: '30 ที่นั่ง', icon: 'meeting_room' },
    { number: '405', capacity: '30 ที่นั่ง', icon: 'meeting_room' },
    { number: '406', capacity: '30 ที่นั่ง', icon: 'meeting_room' },
    { number: '407', capacity: '30 ที่นั่ง', icon: 'meeting_room' }
  ];

  timeSlots = [
    { id: 1, time: '09:00 - 11:00', icon: 'access_time' },
    { id: 2, time: '11:00 - 13:00', icon: 'access_time' },
    { id: 3, time: '13:00 - 15:00', icon: 'access_time' },
    { id: 4, time: '15:00 - 17:00', icon: 'access_time' }
  ];
}
