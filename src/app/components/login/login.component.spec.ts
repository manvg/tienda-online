import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * @description
 * Pruebas unitarias para el componente LoginComponent.
 */
describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  /**
   * @description
   * Configuración inicial del módulo de pruebas y creación del componente.
   */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, RouterModule.forRoot([]), LoginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /**
   * @description
   * Verifica que el componente LoginComponent se crea correctamente.
   */
  it('El componente LOGIN se crea correctamente', () => {
    expect(component).toBeTruthy();
  });

  /**
   * @description
   * Verifica que el formulario de login es inválido cuando está vacío.
   */
  it('Formulario invalido cuando está vacío', () => {
    expect(component.formLogin.valid).toBeFalsy();
  });

  /**
   * @description
   * Verifica que el campo de email es inválido cuando está vacío.
   */
  it('Campo email es inválido cuando está vacío', () => {
    const email = component.formLogin.controls['email'];
    expect(email.valid).toBeFalsy();
    expect(email.errors!['required']).toBeTruthy();
  });

  /**
   * @description
   * Verifica que se muestra un mensaje de error cuando las credenciales son incorrectas.
   */
  it('Mostrar error cuando las credenciales son incorrectas', () => {
    component.formLogin.controls['email'].setValue('prueba@invalida.cl');
    component.formLogin.controls['contrasena'].setValue('contrasenainvalida');
    component.iniciarSesion();
    expect(component.loginError).toBe('Correo o contraseña incorrectos');
  });
});
