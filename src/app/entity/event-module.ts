import { EventStatus } from "./event-status";
import { EventType } from "./event-type";
import { Room } from "./room-module";
import { User } from "./user";

export class Event {
    id: number;
    name: string;
    room: Room;
    contactPerson: string;
    contactEmail: string;
    location: string;
    description: string;
    type: EventType;
    status: EventStatus;
    eventDate: any;
    startAt: string;
    endAt: string;
    creator:User;
}