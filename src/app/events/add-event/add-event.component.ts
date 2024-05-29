import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Event } from '../../entity/event-module';
import { EventType } from '../../entity/event-type';
import { Country } from '../../entity/country-model';
import { Office } from '../../entity/office-model';
import { AuthService } from '../../auth/auth.service';
import { Room } from '../../entity/room-module';
import { MatInputModule } from '@angular/material/input';
import { DatePipe } from '@angular/common';
import { EventStatus } from '../../entity/event-status';


@Component({
  selector: 'app-add-event',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, ReactiveFormsModule, MatInputModule],
  templateUrl: './add-event.component.html',
  styleUrl: './add-event.component.css',
  providers: [AuthService, DatePipe]
})
export class AddEventComponent implements OnInit {

  @Output() eventAdded: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();


  constructor(private authService: AuthService, private datePipe: DatePipe, private router: Router) { }

  ngOnInit(): void {
    this.authService.loadCountries().subscribe(
      {
        next: (countris: Country[]) => {
          this.countries = countris;
          console.log(countris);
        }
      }
    );
  }

  event: Event = new Event();
  selectedEventType: EventType = EventType.test;
  countries: Country[];
  selectedCountry: any;
  offices: Office[];
  selectedOffice: any;
  rooms: Room[];
  selectedRoom: any;

  eventTypeOptions = Object.values(EventType).filter(value => typeof value === 'string');

  onCountryChange(country: any) {
    if (country) {
      this.authService.loadOfficesByCountryId(country).subscribe({
        next: (offices: Office[]) => {
          this.offices = offices;
          console.log(offices);
        }
      })
    }
  }

  onOfficeChange(office: any) {
    if (office) {
      this.authService.loadRoomsByOfficeId(office).subscribe({
        next: (rooms: Room[]) => {
          this.rooms = rooms;
          console.log(rooms);
        }
      })
    }
  }
  onSubmit(): void {
    this.event.eventDate = this.datePipe.transform(this.event.eventDate, "dd-MM-yyyy");
    this.event.status = this.authService.isHROrAdmin() ? EventStatus.Accepted : EventStatus.Pending;
    const added = this.authService.addEvent(this.event);
    added.then((value) => {
      if (value.id !== null && value.id !== undefined) {
        this.eventAdded.emit(value);
        console.log('Submitted event:', this.event);
      }
    });

  }

  onCancel() {
    this.closeModal.emit();
  }

}

