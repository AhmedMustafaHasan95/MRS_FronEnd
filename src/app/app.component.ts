import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DropdownDirective } from './shared/dropdown.directive';
import { HeadersComponent } from './headers/headers.component';
import { AuthService } from './auth/auth.service';
import { SigninComponent } from './auth/signin/signin.component';
import { AddEventComponent } from './events/add-event/add-event.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { SideMenuService } from './side-menu/side-menu-service';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeadersComponent, SigninComponent, AddEventComponent, HttpClientModule, ReactiveFormsModule, SideMenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [DropdownDirective, AuthService, HttpClient],
})
export class AppComponent implements OnInit {
  isSideMenuOpen:boolean=false;
  constructor(private sideMenuService: SideMenuService) { }
  ngOnInit(): void {
    this.sideMenuService.sideMenuState$.subscribe(state => {
      this.isSideMenuOpen = state;
    });
  }

  title = 'MRS';
}
