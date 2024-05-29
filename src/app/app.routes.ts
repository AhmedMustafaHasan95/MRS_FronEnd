import { Routes } from '@angular/router';
import { SigninComponent } from './auth/signin/signin.component';
import { EventsComponent } from './events/events.component';
import { AddEventComponent } from './events/add-event/add-event.component';
import { EditEventComponent } from './events/edit-event/edit-event.component';
import { CountryResolver } from './country-resolver';
import { AuthGuard } from './auth/auth-guard';
import { EventsResolver } from './events-resolver';
import { CurrentEventsResolver } from './current_events-resolver.';
import { MyEventsComponent } from './my-events/my-events.component';
import { PendingEventsComponent } from './pending-events/pending-events.component';
import { PendingEventsResolver } from './pending-events-resolver';

export const routes: Routes = [
    { path: '', redirectTo: "/events", pathMatch: 'full' },
    {
        path: 'events', component: EventsComponent, canActivate: [AuthGuard], resolve: { events: CurrentEventsResolver },
        children: [
            { path: 'new', component: AddEventComponent, canActivate: [AuthGuard], resolve: { countries: CountryResolver } },
            { path: ':id/edit', component: EditEventComponent, canActivate: [AuthGuard] }
        ]
    },
    { path: 'signin', component: SigninComponent },
    { path: 'myEvents', component: MyEventsComponent, canActivate: [AuthGuard], resolve: { events: EventsResolver } },
    { path: 'pendingEvents', component: PendingEventsComponent, canActivate: [AuthGuard], resolve: { events: PendingEventsResolver } }
];
