export interface UsuarioDto {
  idUsuario: number | null;
  email: string | null;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  direccion: string;
  telefono: string;
  fechaNacimiento: string;
  perfil: { idPerfil: number; nombre: string } | null;
}
