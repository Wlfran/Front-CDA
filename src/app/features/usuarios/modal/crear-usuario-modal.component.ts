import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// Angular Material
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { UsuarioService } from '../../../core/services/usuario.service';

@Component({
  selector: 'app-crear-usuario-modal',
  templateUrl: './crear-usuario-modal.component.html',
  styleUrl: './crear-usuario-modal.component.css',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatCheckboxModule,
    MatButtonModule
  ]
})
export class CrearUsuarioModalComponent {
  form: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<CrearUsuarioModalComponent>,
    private usuarioService: UsuarioService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      nombre: ['', Validators.required],
      rol: ['', Validators.required],
      password: ['', Validators.required],
      disponible: [true]
    });
  }

  guardar() {
    if (this.form.valid) {
      this.usuarioService.createUsuario(this.form.value).subscribe({
        next: (res) => {
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Error al crear usuario', err);
        }
      });
    }
  }

  cerrar() {
    this.dialogRef.close(false);
  }
}
