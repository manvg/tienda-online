import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Usuario } from '../../models/entities/usuario.models';
import { UsuarioDto } from '../../models/dto/usuarioDto.models';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost:8085/api/usuarios';

  constructor(private http: HttpClient) {}

  listarUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}`);
  }

  obtenerUsuarioPorId(idUsuario: number): Observable<Usuario | null> {
    return this.http.get<Usuario | null>(`${this.apiUrl}/${idUsuario}`);
  }
  obtenerUsuarioPorEmail(email: string): Observable<Usuario | null> {
    return this.http.get<Usuario | null>(`${this.apiUrl}/email/${email}`);
  }

  crearUsuario(usuario: Usuario): Observable<any> {
    return this.http.post(`${this.apiUrl}`, usuario);
  }

  actualizarUsuario(usuarioActualizado: Usuario): Observable<any> {
    return this.http.put(`${this.apiUrl}/${usuarioActualizado.idUsuario}`, usuarioActualizado);
  }

  actualizarDatosPersonales(datosPersonales: Partial<UsuarioDto>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${datosPersonales.idUsuario}/datos-personales`, datosPersonales);
  }

  eliminarUsuario(email: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${email}`);
  }
}
