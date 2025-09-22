import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { FacturaService } from '../../core/services/factura.service';
import { ServicioService } from '../../core/services/servicio.service';
import { RepuestoService } from '../../core/services/repuesto.service';
import { Servicio } from '../../core/models/servicio.model';
import { RepuestoServicio } from '../../core/models/repuesto.model';
import { Factura } from '../../core/models/factura.model';
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
import { MatTableModule } from '@angular/material/table';

@Component({
    selector: 'app-generar-factura',
    templateUrl: './generar-factura.component.html',
    //   styleUrls: ['./generar-factura.component.scss'],
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
        MatTableModule
    ]
})
export class GenerarFacturaComponent implements OnInit {
    facturaForm: FormGroup;
    servicio: Servicio | null = null;
    repuestosServicio: RepuestoServicio[] = [];
    loading = false;

    subtotalRepuestos = 0;
    subtotal = 0;
    iva = 0;
    total = 0;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private facturaService: FacturaService,
        private servicioService: ServicioService,
        private repuestoService: RepuestoService,
        private snackBar: MatSnackBar
    ) {
        this.facturaForm = this.fb.group({
            manoObra: [0, [Validators.required, Validators.min(0)]]
        });
    }

    ngOnInit(): void {
        const servicioId = this.route.snapshot.params['servicioId'];
        if (servicioId) {
            this.cargarDatos(+servicioId);
        }

        // Calcular totales cuando cambie la mano de obra
        this.facturaForm.get('manoObra')?.valueChanges.subscribe(() => {
            this.calcularTotales();
        });
    }

    cargarDatos(servicioId: number): void {
        this.loading = true;

        // Cargar servicio
        this.servicioService.getServicio(servicioId).subscribe({
            next: (servicio) => {
                this.servicio = servicio;

                // Cargar repuestos del servicio
                this.repuestoService.getRepuestosByServicio(servicioId).subscribe({
                    next: (repuestos) => {
                        this.repuestosServicio = repuestos;
                        this.calcularTotales();
                        this.loading = false;
                    },
                    error: (error) => {
                        this.loading = false;
                        this.snackBar.open('Error al cargar repuestos', 'Cerrar', { duration: 3000 });
                    }
                });
            },
            error: (error) => {
                this.loading = false;
                this.snackBar.open('Error al cargar servicio', 'Cerrar', { duration: 3000 });
            }
        });
    }

    calcularTotales(): void {
        // Subtotal de repuestos
        this.subtotalRepuestos = this.repuestosServicio.reduce((sum, repuesto) => {
            return sum + (repuesto.cantidad * repuesto.precioUnitario);
        }, 0);

        // Subtotal total (repuestos + mano de obra)
        const manoObra = this.facturaForm.get('manoObra')?.value || 0;
        this.subtotal = this.subtotalRepuestos + manoObra;

        // IVA (8%)
        this.iva = this.subtotal * 0.08;

        // Total
        this.total = this.subtotal + this.iva;
    }

    generarFactura(): void {
        if (this.facturaForm.valid && this.servicio) {
            this.loading = true;
            const manoObra = this.facturaForm.get('manoObra')?.value || 0;

            this.facturaService.generarFactura(this.servicio.id!, manoObra).subscribe({
                next: (factura) => {
                    this.loading = false;
                    this.snackBar.open('Factura generada exitosamente', 'Cerrar', { duration: 3000 });
                    this.router.navigate(['/facturas', factura.id]);
                },
                error: (error) => {
                    this.loading = false;
                    this.snackBar.open('Error al generar factura', 'Cerrar', { duration: 3000 });
                }
            });
        }
    }

    volver(): void {
        if (this.servicio) {
            this.router.navigate(['/servicios', this.servicio.id]);
        } else {
            this.router.navigate(['/servicios']);
        }
    }
}