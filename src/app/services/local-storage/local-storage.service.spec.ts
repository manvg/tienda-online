import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { LocalStorageService } from './local-storage.service';
import { UsuarioDto } from '../../models/dto/usuarioDto.models';

describe('LocalStorageService', () => {
  let service: LocalStorageService;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockUsuario: UsuarioDto = {
    idUsuario: 1,
    nombre: 'Test User',
    email: 'test@example.com',
    apellidoPaterno: 'Paterno',
    apellidoMaterno: 'Materno',
    fechaNacimiento: '1990-01-01',
    direccion: '123 Test Street',
    telefono: '123456789',
    perfil: { idPerfil: 1, nombre: 'Administrador' },
  };

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        LocalStorageService,
        { provide: Router, useValue: routerSpy },
      ],
    });

    service = TestBed.inject(LocalStorageService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('debe crear el servicio correctamente', () => {
    expect(service).toBeTruthy();
  });

  describe('Métodos generales', () => {
    it('debe almacenar un elemento en localStorage', () => {
      service.setItem('key', 'value');
      expect(localStorage.getItem('key')).toBe('value');
    });

    it('debe obtener un elemento de localStorage', () => {
      localStorage.setItem('key', 'value');
      expect(service.getItem('key')).toBe('value');
    });

    it('debe eliminar un elemento de localStorage', () => {
      localStorage.setItem('key', 'value');
      service.removeItem('key');
      expect(localStorage.getItem('key')).toBeNull();
    });
  });

  describe('Usuarios', () => {
    beforeEach(() => {
      const usuarios: UsuarioDto[] = [mockUsuario];
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
    });

    it('debe obtener la lista de usuarios', () => {
      const usuarios = service.obtenerUsuarios();
      expect(usuarios).toEqual([mockUsuario]);
    });

    it('debe actualizar un usuario existente', () => {
      const usuarioActualizado: UsuarioDto = { ...mockUsuario, nombre: 'Updated User' };
      service.actualizarUsuario(usuarioActualizado);

      const usuarios = service.obtenerUsuarios();
      expect(usuarios[0].nombre).toBe('Updated User');
    });
  });

  describe('Login', () => {
    it('debe iniciar sesión y almacenar el usuario actual', () => {
      spyOn(service, 'setItem').and.callThrough();

      service.iniciarSesion(mockUsuario);
      expect(service.usuarioActual).toEqual(mockUsuario);
      expect(service.setItem).toHaveBeenCalledWith('sesionActiva', 'true');
      expect(service.setItem).toHaveBeenCalledWith('usuarioActivo', JSON.stringify(mockUsuario));
    });

    it('debe cerrar sesión y limpiar localStorage', () => {
      spyOn(service, 'removeItem').and.callThrough();

      service.cerrarSesion();
      expect(service.usuarioActual).toBeNull();
      expect(service.removeItem).toHaveBeenCalledWith('sesionActiva');
      expect(service.removeItem).toHaveBeenCalledWith('usuarioActivo');
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('debe obtener el usuario activo correctamente', () => {
      spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(mockUsuario)); // Simula un valor válido
      const usuarioActivo = service.obtenerUsuarioActivo();
      expect(usuarioActivo).toEqual(mockUsuario);
    });

    it('debe manejar el caso donde no hay un usuario activo en localStorage', () => {
      spyOn(localStorage, 'getItem').and.returnValue(null); // Simula un valor null
      const usuarioActivo = service.obtenerUsuarioActivo();
      expect(usuarioActivo).toBeNull();
    });
  });

  describe('Usuarios', () => {
    beforeEach(() => {
      const usuarios: UsuarioDto[] = [mockUsuario];
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
    });

    it('debe obtener un usuario por email si existe', () => {
      // Simulamos que el email está garantizado como string
      const usuario = service.obtenerUsuarioPorEmail(mockUsuario.email!);
      expect(usuario).toEqual(mockUsuario);
    });

    it('debe devolver null si el usuario no existe por email', () => {
      // Simulamos un email inexistente
      const usuario = service.obtenerUsuarioPorEmail('noexiste@example.com');
      expect(usuario).toBeNull();
    });

    it('debe eliminar un usuario por email', () => {
      service.eliminarUsuario(mockUsuario.email!);

      const usuarios = service.obtenerUsuarios();
      const usuarioEliminado = usuarios.find((u: UsuarioDto) => u.email === mockUsuario.email!);

      expect(usuarioEliminado).toBeUndefined();
    });
  });

});
