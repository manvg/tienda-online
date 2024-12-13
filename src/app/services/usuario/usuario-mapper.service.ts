import { Injectable } from '@angular/core';
import { Usuario } from '../../models/dto/usuario.models';
import { DecodedToken } from '../../services/autenticacion/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioMapperService {
  mapDecodedTokenToUsuario(decodedToken: DecodedToken): Usuario {
    return {
      email: decodedToken.email,
      perfil: decodedToken.perfil,
      nombre: decodedToken.nombre,
      apellidos: decodedToken.apellidos,
      direccion: decodedToken.direccion,
      fechaNacimiento: decodedToken.fechaNacimiento,
      telefono: decodedToken.telefono,
      contrasena: ''
    };
  }
}
