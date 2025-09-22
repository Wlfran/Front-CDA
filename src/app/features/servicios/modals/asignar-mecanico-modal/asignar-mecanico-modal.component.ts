import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Usuario } from '../../../../core/models/usuario.model';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { ServicioService } from '../../../../core/services/servicio.service';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-asignar-mecanico-modal',
    templateUrl: './asignar-mecanico-modal.component.html',
    imports: [
        CommonModule,
        MatListModule,
        MatButtonModule,
        MatDialogModule
    ]
})
export class AsignarMecanicoModalComponent implements OnInit {
    mecanicos: Usuario[] = [];
    loading = false;

    constructor(
        private usuarioService: UsuarioService,
        private servicioService: ServicioService,
        private snackBar: MatSnackBar,
        private dialogRef: MatDialogRef<AsignarMecanicoModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { servicio: any }
    ) { }

    ngOnInit(): void {
        this.cargarMecanicos();
    }

    cargarMecanicos(): void {
        this.loading = true;
        this.usuarioService.getMecanicosDisponibles().subscribe({
            next: (usuarios) => {
                console.log(usuarios)
                this.mecanicos = usuarios;
                this.loading = false;
            },
            error: () => {
                this.loading = false;
            }
        });
    }


    asignar(mecanico: Usuario): void {
        if (!this.data.servicio?.id) {
            this.snackBar.open('El servicio no tiene un ID válido', 'Cerrar', { duration: 3000 });
            return;
        }

        this.loading = true;

        this.servicioService.asignarMecanico(this.data.servicio.id, mecanico.id!).subscribe({
            next: () => {
                this.loading = false;
                this.snackBar.open(`Mecánico asignado: ${mecanico.nombre}`, 'Cerrar', { duration: 3000 });
                this.dialogRef.close(true);
            },
            error: () => {
                this.loading = false;
                this.snackBar.open('Error al asignar mecánico', 'Cerrar', { duration: 3000 });
            }
        });
    }



    cancelar(): void {
        this.dialogRef.close();
    }
}
