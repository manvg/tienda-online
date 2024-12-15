import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA, Component } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { RegistroComponent } from './registro.component';
import { CarritoService } from '../../services/carrito/carrito.service';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { AuthService } from '../../services/autenticacion/auth.service';
import { fakeAsync, tick } from '@angular/core/testing';
import { Routes } from '@angular/router';
import { flush } from '@angular/core/testing';

// Stubs para componentes secundarios
@Component({ selector: 'app-menu', template: '' })
class MockMenuComponent {}

@Component({ selector: 'app-footer', template: '' })
class MockFooterComponent {}

@Component({ selector: 'app-carrito', template: '' })
class MockCarritoComponent {}

@Component({ template: '' })
class MockLoginComponent {}

const routes: Routes = [
  { path: 'login', component: MockLoginComponent }, //Ruta simulada
];

// Mock de servicios
const mockCarritoService = {
  contadorCarrito$: of(0),
  agregarProducto: jasmine.createSpy('agregarProducto'),
};

const mockUsuarioService = {
  crearUsuario: jasmine.createSpy('crearUsuario').and.returnValue(of({})),
};

const mockAuthService = {
  usuarioActual: null,
};

describe('RegistroComponent', () => {
  let component: RegistroComponent;
  let fixture: ComponentFixture<RegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatSnackBarModule,
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes(routes), // Configura rutas simuladas
        RegistroComponent,
      ],
      declarations: [MockMenuComponent, MockFooterComponent, MockCarritoComponent, MockLoginComponent],
      providers: [
        { provide: CarritoService, useValue: mockCarritoService },
        { provide: UsuarioService, useValue: mockUsuarioService },
        { provide: AuthService, useValue: mockAuthService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('El componente REGISTRO se crea correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('Debe inicializar el formulario correctamente', () => {
    expect(component.formRegistro).toBeDefined();
    expect(component.formRegistro.controls['nombre']).toBeDefined();
    expect(component.formRegistro.controls['correo']).toBeDefined();
    expect(component.formRegistro.controls['contrasena']).toBeDefined();
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

  it('Debe manejar un error al registrar un usuario', (done) => {
    spyOn(console, 'error');
    mockUsuarioService.crearUsuario.and.returnValue(throwError(() => new Error('Error en el servidor')));

    component.formRegistro.patchValue({
      nombre: 'Manuel',
      apellidoPaterno: 'Valdés',
      apellidoMaterno: 'Guerra',
      fechaNacimiento: '1997-01-01',
      direccion: 'Dirección de prueba',
      telefono: '985754685',
      correo: 'mvaldes@gmail.com',
      contrasena: 'Manuel123',
      confirmarContrasena: 'Manuel123',
    });

    component.formularioRegistro();

    setTimeout(() => {
      expect(console.error).toHaveBeenCalledWith('Error al registrar usuario:', jasmine.any(Error));
      expect(component.enviado).toBeTrue();
      done();
    }, 0);
  });

  it('Debe marcar el formulario como inválido si no se completan los campos', () => {
    mockUsuarioService.crearUsuario.calls.reset();

    component.formRegistro.patchValue({
      nombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      fechaNacimiento: '',
      direccion: '',
      telefono: '',
      correo: '',
      contrasena: '',
      confirmarContrasena: '',
    });

    component.enviado = true;

    component.formularioRegistro();

    expect(component.formRegistro.invalid).toBeTrue();

    expect(mockUsuarioService.crearUsuario).not.toHaveBeenCalled();
  });


  it('Debe validar que las contraseñas no coinciden', () => {
    component.formRegistro.patchValue({
      contrasena: 'Manuel123',
      confirmarContrasena: 'OtraContraseña',
    });

    const errors = component.validarIgualdadContrasena(component.formRegistro);
    expect(errors).toEqual({ contrasenasDistintas: true });
  });

  it('Debe validar edad menor a la mínima permitida', () => {
    const control = component.formRegistro.get('fechaNacimiento');
    control?.setValue('2020-01-01'); // Menor de edad

    const result = component.validarEdad(18)(control!);
    expect(result).toEqual({ menorEdad: true });
  });

  it('Debe validar contraseña con menos de 6 caracteres', () => {
    const control = component.formRegistro.get('contrasena');
    control?.setValue('Ab1'); // Inválida

    const result = component.validarContrasena()(control!);
    expect(result).toEqual({ length: 'Largo entre 6 y 18 caracteres' });
  });

  it('Debe limpiar el formulario y restablecer la variable enviado a false', () => {
    // Establece valores iniciales en el formulario
    component.formRegistro.setValue({
      nombre: 'Manuel',
      apellidoPaterno: 'Valdés',
      apellidoMaterno: 'Guerra',
      fechaNacimiento: '1997-01-01',
      direccion: 'Dirección de prueba',
      telefono: '985754685',
      correo: 'mvaldes@gmail.com',
      contrasena: 'Manuel123',
      confirmarContrasena: 'Manuel123',
    });

    // Establece la variable enviado en true
    component.enviado = true;

    // Llama a la función limpiarFormulario
    component.limpiarFormulario();

    // Verifica que el formulario se haya reseteado
    expect(component.formRegistro.pristine).toBeTrue();
    expect(component.formRegistro.value).toEqual({
      nombre: null,
      apellidoPaterno: null,
      apellidoMaterno: null,
      fechaNacimiento: null,
      direccion: null,
      telefono: null,
      correo: null,
      contrasena: null,
      confirmarContrasena: null,
    });

    // Verifica que la variable enviado sea false
    expect(component.enviado).toBeFalse();
  });

});
