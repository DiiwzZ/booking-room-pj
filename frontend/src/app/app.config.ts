import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), // กำหนด Routes ของแอป
    provideHttpClient(), provideAnimationsAsync(),   // เพิ่ม HttpClient เพื่อรองรับ HTTP Requests
  ],
};
