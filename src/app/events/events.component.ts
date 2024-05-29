import { Component } from '@angular/core';
import { AddEventComponent } from './add-event/add-event.component';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Event } from '../entity/event-module';
import { AuthService } from '../auth/auth.service';
import { EditEventComponent } from './edit-event/edit-event.component';
import { FullCalendarModule } from '@fullcalendar/angular';

import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { MyEventsComponent } from '../my-events/my-events.component';
import { ApprovedEventsReq } from '../entity/approved-events-req';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';


@Component({
  selector: 'app-events',
  standalone: true,
  imports: [AddEventComponent, CommonModule, FormsModule, AddEventComponent, EditEventComponent, CardModule, FullCalendarModule, MyEventsComponent, ButtonModule],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css',
  providers: [DatePipe]
})
export class EventsComponent {
  startDate: any;
  endDate: any;
  constructor(private authService: AuthService, private datePipe: DatePipe) { }
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    events: [
    ],
    datesSet: this.handleViewDidMount.bind(this),
    eventClick: this.handleEventClick.bind(this)
  };
  handleViewDidMount(arg: any) {
    this.startDate = this.datePipe.transform(arg.view.currentStart, "dd-MM-YYYY");
    this.endDate = this.datePipe.transform(arg.view.currentEnd, "dd-MM-YYYY");
    this.updateApprovedEventList();
  }


  showAddModal: boolean = false;
  events: Event[];
  showUpdateModal: boolean = false;
  eventToUpdate: Event;

  selectedEvent: any = null;

  ngOnInit(): void {
    this.updateApprovedEventList();
  }

  updateApprovedEventList() {
    this.authService.loadAllApprovedEventsfromToday(new ApprovedEventsReq(this.startDate, this.endDate)).subscribe(
      {
        next: (events: Event[]) => {
          this.events = events;
          this.calendarOptions.events = this.events.map(event => ({
            title: event.name + " at " + event.startAt + " to " + event.endAt,
            date: event.eventDate,
            id: event.id.toString(),
            color: this.getEventColor(event.type),
          }));
          console.log(events);
          for (let i = 0; i < this.events.length; i++)
            this.events[i].startAt = this.formatTime(this.events[i].startAt);
        }
      }
    );
  }
  handleEventClick(args: any): void {
    console.log(args.event.id);
  }

  closeEventModal(): void {
    this.selectedEvent = null;
  }

  getEventColor(eventType: any): string {
    switch (eventType) {
      case 'AllDayMeeting':
        return 'darkblue';
      case 'ExternalMeeting':
        return 'green';
      case 'InternalMeetingWithClient':
        return 'green';
      case 'TechnicalInterview':
        return 'green';
      case 'test':
        return '#aquamarine';
      default:
        return '#000000';
    }
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
  toggleAddEvent() {
    this.showAddModal = !this.showAddModal;
  }

  toggleUpdateEventModal() {
    this.showUpdateModal = !this.showUpdateModal;
  }

  onEventUpdated(event: Event) {
    this.showUpdateModal = false;
    this.authService.loadCurrentUserEventsStartingFromToday()
  }
  onEventAdded(event: Event) {
    this.showAddModal = false;
    this.events.push(event);
    this.authService.loadCurrentUserEventsStartingFromToday()
  }

  deleteEvent(event: Event) {
    this.authService.deleteEvent(event).then((value) => {
      if (value) {
        window.location.reload();
      }
      else { console.log("Sever error") }
    });
  }

  updateEvent(event: Event) {
    this.eventToUpdate = event;
    this.toggleUpdateEventModal();
  }
}
