import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Importar esto
import { NO_ERRORS_SCHEMA, Component } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { RegistroComponent } from './registro.component';
import { CarritoService } from '../../services/carrito/carrito.service';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { AuthService } from '../../services/autenticacion/auth.service';

// Stubs para componentes secundarios
@Component({
  selector: 'app-menu',
  template: '',
})
class MockMenuComponent {}

@Component({ selector: 'app-footer', template: '' })
class MockFooterComponent {}

@Component({ selector: 'app-carrito', template: '' })
class MockCarritoComponent {}

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
        BrowserAnimationsModule, // Asegurarse de incluir esto
        RouterTestingModule,
        RegistroComponent,
      ],
      declarations: [MockMenuComponent, MockFooterComponent, MockCarritoComponent],
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

  it('Debe registrar un nuevo usuario cuando el formulario es válido', (done) => {
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

    expect(mockUsuarioService.crearUsuario).toHaveBeenCalled();

    setTimeout(() => {
      expect(component.enviado).toBeFalse();
      done();//Prueba asíncrona finalizada
    }, 0);
  });
});
