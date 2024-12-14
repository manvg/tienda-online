import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../services/autenticacion/auth.service';
import { Usuario } from '../../models/entities/usuario.models';
import { UsuarioMapperService } from '../../services/usuario/usuario-mapper.service';
import { CarritoService } from '../../services/carrito/carrito.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  imports: [CommonModule, RouterModule],
})
export class MenuComponent implements OnInit {
  @Output() carritoClicked = new EventEmitter<void>();

  usuarioActual: Usuario | null = null;
  contadorCarrito: number = 0;

  constructor(
    private authService: AuthService,
    private usuarioMapperService: UsuarioMapperService,
    private carritoService: CarritoService
  ) {}

  ngOnInit(): void {
    const decodedToken = this.authService.usuarioActual;
    this.usuarioActual = decodedToken
      ? this.usuarioMapperService.mapDecodedTokenToUsuario(decodedToken)
      : null;

    // Suscribirse a cambios en el carrito
    this.carritoService.contadorCarrito$.subscribe((contador) => {
      this.contadorCarrito = contador;
    });
  }

  cerrarSesion(): void {
    this.authService.logout();
  }

  onCarritoClick(): void {
    this.carritoClicked.emit(); // Comunicar el clic del carrito
  }
}
