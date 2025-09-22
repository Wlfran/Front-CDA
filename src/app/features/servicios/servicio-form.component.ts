import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';

import { ServicioService } from '../../core/services/servicio.service';
import { ClienteService } from '../../core/services/cliente.service';
import { VehiculoService } from '../../core/services/vehiculo.service';
import { Cliente } from '../../core/models/cliente.model';
import { Vehiculo } from '../../core/models/vehiculo.model';
import { Servicio } from '../../core/models/servicio.model';
import { CommonModule } from '@angular/common';
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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-servicio-form',
  templateUrl: './servicio-form.component.html',
  styleUrls: ['./servicio-form.component.css'],
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
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class ServicioFormComponent implements OnInit, OnDestroy {
  servicioForm: FormGroup;
  loading = false;
  clientes: Cliente[] = [];
  vehiculos: Vehiculo[] = [];
  selectedFiles: FileList | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private servicioService: ServicioService,
    private clienteService: ClienteService,
    private vehiculoService: VehiculoService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.servicioForm = this.fb.group({
      clienteId: ['', Validators.required],
      vehiculoId: ['', Validators.required],
      fechaProgramada: [''],
      observaciones: ['', Validators.maxLength(1000)],
      presupuestoTope: ['']
    });
  }

  ngOnInit(): void {
    this.cargarClientes();

    this.servicioForm.get('clienteId')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(clienteId => {
        clienteId ? this.cargarVehiculos(clienteId) : this.resetVehiculos();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cargarClientes(): void {
    this.clienteService.getClientes()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: response => this.clientes = response.data || [],
        error: () => this.snackBar.open('Error al cargar clientes', 'Cerrar', { duration: 3000 })
      });
  }

  cargarVehiculos(clienteId: number): void {
    this.vehiculoService.getVehiculosByCliente(clienteId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: vehiculos => this.vehiculos = vehiculos,
        error: () => this.snackBar.open('Error al cargar vehículos', 'Cerrar', { duration: 3000 })
      });
  }

  resetVehiculos(): void {
    this.vehiculos = [];
    this.servicioForm.get('vehiculoId')?.setValue('');
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFiles = input.files;
  }

  onSubmit(): void {
    if (!this.servicioForm.valid) return;

    this.loading = true;

    const servicio: Servicio = {
      clienteId: this.servicioForm.value.clienteId!,
      vehiculoId: this.servicioForm.value.vehiculoId!,
      fechaSolicitud: new Date(),
      estado: 'Solicitado',
      alertPresupuesto: false,
      mecanicoId: undefined,
      fechaProgramada: this.servicioForm.value.fechaProgramada
        ? new Date(this.servicioForm.value.fechaProgramada)
        : undefined,
      observaciones: this.servicioForm.value.observaciones?.trim() || undefined,
      presupuestoTope: this.servicioForm.value.presupuestoTope || undefined
    };

    this.servicioService.createServicio(servicio).subscribe({
      next: async (servicioCreado) => {
        try {
          if (this.selectedFiles && this.selectedFiles.length > 0) {
            await this.subirFotos(servicioCreado.id!);
            this.snackBar.open('Cita y fotos guardadas exitosamente', 'Cerrar', { duration: 3000 });
          } else {
            this.snackBar.open('Cita creada exitosamente', 'Cerrar', { duration: 3000 });
          }
          this.router.navigate(['/servicios']);
        } catch (error) {
          this.snackBar.open('Cita creada, pero hubo errores al subir fotos', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/servicios']);
        } finally {
          this.loading = false;
        }
      },
      error: (err) => {
        this.loading = false;
        const msg = err?.error?.message || 'Error al crear la cita';
        this.snackBar.open(msg, 'Cerrar', { duration: 3000 });
      }
    });
  }


  private async subirFotos(servicioId: number): Promise<void> {
    if (!this.selectedFiles) return;

    const totalFotos = this.selectedFiles.length;
    let fotosSubidas = 0;

    const uploadPromises = Array.from(this.selectedFiles).map(file =>
      this.servicioService.subirFoto(servicioId, file).toPromise()
        .then(() => fotosSubidas++)
        .catch(() => fotosSubidas++)
    );

    await Promise.all(uploadPromises);

    this.loading = false;
    const mensaje = fotosSubidas === totalFotos
      ? 'Cita y fotos guardadas exitosamente'
      : 'Cita creada, pero hubo errores al subir algunas fotos';

    this.snackBar.open(mensaje, 'Cerrar', { duration: 5000 });
    this.router.navigate(['/servicios']);
  }

  onCancel(): void {
    this.resetForm();
    this.router.navigate(['/servicios']);
  }

  private resetForm(): void {
    this.servicioForm.reset();
    this.resetVehiculos();
    this.selectedFiles = null;
  }
}
