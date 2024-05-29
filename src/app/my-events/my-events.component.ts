import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Event } from '../entity/event-module';
import { AddEventComponent } from '../events/add-event/add-event.component';
import { EditEventComponent } from '../events/edit-event/edit-event.component';
import { EventStatus } from '../entity/event-status';

@Component({
  selector: 'app-my-events',
  standalone: true,
  imports: [CommonModule, AddEventComponent, EditEventComponent],
  templateUrl: './my-events.component.html',
  styleUrl: './my-events.component.css',
  providers: [DatePipe]
})
export class MyEventsComponent implements OnInit {

  calcStatusClass(arg0: any): string | string[] | Set<string> | { [klass: string]: any; } | null | undefined {
    switch (arg0) {
      case 'Accepted':
        return "status-accepted";
      case 'Rejected':
        return "status-rejected";
      default:
        return "status-pending";
    }
  }
  constructor(private authService: AuthService, private datePipe: DatePipe) { }
  ngOnInit(): void {
    this.authService.loadCurrentUserEventsStartingFromToday().subscribe(
      {
        next: (events: Event[]) => {
          this.events = events;
          console.log(events);
          for (let i = 0; i < this.events.length; i++)
            this.events[i].startAt = this.formatTime(this.events[i].startAt);
        }
      });
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
  showAddModal: boolean = false;
  events: Event[];
  showUpdateModal: boolean = false;
  eventToUpdate: Event;

  toggleAddEvent() {
    this.showAddModal = !this.showAddModal;
  }

  toggleUpdateEventModal() {
    this.showUpdateModal = !this.showUpdateModal;
  }

  onEventUpdated(event: Event) {
    this.showUpdateModal = false;
  }
  onEventAdded(event: Event) {
    this.showAddModal = false;
    this.events.push(event);
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
