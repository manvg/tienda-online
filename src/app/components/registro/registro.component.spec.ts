import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroComponent } from './registro.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { CarritoService } from '../../services/carrito/carrito.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

/**
 * @description
 * Pruebas unitarias para el componente RegistroComponent.
 */
describe('RegistroComponent', () => {
  let component: RegistroComponent;
  let fixture: ComponentFixture<RegistroComponent>;

  /**
   * @description
   * Mock del servicio LocalStorageService.
   */
  let mockLocalStorageService = {
    getItem: jasmine.createSpy('getItem').and.returnValue(null),
    setItem: jasmine.createSpy('setItem'),
    usuarioActual$: of(null),
    cerrarSesion: jasmine.createSpy('cerrarSesion')
  };

  /**
   * @description
   * Mock del servicio CarritoService.
   */
  let mockCarritoService = {
    contadorCarrito$: of(0),
    productos$: of([]),
    precioTotal$: of(0),
    actualizarProductos: jasmine.createSpy('actualizarProductos'),
    actualizarPrecioTotal: jasmine.createSpy('actualizarPrecioTotal'),
    actualizarContador: jasmine.createSpy('actualizarContador')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, RouterModule.forRoot([]), RegistroComponent],
      providers: [
        { provide: LocalStorageService, useValue: mockLocalStorageService },
        { provide: CarritoService, useValue: mockCarritoService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /**
   * @description
   * Verifica que el componente RegistroComponent se crea correctamente.
   */
  it('El componente REGISTRO se crea correctamente', () => {
    expect(component).toBeTruthy();
  });

  /**
   * @description
   * Verifica que el formulario de registro es inválido cuando está vacío.
   */
  it('Formulario inválido cuando está vacío', () => {
    expect(component.formRegistro.valid).toBeFalsy();
  });

  /**
   * @description
   * Verifica que el campo nombre es inválido cuando está vacío.
   */
  it('Campo nombre es inválido cuando está vacío', () => {
    const nombre = component.formRegistro.controls['nombre'];
    expect(nombre.valid).toBeFalsy();
    expect(nombre.errors!['required']).toBeTruthy();
  });

  /**
   * @description
   * Verifica que la validación de la edad mínima funciona correctamente.
   */
  it('Debe validar la edad mínima correctamente', () => {
    const fechaNacimiento = component.formRegistro.controls['fechaNacimiento'];
    fechaNacimiento.setValue('2020-01-01');
    expect(fechaNacimiento.valid).toBeFalsy();
    expect(fechaNacimiento.errors!['menorEdad']).toBeTruthy();
  });

  /**
   * @description
   * Verifica que las contraseñas coincidan.
   */
  it('Debe validar que las contraseñas coincidan', () => {
    component.formRegistro.controls['contrasena'].setValue('Prueba123');
    component.formRegistro.controls['confirmarContrasena'].setValue('Test321');
    expect(component.formRegistro.errors!['contrasenasDistintas']).toBeTruthy();
  });

  /**
   * @description
   * Verifica que el formulario se limpia correctamente.
   */
  it('Debe limpiar el formulario correctamente', () => {
    component.limpiarFormulario();
    expect(component.formRegistro.controls['nombre'].value).toBe('');
    expect(component.formRegistro.controls['apellidos'].value).toBe('');
    expect(component.formRegistro.controls['direccion'].value).toBe('');
    expect(component.formRegistro.controls['fechaNacimiento'].value).toBe('');
    expect(component.formRegistro.controls['correo'].value).toBe('');
    expect(component.formRegistro.controls['contrasena'].value).toBe('');
    expect(component.formRegistro.controls['confirmarContrasena'].value).toBe('');
  });

  /**
   * @description
   * Verifica que se agrega un nuevo usuario si el formulario es válido.
   */
  it('Debe agregar un nuevo usuario si el formulario es válido', () => {
    component.formRegistro.controls['nombre'].setValue('Manuel');
    component.formRegistro.controls['apellidos'].setValue('Valdés');
    component.formRegistro.controls['fechaNacimiento'].setValue('2022-01-01');
    component.formRegistro.controls['direccion'].setValue('Dirección de prueba');
    component.formRegistro.controls['telefono'].setValue('987654321');
    component.formRegistro.controls['correo'].setValue('mvaldesg@gmail.com');
    component.formRegistro.controls['contrasena'].setValue('Manuel123');
    component.formRegistro.controls['confirmarContrasena'].setValue('Manuel123');

    component.formularioRegistro();

    expect(mockLocalStorageService.setItem).toHaveBeenCalled();
    expect(component.arrayUsuarios.length).toBe(1);
  });
});
