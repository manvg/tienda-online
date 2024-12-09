import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/autenticacion/auth.service';
import { Usuario } from '../../models/dto/usuario.models';
import { UsuarioMapperService } from '../../services/usuario/usuario-mapper.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit {
  usuarioActual: Usuario | null = null;

  constructor(private authService: AuthService, private usuarioMapperService: UsuarioMapperService) {}

  ngOnInit(): void {
    const decodedToken = this.authService.usuarioActual;
    this.usuarioActual = decodedToken ? this.usuarioMapperService.mapDecodedTokenToUsuario(decodedToken) : null;
  }
}
