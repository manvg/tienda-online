import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UsuarioService } from './usuario.service';
import { Usuario } from '../../models/entities/usuario.models';
import { UsuarioDto } from '../../models/dto/usuarioDto.models';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let httpMock: HttpTestingController;

  const mockUsuario: Usuario = {
    idUsuario: 1,
    nombre: 'Usuario Test',
    email: 'test@example.com',
    apellidoPaterno: 'Apellido1',
    apellidoMaterno: 'Apellido2',
    fechaNacimiento: '1990-01-01', // Usar string para cumplir con el modelo original
    direccion: 'Calle Falsa 123',
    telefono: '123456789',
    perfil: { idPerfil: 1, nombre: 'Cliente' },
    contrasena: 'password123', // Agregada la propiedad faltante
  };

  const mockUsuarioDto: UsuarioDto = {
    idUsuario: 1,
    nombre: 'Usuario Test',
    apellidoPaterno: 'Apellido1',
    apellidoMaterno: 'Apellido2',
    fechaNacimiento: '1990-01-01', // Usar string para cumplir con el modelo original
    direccion: 'Calle Falsa 123',
    telefono: '123456789',
    perfil: { idPerfil: 1, nombre: 'Cliente' },
    email: 'test@example.com',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsuarioService],
    });

    service = TestBed.inject(UsuarioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe listar usuarios', () => {
    service.listarUsuarios().subscribe((usuarios) => {
      expect(usuarios).toEqual([mockUsuario]);
    });

    const req = httpMock.expectOne('http://localhost:8085/api/usuarios');
    expect(req.request.method).toBe('GET');
    req.flush([mockUsuario]);
  });

  it('debe obtener un usuario por ID', () => {
    service.obtenerUsuarioPorId(1).subscribe((usuario) => {
      expect(usuario).toEqual(mockUsuario);
    });

    const req = httpMock.expectOne('http://localhost:8085/api/usuarios/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsuario);
  });

  it('debe obtener un usuario por email', () => {
    service.obtenerUsuarioPorEmail('test@example.com').subscribe((usuario) => {
      expect(usuario).toEqual(mockUsuario);
    });

    const req = httpMock.expectOne('http://localhost:8085/api/usuarios/email/test@example.com');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsuario);
  });

  it('debe crear un usuario', () => {
    service.crearUsuario(mockUsuario).subscribe((response) => {
      expect(response).toEqual({ status: true });
    });

    const req = httpMock.expectOne('http://localhost:8085/api/usuarios');
    expect(req.request.method).toBe('POST');
    req.flush({ status: true });
  });

  it('debe actualizar un usuario', () => {
    service.actualizarUsuario(mockUsuario).subscribe((response) => {
      expect(response).toEqual({ status: true });
    });

    const req = httpMock.expectOne(`http://localhost:8085/api/usuarios/${mockUsuario.idUsuario}`);
    expect(req.request.method).toBe('PUT');
    req.flush({ status: true });
  });

  it('debe actualizar los datos personales', () => {
    service.actualizarDatosPersonales(mockUsuarioDto).subscribe((response) => {
      expect(response).toEqual({ status: true });
    });

    const req = httpMock.expectOne(`http://localhost:8085/api/usuarios/${mockUsuarioDto.idUsuario}/datos-personales`);
    expect(req.request.method).toBe('PUT');
    req.flush({ status: true });
  });

  it('debe eliminar un usuario por email', () => {
    service.eliminarUsuario('test@example.com').subscribe((response) => {
      expect(response).toBeNull(); // Cambiado a `toBeNull` porque `flush` devuelve `null`
    });

    const req = httpMock.expectOne('http://localhost:8085/api/usuarios/test@example.com');
    expect(req.request.method).toBe('DELETE');
    req.flush(null); // Asegurarse de devolver `null` como respuesta simulada
  });


  it('debe cambiar la contraseña del usuario', () => {
    const nuevaContrasena = 'nuevaContrasena123';
    localStorage.setItem('token', 'mockToken');

    service.cambiarContrasena(nuevaContrasena).subscribe((response) => {
      expect(response).toEqual({ status: true });
    });

    const req = httpMock.expectOne('http://localhost:8085/api/usuarios/cambiar-contrasena');
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('Authorization')).toBe('Bearer mockToken');
    req.flush({ status: true });
  });
});
