import { Perfil } from "../entities/usuario.models";

export interface DecodedToken {
  id: number;
  email: string;
  perfil: Perfil;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: Date;
  telefono: string;
  direccion: string;
  exp: number;
}
