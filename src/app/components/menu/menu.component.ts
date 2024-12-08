import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CarritoService } from '../../services/carrito/carrito.service';
import { AuthService } from '../../services/autenticacion/auth.service';
import { Usuario } from '../../models/dto/usuario.models';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  @Output() carritoClicked = new EventEmitter<void>();

  contadorCarrito: number = 0;
  usuarioActual: Usuario | null = null;

  constructor(
    private carritoService: CarritoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.carritoService.contadorCarrito$.subscribe(contador => {
      this.contadorCarrito = contador;
    });

    this.usuarioActual = this.authService.usuarioActual;
  }

  onCarritoClick(): void {
    this.carritoClicked.emit();
  }

  cerrarSesion(): void {
    this.authService.logout();
  }
}
