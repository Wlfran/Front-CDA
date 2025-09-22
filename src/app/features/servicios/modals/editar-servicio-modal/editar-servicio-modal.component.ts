import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Servicio } from '../../../../core/models/servicio.model';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ServicioService } from '../../../../core/services/servicio.service';

@Component({
  selector: 'app-editar-servicio-modal',
  templateUrl: './editar-servicio-modal.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatNativeDateModule,
    MatDatepickerModule
  ],
})
export class EditarServicioModalComponent {
  servicioForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditarServicioModalComponent>,
    private snackBar: MatSnackBar,
    private servicioService: ServicioService, // ✅ Servicio inyectado
    @Inject(MAT_DIALOG_DATA) public data: { servicio: Servicio }
  ) {
    this.servicioForm = this.fb.group({
      observaciones: [data.servicio.observaciones, [Validators.maxLength(1000)]],
      fechaProgramada: [data.servicio.fechaProgramada || ''],
      presupuestoTope: [data.servicio.presupuestoTope || null]
    });
  }

  guardar(): void {
    if (this.servicioForm.invalid) return;

    this.loading = true;
    const actualizado: Servicio = {
      ...this.data.servicio,
      ...this.servicioForm.value
    };

    this.servicioService.updateServicio(actualizado.id!, actualizado).subscribe({
      next: () => {
        this.loading = false;
        this.snackBar.open('Servicio actualizado correctamente', 'Cerrar', { duration: 3000 });
        this.dialogRef.close(true); 
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Error al actualizar el servicio', 'Cerrar', { duration: 3000 });
      }
    });
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}
