import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MiCuentaComponent } from './mi-cuenta.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NO_ERRORS_SCHEMA, Component } from '@angular/core';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { AuthService } from '../../services/autenticacion/auth.service';
import { UsuarioMapperService } from '../../services/usuario/usuario-mapper.service';

// Stub para componentes secundarios
@Component({ selector: 'app-menu', template: '' })
class MockMenuComponent {}

@Component({ selector: 'app-footer', template: '' })
class MockFooterComponent {}

@Component({ selector: 'app-carrito', template: '' })
class MockCarritoComponent {}

describe('MiCuentaComponent', () => {
  let component: MiCuentaComponent;
  let fixture: ComponentFixture<MiCuentaComponent>;

  // Mocks de servicios
  const mockAuthService = {
    usuarioActual: { id: 1, nombre: 'Usuario Test', email: 'test@example.com' },
    logout: jasmine.createSpy('logout'),
  };

  const mockUsuarioService = {
    obtenerUsuarioPorId: jasmine.createSpy('obtenerUsuarioPorId').and.returnValue(of({
      idUsuario: 1,
      nombre: 'Manuel',
      apellidoPaterno: 'Valdés',
      apellidoMaterno: 'Guerra',
      direccion: 'El Prado Verde s/n',
      telefono: '985785469',
      fechaNacimiento: '1997-01-01',
      perfil: { idPerfil: 2, nombre: 'Cliente' },
      email: 'manuel@gmail.com',
    })),
    actualizarDatosPersonales: jasmine.createSpy('actualizarDatosPersonales').and.returnValue(of({ status: true })),
    cambiarContrasena: jasmine.createSpy('cambiarContrasena').and.returnValue(of({ status: true })),
  };

  const mockUsuarioMapperService = {
    mapDecodedTokenToUsuario: jasmine.createSpy('mapDecodedTokenToUsuario').and.returnValue(null),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatSnackBarModule,
        RouterTestingModule,
        HttpClientTestingModule,
        MiCuentaComponent,
      ],
      declarations: [MockMenuComponent, MockFooterComponent, MockCarritoComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UsuarioService, useValue: mockUsuarioService },
        { provide: UsuarioMapperService, useValue: mockUsuarioMapperService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MiCuentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('El componente MI CUENTA se crea correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('Debe inicializar el formulario de datos personales correctamente', () => {
    expect(component.miCuentaForm).toBeDefined();
    expect(component.miCuentaForm.controls['nombre']).toBeDefined();
    expect(component.miCuentaForm.controls['apellidoPaterno']).toBeDefined();
    expect(component.miCuentaForm.controls['apellidoMaterno']).toBeDefined();
    expect(component.miCuentaForm.controls['telefono']).toBeDefined();
  });

  it('Debe obtener datos del usuario al inicializar', () => {
    expect(mockUsuarioService.obtenerUsuarioPorId).toHaveBeenCalledWith(1);
    expect(component.usuarioActivo).toEqual(jasmine.objectContaining({
      idUsuario: 1,
      nombre: 'Manuel',
      email: 'manuel@gmail.com',
    }));
  });
});
