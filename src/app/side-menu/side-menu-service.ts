import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SideMenuService {
  private sideMenuState = new Subject<boolean>();
  sideMenuState$ = this.sideMenuState.asObservable();
  private isOpen = false;

  toggle() {
    this.isOpen = !this.isOpen;
    this.sideMenuState.next(this.isOpen);
  }
  closeMenu() {
    this.isOpen = false;
    this.sideMenuState.next(this.isOpen);
  }
}