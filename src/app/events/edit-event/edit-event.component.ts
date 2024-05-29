import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { CommonModule, DatePipe, getLocaleTimeFormat } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Event } from '../../entity/event-module';
import { EventType } from '../../entity/event-type';
import { Country } from '../../entity/country-model';
import { Office } from '../../entity/office-model';
import { Room } from '../../entity/room-module';

@Component({
  selector: 'app-edit-event',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-event.component.html',
  styleUrl: './edit-event.component.css',
  providers: [DatePipe]
})
export class EditEventComponent implements OnInit {

  @Input() event: Event;
  @Output() eventUpdated: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  constructor(private authService: AuthService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.event.startAt = this.formatTime(this.event.startAt);
    this.selectedCountry = this.event.room.office.country.id;
    this.selectedOffice = this.event.room.office.id;
    this.selectedRoom = this.event.room;
    this.authService.loadCountries().subscribe(
      {
        next: (countris: Country[]) => {
          this.countries = countris;
          console.log(countris);
        }
      }
    );
    this.onCountryChange(this.selectedCountry);
    this.onOfficeChange(this.selectedOffice);
  }

  formatTime(time: string): string {
    const [hours, minutes] = time.split(':').map(part => parseInt(part, 10));
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    const newTime = this.datePipe.transform(date, 'HH:mm');
    return (newTime) ? newTime : time;
  }

  onSubmit(): void {
    this.event.eventDate = this.datePipe.transform(this.event.eventDate, "dd-MM-yyyy")
    this.authService.updateEvent(this.event).then((value) => {
      if (value) {
        this.eventUpdated.emit(this.event);
        console.log('Submitted update event:', this.event);
      }
    });
  }

  onCancel() {
    this.closeModal.emit();
  }
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
      });
    }
  }

  onOfficeChange(office: any) {
    if (office) {
      this.authService.loadRoomsByOfficeId(office).subscribe({
        next: (rooms: Room[]) => {
          this.rooms = rooms;
          console.log(rooms);
        }
      });
    }
  }
}
