import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FotosServicioService, FotoServicio } from '../../../../core/services/fotos-servicio.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
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
import { Repuesto } from '../../../../core/models/repuesto.model';
import { RepuestoService } from '../../../../core/services/repuesto.service';
import { RepuestoDetalleService } from '../../../../core/services/repuestos-servicio.service';

@Component({
    selector: 'app-servicio-detalle',
    templateUrl: './servicio-detalle.component.html',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
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
        MatNativeDateModule,
        MatDialogModule,
    ]
})
export class ServicioDetalleComponent implements OnInit {
    evaluacion = '';
    repuestos = '';
    tiempo = '';
    costo = '';
    cantidad = 1;


    fotos: FotoServicio[] = [];
    archivoSeleccionado: File | null = null;
    listaRepuestos: Repuesto[] = [];

    constructor(
        public dialogRef: MatDialogRef<ServicioDetalleComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fotosService: FotosServicioService,
        private repuestoService: RepuestoService,
        private repuestoServiceDetalle: RepuestoDetalleService
    ) { }

    ngOnInit(): void {
        if (this.data.id) {
            this.cargarFotos();
        }
        this.cargarRepuestos();
    }

    cargarFotos() {
        this.fotosService.getByServicio(this.data.id).subscribe({
            next: (res) => (this.fotos = res),
            error: (err) => console.error('Error cargando fotos', err)
        });
    }

    seleccionarArchivo(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            this.archivoSeleccionado = input.files[0];
        }
    }

    subirFoto() {
        if (this.archivoSeleccionado) {
            this.fotosService.uploadFoto(this.data.id, this.archivoSeleccionado).subscribe({
                next: (foto) => {
                    this.fotos.push(foto);
                    this.archivoSeleccionado = null;
                },
                error: (err) => console.error('Error subiendo foto', err)
            });
        }
    }

    guardar() {
        if (!this.repuestos) {
            console.error('Debe seleccionar un repuesto');
            return;
        }

        const dto = {
            servicioId: this.data.id,
            repuestoId: Number(this.repuestos),
            cantidad: this.cantidad,
            precioUnitario: this.listaRepuestos.find(r => r.id === Number(this.repuestos))?.precioUnitario || 0,
            observacion: this.evaluacion,
            manoObra: Number(this.costo) || 0,  
            horasMaximas: Number(this.tiempo) || 0, 
            forzar: false 
        };

        this.repuestoServiceDetalle.agregarRepuestoAServicio(dto).subscribe({
            next: (res) => {
                console.log('Repuesto agregado:', res);
                this.dialogRef.close(res);
            },
            error: (err) => {
                console.error('Error agregando repuesto', err);

                const mensaje = err.error?.title || err.error?.message || 'Error inesperado';

                if (mensaje.includes('mayor al tope permitido')) {
                    if (confirm(mensaje)) {
                        dto.forzar = true;
                        this.repuestoServiceDetalle.agregarRepuestoAServicio(dto).subscribe({
                            next: (res) => {
                                console.log('Repuesto agregado forzado:', res);
                                this.dialogRef.close(res);
                            },
                            error: (err2) => {
                                console.error('Error forzando repuesto', err2);
                                alert('No se pudo agregar el repuesto');
                            }
                        });
                    }
                } else {
                    alert(mensaje);
                }
            }
        });
    }



    cerrar() {
        this.dialogRef.close();
    }

    cargarRepuestos() {
        this.repuestoService.getRepuestos().subscribe({
            next: (res: Repuesto[]) => {
                this.listaRepuestos = res;
            },
            error: (err) => console.error('Error cargando repuestos', err)
        });
    }

}


