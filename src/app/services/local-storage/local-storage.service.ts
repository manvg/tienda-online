import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UsuarioDto } from '../../models/dto/usuarioDto.models';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private usuarioActualSubject: BehaviorSubject<UsuarioDto | null>;

  public usuarioActual$;

  constructor(private router: Router) {
    const usuarioActivo = this.getItem('usuarioActivo');
    const usuario = usuarioActivo ? JSON.parse(usuarioActivo) : null;
    this.usuarioActualSubject = new BehaviorSubject<UsuarioDto | null>(usuario);
    this.usuarioActual$ = this.usuarioActualSubject.asObservable();
  }

  //#region Métodos generales
  getItem(key: string): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  }

  setItem(key: string, value: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value);
    }
  }

  removeItem(key: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(key);
    }
  }
  //#endregion

  //#region Usuarios

  obtenerUsuarios(): UsuarioDto[] {
    const listaUsuarios = this.getItem('usuarios');
    if (listaUsuarios) {
      return JSON.parse(listaUsuarios);
    }
    return [];
  }

  obtenerUsuarioPorEmail(email: string): UsuarioDto | null {
    const listaUsuarios = this.obtenerUsuarios();
    const usuarioLogin = listaUsuarios.find(user => user.email === email);
    return usuarioLogin ? usuarioLogin : null;
  }

  eliminarUsuario(email: string): void {
    let usuarios = this.obtenerUsuarios();
    usuarios = usuarios.filter(usuario => usuario.email !== email);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
  }
  actualizarUsuario(usuarioActualizado: UsuarioDto): void {
    let usuarios = this.obtenerUsuarios();
    const index = usuarios.findIndex(usuario => usuario.email === usuarioActualizado.email);
    if (index !== -1) {
      usuarios[index] = usuarioActualizado;
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }
  }
  //#endregion

  //#region Login

  iniciarSesion(usuario: UsuarioDto) {
    this.setItem('sesionActiva', 'true');
    this.setItem('usuarioActivo', JSON.stringify(usuario));
    this.usuarioActualSubject.next(usuario);
  }

  cerrarSesion() {
    this.removeItem('sesionActiva');
    this.removeItem('usuarioActivo');
    this.usuarioActualSubject.next(null);
    this.router.navigate(['/login']);
  }

  get usuarioActual(): UsuarioDto | null {
    return this.usuarioActualSubject.value;
  }

  obtenerUsuarioActivo(): UsuarioDto | null {
    const usuarioActivo = this.getItem('usuarioActivo');
    return usuarioActivo ? JSON.parse(usuarioActivo) : null;
  }
  //#endregion
}
