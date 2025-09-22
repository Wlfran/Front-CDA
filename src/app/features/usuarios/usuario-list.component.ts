import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UsuarioService } from '../../core/services/usuario.service';
import { Usuario } from '../../core/models/usuario.model';
import { CrearUsuarioModalComponent } from './modal/crear-usuario-modal.component'
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-usuario-list',
  templateUrl: './usuario-list.component.html',
  styleUrl: './usuario-list.component.css',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    RouterLink
]
})
export class UsuarioListComponent implements OnInit {
  usuarios: Usuario[] = [];
  loading = false;

  constructor(
    private usuarioService: UsuarioService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.loading = true;
    this.usuarioService.getUsuarios().subscribe({
      next: (res) => {
        this.usuarios = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        console.error('Error al cargar usuarios');
      }
    });
  }

  abrirCrearUsuario() {
    const dialogRef = this.dialog.open(CrearUsuarioModalComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarUsuarios();
      }
    });
  }
}
