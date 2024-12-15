import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { AuthResponse } from '../../models/dto/authResponse.model';
import { DecodedToken } from '../../models/dto/DecodedToken.models';
import { of } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: any;

  const mockToken = 'mocked.jwt.token';
  const decodedToken: DecodedToken = {
    id: 1,
    nombre: 'Manuel',
    email: 'manuel@gmail.com',
    exp: Math.floor(Date.now() / 1000) + 1000,
    perfil: { idPerfil: 1, nombre: 'Administrador' },
    apellidoPaterno: 'Valdés',
    apellidoMaterno: 'Guerra',
    fechaNacimiento: new Date('1990-01-01'),
    telefono: '986542584',
    direccion: 'El Prado Verde sin numero'
  };

  const mockAuthResponse: AuthResponse = {
    status: true,
    message: 'Login exitoso',
    token: mockToken,
  };

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: Router, useValue: routerSpy }],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  //Login exitoso
  it('debe realizar el login y almacenar el token', () => {
    spyOn(localStorage, 'setItem');
    spyOn<any>(service, 'decodeToken').and.returnValue(decodedToken);

    service.login('test@example.com', 'password').subscribe((response) => {
      expect(response).toEqual(mockAuthResponse);
    });

    const req = httpMock.expectOne('http://localhost:8085/api/authentication/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockAuthResponse);

    expect(localStorage.setItem).toHaveBeenCalledWith('token', mockToken);
    expect(service['decodeToken']).toHaveBeenCalledWith(mockToken);
    expect(service.usuarioActual).toEqual(decodedToken);
  });

  //Logout
  it('debe realizar el logout correctamente', () => {
    spyOn(localStorage, 'removeItem');
    service.logout();
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(service.usuarioActual).toBeNull();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  //isAuthenticated retorna true si el token es válido
  it('isAuthenticated debe retornar true si el token no ha expirado', () => {
    spyOn(localStorage, 'getItem').and.returnValue(mockToken);
    spyOn<any>(service, 'decodeToken').and.returnValue(decodedToken);

    const result = service.isAuthenticated();
    expect(result).toBeTrue();
  });

  //isAuthenticated retorna false si el token está expirado
  it('isAuthenticated debe retornar false si el token ha expirado', () => {
    const expiredToken = { ...decodedToken, exp: Math.floor(Date.now() / 1000) - 1000 }; // Token expirado
    spyOn(localStorage, 'getItem').and.returnValue(mockToken);
    spyOn<any>(service, 'decodeToken').and.returnValue(expiredToken);
    spyOn(service, 'logout');

    const result = service.isAuthenticated();
    expect(result).toBeFalse();
    expect(service.logout).toHaveBeenCalled();
  });

  //getToken retorna el token almacenado en localStorage
  it('getToken debe retornar el token almacenado en localStorage', () => {
    spyOn(localStorage, 'getItem').and.returnValue(mockToken);
    const token = service.getToken();
    expect(token).toBe(mockToken);
  });

  //Manejo de errores al decodificar token
  it('debe manejar errores al decodificar el token', () => {
    spyOn(localStorage, 'getItem').and.returnValue(mockToken);
    spyOn<any>(service, 'decodeToken').and.throwError('Error al decodificar el token');

    const result = service.usuarioActual;
    expect(result).toBeNull();
  });
});
