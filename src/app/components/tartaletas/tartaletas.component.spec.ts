import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProductoService } from '../../services/producto/producto.service';
import { CarritoService } from '../../services/carrito/carrito.service';
import { TartaletasComponent } from './tartaletas.component';
import { AuthService } from '../../services/autenticacion/auth.service';
import { UsuarioMapperService } from '../../services/usuario/usuario-mapper.service';

// **Stubs definitivos** para reemplazar componentes secundarios
@Component({ selector: 'app-menu', template: '' })
class MockMenuComponent {}

@Component({ selector: 'app-footer', template: '' })
class MockFooterComponent {}

@Component({ selector: 'app-carrito', template: '' })
class MockCarritoComponent {}

describe('TartaletasComponent', () => {
  let component: TartaletasComponent;
  let fixture: ComponentFixture<TartaletasComponent>;

  // Mock del ProductoService
  const mockProductoService = {
    getProductos: jasmine.createSpy('getProductos').and.returnValue(of([
      { idProducto: '1', titulo: 'Tartaleta de Limón', categoria: 'tartaletas', imagen: '', descricion: '', precio: '8', cantidad: 1 },
      { idProducto: '2', titulo: 'Tartaleta de Fresa', categoria: 'tartaletas', imagen: '', descricion: '', precio: '9', cantidad: 1 }
    ]))
  };

  // Mock del CarritoService
  const mockCarritoService = {
    contadorCarrito$: of(0), // Simula el observable
    agregarProducto: jasmine.createSpy('agregarProducto')
  };

  // Mock del AuthService
  const mockAuthService = {
    usuarioActual: null, // Simula que no hay usuario autenticado
    logout: jasmine.createSpy('logout')
  };

  // Mock del UsuarioMapperService
  const mockUsuarioMapperService = {
    mapDecodedTokenToUsuario: jasmine.createSpy('mapDecodedTokenToUsuario').and.returnValue(null)
  };

  // Mock del ActivatedRoute
  const mockActivatedRoute = {
    snapshot: { paramMap: { get: () => '1' } }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TartaletasComponent], // Importamos el componente standalone
      declarations: [
        MockMenuComponent, // Stubs de los componentes secundarios
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

    fixture = TestBed.createComponent(TartaletasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('El componente TARTALETAS se crea correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('Debe agregar un producto al carrito', () => {
    const producto = {
      idProducto: '1',
      titulo: 'Tartaleta de Limón',
      categoria: 'tartaletas',
      imagen: '',
      descricion: '',
      precio: '8',
      cantidad: 1
    };
    component.agregarProducto(producto);
    expect(mockCarritoService.agregarProducto).toHaveBeenCalledWith(producto);
  });

  it('Debe obtener productos filtrados por categoría \"tartaletas\"', () => {
    expect(mockProductoService.getProductos).toHaveBeenCalled();
    expect(component.productos.length).toBe(2);
    expect(component.productos[0].titulo).toBe('Tartaleta de Limón');
    expect(component.productos[1].titulo).toBe('Tartaleta de Fresa');
  });

  it('Debe alternar la visibilidad del carrito', () => {
    expect(component.carritoVisible).toBeFalsy();
    component.toggleCarrito();
    expect(component.carritoVisible).toBeTruthy();
    component.toggleCarrito();
    expect(component.carritoVisible).toBeFalsy();
  });

  it('Debe cerrar el carrito correctamente', () => {
    component.carritoVisible = true;
    component.closeCarrito();
    expect(component.carritoVisible).toBeFalsy();
  });
});
