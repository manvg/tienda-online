import { Injectable } from '@angular/core';
import { Usuario } from '../../models/entities/usuario.models';
import { DecodedToken } from '../../models/dto/DecodedToken.models';

@Injectable({
  providedIn: 'root'
})
export class UsuarioMapperService {
  mapDecodedTokenToUsuario(decodedToken: DecodedToken): Usuario {
    return {
      email: decodedToken.email,
      perfil: decodedToken.perfil,
      nombre: decodedToken.nombre,
      apellidoPaterno: decodedToken.apellidoPaterno,
      apellidoMaterno: decodedToken.apellidoMaterno,
      direccion: decodedToken.direccion,
      fechaNacimiento: new Date(decodedToken.fechaNacimiento).toISOString().split('T')[0],
      telefono: decodedToken.telefono,
      contrasena: '',
      idUsuario: 0
    };
  }
}
