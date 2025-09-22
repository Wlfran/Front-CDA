import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ThemePalette } from '@angular/material/core';

import { ServicioService } from '../../core/services/servicio.service';
import { AuthService } from '../../core/services/auth.service';
import { Servicio } from '../../core/models/servicio.model';
import { Usuario } from '../../core/models/usuario.model';
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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


import { EditarServicioModalComponent } from './modals/editar-servicio-modal/editar-servicio-modal.component';
import { AsignarMecanicoModalComponent } from './modals/asignar-mecanico-modal/asignar-mecanico-modal.component';
import { ServicioDetalleComponent } from './modals/revisar-servicio/servicio-detalle.component';
import { FacturaService } from '../../core/services/factura.service';

@Component({
  selector: 'app-servicio-list',
  templateUrl: './servicio-list.component.html',
  styleUrls: ['./servicio-list.component.css'],
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
    MatTableModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatChipsModule
  ]
})
export class ServicioListComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'cliente',
    'vehiculo',
    'fechaSolicitud',
    'estado',
    'mecanico',
    'acciones'
  ];
  dataSource = new MatTableDataSource<Servicio>();
  currentUser: Usuario | null = null;
  loading = false;
  searchValue: string = '';
  rol: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  estadoColorMap: Record<string, ThemePalette> = {
    Solicitado: 'warn',
    Asignado: 'accent',
    EnRevision: 'accent',
    EnReparacion: 'primary',
    Finalizado: 'primary',
    Cancelado: undefined
  };

  constructor(
    private servicioService: ServicioService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private facturaService: FacturaService,

  ) { }

  ngOnInit(): void {
    this.rol = localStorage.getItem('rol');
    this.currentUser = this.authService.getCurrentUser();
    this.cargarServicios();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  cargarServicios(): void {
    this.loading = true;
    this.servicioService.getServicios().subscribe({
      next: (servicios) => {
        this.dataSource.data = servicios;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Error al cargar servicios', 'Cerrar', { duration: 3000 });
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchValue = filterValue.trim().toLowerCase();
    this.dataSource.filter = this.searchValue;
  }

  clearSearch(): void {
    this.searchValue = '';
    this.dataSource.filter = '';
  }

  getEstadoColor(estado: string): ThemePalette {
    return this.estadoColorMap[estado] ?? undefined;
  }

  verDetalle(servicio: any) {
    const dialogRef = this.dialog.open(ServicioDetalleComponent, {
      width: '600px',
      data: {
        ...servicio,
        fotoVehiculo: servicio.fotoUrl
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Datos del mecánico + foto:', result);
      }
    });
  }

  abrirEditarServicio(servicio: Servicio): void {
    const dialogRef = this.dialog.open(EditarServicioModalComponent, {
      width: '600px',
      data: { servicio }
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this.cargarServicios();
        this.snackBar.open('Servicio actualizado correctamente', 'Cerrar', { duration: 3000 });
      }
    });
  }

  abrirAsignarMecanico(servicio: Servicio): void {
    const dialogRef = this.dialog.open(AsignarMecanicoModalComponent, {
      width: '500px',
      data: { servicio }
    });

    dialogRef.afterClosed().subscribe((mecanicoAsignado) => {
      if (mecanicoAsignado) {
        this.cargarServicios();
        this.snackBar.open(
          `Mecánico asignado al servicio #${servicio.id}`,
          'Cerrar',
          { duration: 3000 }
        );
      }
    });
  }

  getEstadoClass(estado: string): string {
    return `estado-${estado.toLowerCase()}`;
  }

  finalizarServicio(servicio: Servicio): void {
    if (!servicio.id) {
      this.snackBar.open('El servicio no tiene un ID válido', 'Cerrar', { duration: 3000 });
      return;
    }

    if (!confirm(`¿Desea finalizar el servicio #${servicio.id} y generar la factura?`)) {
      return;
    }

    this.facturaService.generarFactura(servicio.id).subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          this.generarPdf(res.data);

          this.servicioService.finalizarServicio(servicio.id!).subscribe({  // 👈 usamos ! para asegurar
            next: () => {
              this.snackBar.open(
                `Servicio #${servicio.id} finalizado y factura generada`,
                'Cerrar',
                { duration: 4000 }
              );
              this.cargarServicios();
            },
            error: () => {
              this.snackBar.open('Factura generada, pero error al finalizar servicio', 'Cerrar', { duration: 3000 });
            }
          });

        } else {
          this.snackBar.open('No se pudo generar la factura', 'Cerrar', { duration: 3000 });
        }
      },
      error: (err) => {
        console.error('Error al generar factura', err);
        this.snackBar.open('Error al finalizar servicio', 'Cerrar', { duration: 3000 });
      }
    });
  }




  generarPdf(factura: any): void {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('Factura de Servicio', 80, 15);

    doc.setFontSize(12);
    doc.text(`Cliente: ${factura.clienteNombre} (${factura.clienteNIT})`, 20, 30);
    doc.text(`Mecánico: ${factura.mecanicoNombre}`, 20, 40);
    doc.text(`Fecha: ${new Date(factura.fecha).toLocaleDateString()}`, 20, 50);

    autoTable(doc, {
      startY: 60,
      head: [['Item', 'Cantidad', 'P. Unitario', 'Total']],
      body: [
        [factura.descripcion, factura.cantidad, factura.precioUnitario, factura.totalItem]
      ]
    });

    const finalY = (doc as any).lastAutoTable.finalY || 80;

    doc.text(`Mano de obra: ${factura.manoObra}`, 20, finalY + 10);
    doc.text(`Subtotal: ${factura.subtotal}`, 20, finalY + 20);
    doc.text(`IVA (8%): ${factura.iva}`, 20, finalY + 30);
    doc.text(`Total: ${factura.total}`, 20, finalY + 40);

    doc.save(`Factura_${factura.facturaId}.pdf`);
  }




}
