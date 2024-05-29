import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Country } from './entity/country-model';
import { AuthService } from './auth/auth.service';

@Injectable({ providedIn: 'root' })
export class CountryResolver implements Resolve<Country[]> {
    
    constructor(private authService: AuthService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Country[]> {
        return this.authService.loadCountries();
    }
}