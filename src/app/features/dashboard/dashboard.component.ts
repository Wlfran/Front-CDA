import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { ServicioService } from '../../core/services/servicio.service';
import { Usuario } from '../../core/models/usuario.model';
import { Servicio } from '../../core/models/servicio.model';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  // styleUrl: './dashboard.component.css',
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
    MatCardModule,
    MatFormFieldModule, 
    MatInputModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    // BrowserAnimationsModule
  ]
})
export class DashboardComponent implements OnInit {
  currentUser: Usuario | null = null;
  servicios: Servicio[] = [];
  rol: string | null = null;
  estadisticas = {
    serviciosPendientes: 0,
    serviciosEnProceso: 0,
    serviciosFinalizados: 0,
    serviciosHoy: 0
  };

  constructor(
    private authService: AuthService,
    private servicioService: ServicioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.rol = localStorage.getItem('rol');
    this.currentUser = this.authService.getCurrentUser();
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.servicioService.getServicios().subscribe(servicios => {
      this.servicios = servicios;
      this.calcularEstadisticas();
    });
  }

  calcularEstadisticas(): void {
    const hoy = new Date().toDateString();
    
    this.estadisticas.serviciosPendientes = this.servicios.filter(s => 
      s.estado === 'Solicitado' || s.estado === 'Asignado').length;
    
    this.estadisticas.serviciosEnProceso = this.servicios.filter(s => 
      s.estado === 'EnRevision' || s.estado === 'EnReparacion').length;
    
    this.estadisticas.serviciosFinalizados = this.servicios.filter(s => 
      s.estado === 'Finalizado').length;
    
    this.estadisticas.serviciosHoy = this.servicios.filter(s => 
      new Date(s.fechaSolicitud).toDateString() === hoy).length;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}