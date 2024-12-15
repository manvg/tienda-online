import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MiCuentaComponent } from './mi-cuenta.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { NO_ERRORS_SCHEMA, Component } from '@angular/core';
import { of, throwError } from 'rxjs';
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
  let mockSnackBar: MatSnackBar;

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
    cambiarContrasena: jasmine.createSpy('cambiarContrasena').and.returnValue(of({ status: true })), // Nuevo método mockeado
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
    mockSnackBar = TestBed.inject(MatSnackBar);
    fixture.detectChanges();
  });

  it('El componente MI CUENTA se crea correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('Debe actualizar los datos personales correctamente', () => {
    // Arrange
    spyOn(mockSnackBar, 'open');
    mockUsuarioService.actualizarDatosPersonales.and.returnValue(of({ status: true }));

    // Establecer valores iniciales del usuarioActivo
    component.usuarioActivo = {
      idUsuario: 1,
      nombre: 'Manuel',
      apellidoPaterno: 'Valdés',
      apellidoMaterno: 'Guerra',
      direccion: 'El Prado Verde sn', // Valor inicial
      telefono: '985785469', // Valor inicial
      fechaNacimiento: '1997-01-01',
      perfil: { idPerfil: 2, nombre: 'Cliente' },
      email: 'manuel@gmail.com',
    };

    const usuarioActualizado = {
      ...component.usuarioActivo,
      direccion: 'Prueba de cambio de direccion',
      telefono: '985456855',
    };

    component.miCuentaForm.setValue({
      nombre: 'Manuel',
      apellidoPaterno: 'Valdés',
      apellidoMaterno: 'Guerra',
      direccion: 'Prueba de cambio de direccion',
      telefono: '985456855',
      fechaNacimiento: '1997-01-01',
    });

    component.onGuardarDatosPersonales();

    expect(mockUsuarioService.actualizarDatosPersonales).toHaveBeenCalledWith(usuarioActualizado);

    expect(mockSnackBar.open).toHaveBeenCalledWith(
      'Éxito | Datos personales actualizados correctamente.',
      'Cerrar',
      jasmine.any(Object)
    );

    expect(component.enviadoDatosPersonales).toBeFalse();
  });

  it('Debe alternar la visibilidad del carrito', () => {
    expect(component.carritoVisible).toBeFalse();

    component.toggleCarrito();
    expect(component.carritoVisible).toBeTrue();

    component.toggleCarrito();
    expect(component.carritoVisible).toBeFalse();
  });

  it('Debe cerrar el carrito correctamente', () => {
    component.carritoVisible = true;

    component.closeCarrito();

    expect(component.carritoVisible).toBeFalse();
  });

  it('Debe actualizar la contraseña correctamente cuando el formulario es válido', () => {
    spyOn(mockSnackBar, 'open');
    mockUsuarioService.cambiarContrasena.and.returnValue(of({ status: true }));

    component.cambiarContrasenaForm.setValue({
      contrasenaActual: 'ContraseñaActual123',
      nuevaContrasena: 'NuevaContraseña123',
    });

    component.onGuardarNuevaContrasena();

    expect(mockUsuarioService.cambiarContrasena).toHaveBeenCalledWith('NuevaContraseña123');

    expect(mockSnackBar.open).toHaveBeenCalledWith(
      'Éxito | Contraseña actualizada correctamente.',
      'Cerrar',
      jasmine.any(Object)
    );
    expect(component.enviadoCambiarContrasena).toBeFalse();
    expect(component.cambiarContrasenaForm.pristine).toBeTrue();
  });

  it('Debe mostrar un error si la contraseña no pudo ser actualizada', () => {
    spyOn(mockSnackBar, 'open');
    mockUsuarioService.cambiarContrasena.and.returnValue(throwError(() => ({ error: 'Error en el servidor' })));

    component.cambiarContrasenaForm.setValue({
      contrasenaActual: 'ContraseñaActual123',
      nuevaContrasena: 'NuevaContraseña123',
    });

    component.onGuardarNuevaContrasena();

    expect(mockUsuarioService.cambiarContrasena).toHaveBeenCalledWith('NuevaContraseña123');
    expect(mockSnackBar.open).toHaveBeenCalledWith(
      'Error | La contraseña no pudo ser actualizada.',
      'Cerrar',
      jasmine.any(Object)
    );
  });

  it('Debe marcar todos los campos como tocados si el formulario no es válido', () => {
    spyOn(mockSnackBar, 'open');
    mockUsuarioService.cambiarContrasena.calls.reset();

    //Formulario con valores inválidos
    component.cambiarContrasenaForm.setValue({
      contrasenaActual: '', //Vacío (inválido)
      nuevaContrasena: '',  //Vacío (inválido)
    });

    expect(component.cambiarContrasenaForm.valid).toBeFalse();

    component.onGuardarNuevaContrasena();

    expect(mockUsuarioService.cambiarContrasena).not.toHaveBeenCalled();
    expect(component.cambiarContrasenaForm.get('contrasenaActual')?.touched).toBeTrue();
    expect(component.cambiarContrasenaForm.get('nuevaContrasena')?.touched).toBeTrue();
    expect(mockSnackBar.open).not.toHaveBeenCalled();
  });

  it('Debe mostrar y ocultar los formularios correctamente al llamar a toggleFormulario', () => {
    //Crear elementos simulados en el DOM
    const formularioDatosPersonales = document.createElement('div');
    formularioDatosPersonales.id = 'formulario-datos-personales';
    formularioDatosPersonales.style.display = 'none'; //Estado inicial

    const formularioCambiarContrasena = document.createElement('div');
    formularioCambiarContrasena.id = 'formulario-cambiar-contrasena';
    formularioCambiarContrasena.style.display = 'none'; //Estado inicial

    document.body.appendChild(formularioDatosPersonales);
    document.body.appendChild(formularioCambiarContrasena);

    //Llamar al método con 'datos-personales'
    component.toggleFormulario('datos-personales');

    //Verificar que se muestran y ocultan correctamente
    expect(formularioDatosPersonales.style.display).toBe('block');
    expect(formularioCambiarContrasena.style.display).toBe('none');

    //Llamar al método con 'cambiar-contrasena'
    component.toggleFormulario('cambiar-contrasena');

    //Verificar que se muestran y ocultan correctamente
    expect(formularioDatosPersonales.style.display).toBe('none');
    expect(formularioCambiarContrasena.style.display).toBe('block');

    document.body.removeChild(formularioDatosPersonales);
    document.body.removeChild(formularioCambiarContrasena);
  });


  it('Debe retornar error si la edad es menor a 18 años', () => {
    const control = component.miCuentaForm.get('fechaNacimiento');
    control?.setValue('2020-01-01'); // Fecha que hace la edad menor a 18

    const edadError = component.validarEdad(18)(control!);
    expect(edadError).toEqual({ menorEdad: 'Debes ser mayor de 18 años.' });
  });

});
