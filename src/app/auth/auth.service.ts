import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, map, of } from 'rxjs';
import { Country } from '../entity/country-model';
import { Office } from '../entity/office-model';
import { Room } from '../entity/room-module';
import { JWTResponse } from '../entity/JWTResponse';
import { LoginRequestDTO } from '../entity/loginRequestDTO';
import { LogoutRequestDTO } from '../entity/logoutRequestDTO';
import { Event } from '../entity/event-module';
import { User } from '../entity/user';
import { ApprovedEventsReq } from '../entity/approved-events-req';

@Injectable()
export class AuthService {
  private baseUrl = 'http://localhost:9095/MeetingRoomReservation';
  private countryApiRoot = '/Country/getCountryList';
  private officeByCountryIdApiRoot = '/Office/getOfficesOfCountry/';
  private roomsByOfficeIdApiRoot = '/Room/getByOffice/';
  private logoutAPI = '/Auth/logout';
  private loadCurrentUserUpcomingEvents = '/Event/getUpcomingEvents';
  private loadAllApprovedEvents = '/Event/getAllUpcommingEvents';
  private addEventApi = '/Event/addEvent';
  private updateEventApi = '/Event/updateEvent';
  private deleteEventApi = '/Event/deleteEvent';
  private loadPendingEventApi = '/Event/getPendingEvents';
  private approveEventApi = '/Event/approveEvent';
  private jwtResponseSubject: BehaviorSubject<JWTResponse>;
  public jwtResponse: Observable<JWTResponse>;

  constructor(private router: Router, private http: HttpClient) {
    this.jwtResponseSubject = new BehaviorSubject<JWTResponse>(new JWTResponse());
    this.jwtResponse = this.jwtResponseSubject.asObservable();
  }

  public getJwtResponseValue(): JWTResponse {
    const localStorageData = localStorage.getItem('jwtResponse');
    if (localStorageData) {
      const parsedData = JSON.parse(localStorageData);
      // Map parsed data to JWTResponse class
      const jwtResponse: JWTResponse = {
        id: parsedData.id,
        username: parsedData.username,
        fullName: parsedData.fullName,
        email: parsedData.email,
        accessToken: parsedData.accessToken,
        permissions: parsedData.permissions
      };
      return jwtResponse;
    } else {
      return new JWTResponse();
    }
  }
  loadCountries(): Observable<Country[]> {
    return this.http.get<any>(this.baseUrl + this.countryApiRoot).pipe(map(response => response.data),
      catchError(this.handleError<Country[]>('getCountries', [])));
  }

  loadCurrentUserEventsStartingFromToday(): Observable<Event[]> {
    return this.http.post<any>(this.baseUrl + this.loadCurrentUserUpcomingEvents + '/' + this.getJwtResponseValue().username, []).pipe(map(response => response.data),
      catchError(this.handleError<Event[]>('load current user upcoming events', [])));
  }


  loadAllApprovedEventsfromToday(req: ApprovedEventsReq): Observable<Event[]> {
    return this.http.post<any>(this.baseUrl + this.loadAllApprovedEvents, req).pipe(map(response => response.data),
      catchError(this.handleError<Event[]>('load all upcoming events', [])));
  }


  loadPendingEvents(): Observable<Event[]> {
    return this.http.post<any>(this.baseUrl + this.loadPendingEventApi, []).pipe(map(response => response.data),
      catchError(this.handleError<Event[]>('load all pending events', [])));
  }
  loadOfficesByCountryId(id: number): Observable<Office[]> {
    return this.http.get<any>(this.baseUrl + this.officeByCountryIdApiRoot + id).pipe(map(response => response.data),
      catchError(this.handleError<Office[]>('getOfficesOfCountry', [])));
  }

  loadRoomsByOfficeId(id: number): Observable<Room[]> {
    return this.http.get<any>(this.baseUrl + this.roomsByOfficeIdApiRoot + id).pipe(map(response => response.data),
      catchError(this.handleError<Room[]>('getRoomsByOfficeId', [])));
  }


  signinUser(username: string, password: string) {
    this.login(new LoginRequestDTO(username, password)).then(response => console.log('login successfully')).catch(error => console.error(error));
  }

