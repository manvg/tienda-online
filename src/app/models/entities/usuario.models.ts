export class Usuario {
  idUsuario!: number;
  nombre!: string;
  apellidoPaterno!: string;
  apellidoMaterno!: string;
  email!: string;
  contrasena!: string;
  telefono: string;
  direccion!: string;
  fechaNacimiento!: string;
  perfil!: Perfil;

  constructor(
      idUsuario: number,
      nombre: string,
      apellidoPaterno: string,
      apellidoMaterno: string,
      email: string,
      contrasena: string,
      direccion: string,
      fechaNacimiento: string,
      perfil: Perfil,
      telefono: string
  ) {
      this.idUsuario = idUsuario;
      this.nombre = nombre;
      this.apellidoPaterno = apellidoPaterno;
      this.apellidoMaterno = apellidoMaterno;
      this.email = email;
      this.contrasena = contrasena;
      this.direccion = direccion;
      this.fechaNacimiento = fechaNacimiento;
      this.perfil = perfil;
      this.telefono = telefono;
  }
}

export class Perfil {
  idPerfil!: number;
  nombre!: string;
}
