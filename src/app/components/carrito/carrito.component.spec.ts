import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarritoComponent } from './carrito.component';
import { CarritoService } from '../../services/carrito/carrito.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { registerLocaleData } from '@angular/common';
import localeEsCL from '@angular/common/locales/es-CL';
import { LOCALE_ID } from '@angular/core';
import { ProductoDto } from '../../models/dto/productoDto.model';

describe('CarritoComponent', () => {
  let component: CarritoComponent;
  let fixture: ComponentFixture<CarritoComponent>;

  const mockCarritoService = {
    productos$: of([]),
    precioTotal$: of(0),
    actualizarProductos: jasmine.createSpy('actualizarProductos'),
    actualizarPrecioTotal: jasmine.createSpy('actualizarPrecioTotal'),
    actualizarContador: jasmine.createSpy('actualizarContador')
  };

  const mockSnackBar = {
    open: jasmine.createSpy('open')
  };

  beforeAll(() => {
    registerLocaleData(localeEsCL);
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarritoComponent],
      providers: [
        { provide: CarritoService, useValue: mockCarritoService },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: LOCALE_ID, useValue: 'es-CL' }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CarritoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Debe mostrar un mensaje de mantenimiento al finalizar la compra', () => {
    component.finalizarCompra();

    expect(mockSnackBar.open).toHaveBeenCalledWith(
      'En mantenimiento  :(',
      'Cerrar',
      {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'right'
      }
    );
  });

  it('Debe eliminar un producto del carrito correctamente', () => {
    const producto1: ProductoDto = {
      categoria: 'categoria1',
      idProducto: '1',
      imagen: 'imagen1.png',
      titulo: 'Producto 1',
      descricion: 'Descripción 1',
      precio: '100',
      cantidad: 1
    };

    const producto2: ProductoDto = {
      categoria: 'categoria2',
      idProducto: '2',
      imagen: 'imagen2.png',
      titulo: 'Producto 2',
      descricion: 'Descripción 2',
      precio: '200',
      cantidad: 2
    };

    component.productos = [producto1, producto2];

    component.eliminarProducto(producto1);

    expect(mockCarritoService.actualizarProductos).toHaveBeenCalledWith([producto2]);
    expect(mockCarritoService.actualizarPrecioTotal).toHaveBeenCalledWith(400); // 200 * 2
    expect(mockCarritoService.actualizarContador).toHaveBeenCalledWith(1);
  });


});
