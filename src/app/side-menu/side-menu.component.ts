import { Component, OnInit } from '@angular/core';
import { SideMenuService } from './side-menu-service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../auth/auth.service';
import { SidebarModule } from 'primeng/sidebar';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [RouterLinkActive, RouterLink, NgIf, SidebarModule],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.css'
})
export class SideMenuComponent implements OnInit {
  isOpen = false;

  constructor(private sideMenuService: SideMenuService, private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.sideMenuService.sideMenuState$.subscribe(state => {
      this.isOpen = state;
    });
  }

  closeMenu() {
    this.sideMenuService.toggle();
  }
  navigateToMyEvents() {
    this.router.navigate(['/myEvents']);
    this.closeMenu();
  }

  navigateToPendingEvents() {
    this.router.navigate(['/pendingEvents']);
    this.closeMenu();
  }
  isHROrAdmin() {
    return this.authService.isHROrAdmin();
  }
}