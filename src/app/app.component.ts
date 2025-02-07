import { Component, inject, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/authentication.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    CommonModule
  ]
})
export class AppComponent implements OnInit {
  isSmallScreen: boolean = false;
  private authService : AuthService = inject(AuthService);
  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe((result) => {
        this.isSmallScreen = result.matches;
      });
  }
  ngOnInit(): void {
    if (this.authService.isAuthenticated$) {
      this.authService.isAuthenticated$.next(true);
    }
  }
}