  login(loginRequestDTO: LoginRequestDTO): Promise<JWTResponse> {
    const loginUrl = `${this.baseUrl}/Auth/login`;
    const data = loginRequestDTO;
    return this.http.post<any>(loginUrl, data).toPromise()
      .then(response => {
        const data = response.data;
        localStorage.setItem('jwtResponse', JSON.stringify(data));
        this.jwtResponseSubject.next(data);
        this.router.navigate(['/events']);
        return data;
      })
      .catch(error => {
        console.error('Login failed:', error);
        throw error;
      });
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`
      );
      return of(result as T);
    };
  }

  logout() {
    const req = new LogoutRequestDTO(this.getJwtResponseValue().username);
    return this.http.post<any>(this.baseUrl + this.logoutAPI, req).toPromise()
      .then(response => {
        localStorage.removeItem('jwtResponse');
        this.jwtResponseSubject.next(new JWTResponse());
        const jwt = localStorage.getItem('jwtResponse');
        localStorage.clear();
        this.router.navigate(['/signin']);
        return response;
      })
      .catch(error => {
        console.error('Logout failed:', error);
        throw error;
      });
  }
  signoutUser() {
    this.logout().then(response => console.log('logout successfully')).catch(error => console.error(error));
  }

  isAuthenticated() {
    const jwt = localStorage.getItem('jwtResponse');
    return jwt ? true : false;
  }

  addEvent(event: Event): Promise<Event> {
    return this.postAddEventRequest(event).then(response => {
      console.log('post event successfully');
      event.id = response.data.id;
      return event;
    }).catch(error => {
      console.error(error);
      return event;
    });
  }/*  */
  postAddEventRequest(event: Event): Promise<any> {
    event.creator = new User(this.getJwtResponseValue().username);
    return this.http.post<any>(this.baseUrl + this.addEventApi, event).toPromise()
      .then(response => {
        if (response.status == 200) { this.router.navigate(['/events']); }
        return response;
      })
      .catch(error => {
        console.error('add event failed:', error);
        throw error;
      });

  }

  updateEvent(event: Event): Promise<boolean> {
    return this.putUpdateEventRequest(event).then(response => { console.log('update event successfully'); return true; }).catch(error => { console.error(error); return false; });
  }
  putUpdateEventRequest(event: Event): Promise<any> {
    event.creator = new User(this.getJwtResponseValue().username);
    return this.http.put<any>(this.baseUrl + this.updateEventApi, event).toPromise()
      .then(response => {
        this.router.navigate(['/events']);
        return response;
      })
      .catch(error => {
        console.error('add event failed:', error);
        throw error;
      });

  }

  deleteEvent(event: Event): Promise<boolean> {
    return this.deleteEventRequest(event).then(response => { console.log('delete event successfully'); return true; }).catch(error => { console.error(error); return false; });
  }
  deleteEventRequest(event: Event): Promise<any> {
    event.creator = new User(this.getJwtResponseValue().username);
    return this.http.delete<any>(this.baseUrl + this.deleteEventApi, { body: event }).toPromise()
      .then(response => {
        this.router.navigate(['/events']);
        return response;
      })
      .catch(error => {
        console.error('add event failed:', error);
        throw error;
      });

  }


  //** approve event */

  approveEvent(event: Event): Promise<Event> {
    return this.postApproveEventRequest(event).then(response => {
      console.log(' event approved successfully');
      event.id = response.data.id;
      return event;
    }).catch(error => {
      console.error(error);
      return event;
    });
  }/*  */
  postApproveEventRequest(event: Event): Promise<any> {
    event.creator = new User(this.getJwtResponseValue().username);
    return this.http.post<any>(this.baseUrl + this.approveEventApi, event).toPromise()
      .then(response => {
        if (response.status == 200) { this.router.navigate(['/events']); }
        return response;
      })
      .catch(error => {
        console.error('add event failed:', error);
        throw error;
      });

  }


  isHROrAdmin() {
    if (this.getJwtResponseValue() && this.getJwtResponseValue().permissions) {
      return this.getJwtResponseValue().permissions.indexOf("getPendingEvents") == -1 ? false : true;
    }
    return false;
  }
}
