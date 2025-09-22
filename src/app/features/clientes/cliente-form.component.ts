import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClienteService } from '../../core/services/cliente.service';
import { VehiculoService } from '../../core/services/vehiculo.service';
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
import { MatExpansionModule } from '@angular/material/expansion';
import { Cliente } from '../../core/models/cliente.model';
import { Vehiculo } from '../../core/models/vehiculo.model';

@Component({
  selector: 'app-cliente-form',
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.css'],
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
    MatExpansionModule
  ]
})
export class ClienteFormComponent implements OnInit {
  clienteForm: FormGroup;
  loading = false;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private vehiculoService: VehiculoService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.clienteForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(200)]],
      nit: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
      telefono: ['', [Validators.required, Validators.maxLength(50)]],
      direccion: ['', [Validators.required, Validators.maxLength(300)]],
      vehiculo: this.fb.group({
        placa: ['', Validators.required],
        marca: ['', Validators.required],
        modelo: ['', Validators.required],
        color: [''],
        año: ['', [Validators.required, Validators.min(1900), Validators.max(2099)]]
      })
    });
  }

  ngOnInit(): void { }

  onSubmit(): void {
    if (!this.clienteForm.valid) return;

    this.loading = true;

    const cliente: Cliente = {
      nombre: this.clienteForm.value.nombre?.trim() || 'SIN NOMBRE',
      nit: this.clienteForm.value.nit?.trim() || '0000000000',
      email: this.clienteForm.value.email?.trim() || 'noemail@correo.com',
      telefono: this.clienteForm.value.telefono?.trim() || '0000000000',
      direccion: this.clienteForm.value.direccion?.trim() || 'SIN DIRECCION'
    };

    this.clienteService.createCliente(cliente).subscribe({
      next: (createdCliente: any) => {
        const clienteId = createdCliente.data?.id;
        if (!clienteId) {
          this.loading = false;
          this.snackBar.open('Error: no se pudo obtener el ID del cliente', 'Cerrar', { duration: 3000 });
          return;
        }

        const vehiculoGroup = this.clienteForm.get('vehiculo') as FormGroup;

        const vehiculoPayload: Vehiculo = {
          id: 0,
          clienteId: clienteId,
          placa: vehiculoGroup.get('placa')?.value?.trim() || 'SIN_PLACA',
          marca: vehiculoGroup.get('marca')?.value?.trim() || 'DESCONOCIDA',
          modelo: vehiculoGroup.get('modelo')?.value?.trim() || 'DESCONOCIDO',
          anio: Number(vehiculoGroup.get('año')?.value) || 2000,
        };

        this.vehiculoService.createVehiculo(vehiculoPayload).subscribe({
          next: () => {
            this.loading = false;
            this.snackBar.open('Cliente y vehículo creados exitosamente', 'Cerrar', { duration: 3000 });
            this.router.navigate(['/dashboard']);
          },
          error: (error) => {
            this.loading = false;
            console.error('Error al crear vehículo:', error);
            this.snackBar.open('Cliente creado, pero error al crear vehículo', 'Cerrar', { duration: 3000 });
          }
        });
      },
      error: (error) => {
        this.loading = false;
        console.error('Error al crear cliente:', error);
        this.snackBar.open('Error al crear cliente', 'Cerrar', { duration: 3000 });
      }
    });
  }





  onCancel(): void {
    this.router.navigate(['/dashboard']);
  }
}
