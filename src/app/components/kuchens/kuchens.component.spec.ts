import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProductoService } from '../../services/producto/producto.service';
import { CarritoService } from '../../services/carrito/carrito.service';
import { KuchensComponent } from './kuchens.component';
import { AuthService } from '../../services/autenticacion/auth.service';
import { UsuarioMapperService } from '../../services/usuario/usuario-mapper.service';

// **Stubs definitivos** para reemplazar componentes secundarios
@Component({ selector: 'app-menu', template: '' })
class MockMenuComponent {}

@Component({ selector: 'app-footer', template: '' })
class MockFooterComponent {}

@Component({ selector: 'app-carrito', template: '' })
class MockCarritoComponent {}

describe('KuchensComponent', () => {
  let component: KuchensComponent;
  let fixture: ComponentFixture<KuchensComponent>;

  //Mock del ProductoService
  const mockProductoService = {
    getProductos: jasmine.createSpy('getProductos').and.returnValue(of([
      { idProducto: '1', titulo: 'Kuchen de Manzana', categoria: 'kuchen', imagen: '', descricion: '', precio: '10', cantidad: 1 },
      { idProducto: '2', titulo: 'Kuchen de Frambuesa', categoria: 'kuchen', imagen: '', descricion: '', precio: '15', cantidad: 1 }
    ]))
  };

  //Mock del CarritoService
  const mockCarritoService = {
    contadorCarrito$: of(0), // Simula el observable para evitar errores
    agregarProducto: jasmine.createSpy('agregarProducto')
  };

  //Mock del AuthService
  const mockAuthService = {
    usuarioActual: null, // Simula que no hay usuario autenticado
    logout: jasmine.createSpy('logout')
  };

  //Mock del UsuarioMapperService
  const mockUsuarioMapperService = {
    mapDecodedTokenToUsuario: jasmine.createSpy('mapDecodedTokenToUsuario').and.returnValue(null)
  };

  //Mock del ActivatedRoute
  const mockActivatedRoute = {
    snapshot: { paramMap: { get: () => '1' } }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, KuchensComponent],
      declarations: [
        MockMenuComponent,
        MockFooterComponent,
        MockCarritoComponent
      ],
      providers: [
        { provide: ProductoService, useValue: mockProductoService },
        { provide: CarritoService, useValue: mockCarritoService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: UsuarioMapperService, useValue: mockUsuarioMapperService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(KuchensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('El componente KUCHENS se crea correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('Debe agregar un producto al carrito', () => {
    const producto = {
      idProducto: '1',
      titulo: 'Kuchen de Manzana',
      categoria: 'kuchen',
      imagen: '',
      descricion: '',
      precio: '10',
      cantidad: 1
    };
    component.agregarProducto(producto);
    expect(mockCarritoService.agregarProducto).toHaveBeenCalledWith(producto);
  });

  it('Debe obtener productos filtrados por categoría \"kuchen\"', () => {
    expect(mockProductoService.getProductos).toHaveBeenCalled();
    expect(component.productos.length).toBe(2);
    expect(component.productos[0].titulo).toBe('Kuchen de Manzana');
    expect(component.productos[1].titulo).toBe('Kuchen de Frambuesa');
  });
});
