import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { AuthService } from './auth/auth.service';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch } from '@angular/common/http';
import { AuthGuard } from './auth/auth-guard';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AuthInterceptor } from './auth/auth_interceptor';
import { SideMenuService } from './side-menu/side-menu-service';


export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), AuthService, provideHttpClient(withFetch()), AuthGuard, provideAnimations(), provideAnimationsAsync(), { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, SideMenuService, provideAnimationsAsync()]
};
