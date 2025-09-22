import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { Usuario } from './core/models/usuario.model';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    MatDividerModule,
  ]
})
export class AppComponent implements OnInit {
  title = 'CDA Colombia';
  currentUser: Usuario | null = null;
  isAuthenticated = false;
  sidenavOpened = true;

  menuItems = [
    { icon: 'dashboard', label: 'Dashboard', route: '/dashboard' },
    { icon: 'people', label: 'Clientes', route: '/clientes' },
    { icon: 'directions_car', label: 'Vehículos', route: '/vehiculos' },
    { icon: 'build', label: 'Servicios', route: '/servicios' },
    { icon: 'inventory_2', label: 'Repuestos', route: '/repuestos' },
    { icon: 'receipt', label: 'Facturas', route: '/facturas' }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isAuthenticated = !!user;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleSidenav(): void {
    this.sidenavOpened = !this.sidenavOpened;
  }
}