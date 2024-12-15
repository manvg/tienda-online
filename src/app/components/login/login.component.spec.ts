import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/autenticacion/auth.service';
import { of, throwError } from 'rxjs';

// Stubs para componentes secundarios
@Component({ selector: 'app-menu', template: '' })
class MockMenuComponent {}

@Component({ selector: 'app-footer', template: '' })
class MockFooterComponent {}

@Component({ selector: 'app-carrito', template: '' })
class MockCarritoComponent {}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: any;

  beforeEach(async () => {
    // Mock del AuthService
    mockAuthService = {
      login: jasmine.createSpy('login').and.returnValue(of({ status: true })),
      usuarioActual: null
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule, // Para los formularios
        RouterTestingModule, // Para simular el Router
        LoginComponent // Importa el LoginComponent como standalone
      ],
      declarations: [MockMenuComponent, MockFooterComponent, MockCarritoComponent], // Stubs para componentes secundarios
      providers: [
        { provide: AuthService, useValue: mockAuthService } // Mock del servicio AuthService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('El componente LOGIN se crea correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('Debe manejar un error del servidor durante el inicio de sesión', () => {
    mockAuthService.login.and.returnValue(throwError({ error: { message: 'Error del servidor' } }));

    component.formLogin.get('email')!.setValue('user@test.com');
    component.formLogin.get('contrasena')!.setValue('wrongpassword');
    component.iniciarSesion();

    expect(component.loginError).toBe('Error del servidor');
    expect(component.loading).toBeFalse();
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
});
