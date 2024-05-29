import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Event } from '../entity/event-module';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-pending-events',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pending-events.component.html',
  styleUrl: './pending-events.component.css',
  providers: [DatePipe]

})
export class PendingEventsComponent implements OnInit {
  events: Event[] = [];

  constructor(private authService: AuthService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.authService.loadPendingEvents().subscribe(
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

  approve(event: Event) {
    event.eventDate = this.datePipe.transform(event.eventDate, "dd-MM-yyyy")
    this.authService.approveEvent(event).then(() => {
      let index = this.events.indexOf(event);
      if (index > -1)
        this.events.slice(index, 1);
      window.location.reload();
    });
  }

  deleteEvent(event: Event) {
    this.authService.deleteEvent(event).then((value) => {
      if (value) {
        window.location.reload();
      }
      else { console.log("Sever error") }
    });
  }
}
