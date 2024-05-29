import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, MaybeAsync } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { Event } from './entity/event-module';

@Injectable({ providedIn: 'root' })
export class PendingEventsResolver implements Resolve<Event[]> {

    constructor(private authService: AuthService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Event[]> {
        return this.authService.loadPendingEvents();
    }
}