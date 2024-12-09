import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../menu/menu.component';
import { FooterComponent } from '../footer/footer.component';
import { CarritoComponent } from '../carrito/carrito.component';
import { CarritoService } from '../../services/carrito/carrito.service';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { Usuario } from '../../models/dto/usuario.models';
import { AuthService } from '../../services/autenticacion/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { EditarUsuarioComponent } from '../editar-usuario/editar-usuario.component';
import { DecodedToken } from '../../services/autenticacion/auth.service';
import { UsuarioMapperService } from '../../services/usuario/usuario-mapper.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MenuComponent,
    FooterComponent,
    CarritoComponent,
    MatIconModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  carritoVisible: boolean = false;
  usuarios: Usuario[] = [];
  usuarioActual: Usuario | null = null;

  constructor(
    private carritoService: CarritoService,
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private usuarioMapperService: UsuarioMapperService
  ) {}

  ngOnInit(): void {
    const decodedToken = this.authService.usuarioActual;
    this.usuarioActual = decodedToken ? this.usuarioMapperService.mapDecodedTokenToUsuario(decodedToken) : null;
    this.obtenerUsuarios();
  }

  toggleCarrito(): void {
    this.carritoVisible = !this.carritoVisible;
  }

  closeCarrito(): void {
    this.carritoVisible = false;
  }

  obtenerUsuarios(): void {
    if (!this.authService.isAuthenticated()) {
      this.snackBar.open('Error | Debes iniciar sesión para ver los usuarios.', 'Cerrar', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'right'
      });
      return;
    }

    this.usuarioService.listarUsuarios().subscribe({
      next: (data: Usuario[]) => {
        this.usuarios = data;
      },
      error: (err) => {
        console.error('Error al obtener los usuarios:', err);
        this.snackBar.open('Error | No se pudieron cargar los usuarios.', 'Cerrar', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
      }
    });
  }

  eliminarUsuario(email: string): void {
    this.usuarioService.eliminarUsuario(email).subscribe({
      next: () => {
        this.obtenerUsuarios();
        this.snackBar.open('Éxito | Usuario eliminado correctamente.', 'Cerrar', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
      },
      error: (err) => {
        console.error('Error al eliminar el usuario:', err);
        this.snackBar.open('Error | No se pudo eliminar el usuario.', 'Cerrar', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
      }
    });
  }

  editarUsuario(usuario: Usuario): void {
    const dialogRef = this.dialog.open(EditarUsuarioComponent, {
      width: '400px',
      data: { usuario }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.usuarioService.actualizarUsuario(result).subscribe({
          next: () => {
            this.obtenerUsuarios();
            this.snackBar.open('Éxito | Usuario actualizado correctamente.', 'Cerrar', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'right'
            });
          },
          error: (err) => {
            console.error('Error al actualizar el usuario:', err);
            this.snackBar.open('Error | No se pudo actualizar el usuario.', 'Cerrar', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'right'
            });
          }
        });
      }
    });
  }
}
