import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, MaybeAsync } from '@angular/router';
import { Observable } from 'rxjs';
import { Country } from './entity/country-model';
import { AuthService } from './auth/auth.service';
import { Event } from './entity/event-module';

@Injectable({ providedIn: 'root' })
export class EventsResolver implements Resolve<Event[]> {

    constructor(private authService: AuthService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Event[]> {
        return this.authService.loadCurrentUserEventsStartingFromToday();
    }
}