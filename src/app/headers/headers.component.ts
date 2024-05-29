import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { AuthService } from '../auth/auth.service';
import { SideMenuService } from '../side-menu/side-menu-service';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';


@Component({
  selector: 'app-headers',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIf, MenubarModule],
  templateUrl: './headers.component.html',
  styleUrl: './headers.component.css',
})
export class HeadersComponent implements OnInit {
  items: MenuItem[];
  constructor(private authService: AuthService, private sideMenuService: SideMenuService) { }

  ngOnInit() {
    this.items = [
      {
        label: 'Menu',
        icon: 'pi pi-bars',
        command: () => this.toggleSideMenu(),
        visible: this.isAuthenticated()
      },
      {
        label: 'Events',
        icon: 'pi pi-calendar',
        routerLink: '/events',
        visible: this.isAuthenticated()
      }, {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => this.onLogout(),
        visible: this.isAuthenticated(),
      }
    ];
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  toggleSideMenu() {
    this.sideMenuService.toggle();
  }

  onLogout() {
    this.authService.signoutUser();
    this.sideMenuService.closeMenu();
  }
}
