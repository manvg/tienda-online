import { TestBed } from '@angular/core/testing';
import { CarritoService } from './carrito.service';
import { ProductoDto } from '../../models/dto/productoDto.model';

describe('CarritoService', () => {
  let service: CarritoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarritoService);
  });

  it('Debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('Debe agregar un producto al carrito si no existe previamente', () => {
    const producto: ProductoDto = {
      idProducto: '1',
      categoria: 'Electrónica',
      imagen: 'imagen.png',
      titulo: 'Celular',
      descricion: 'Descripción del producto',
      precio: '1000',
      cantidad: 1
    };

    service.agregarProducto(producto);

    service.productos$.subscribe((productos) => {
      expect(productos.length).toBe(1);
      expect(productos[0].idProducto).toBe('1');
      expect(productos[0].cantidad).toBe(1);
    });

    service.precioTotal$.subscribe((precioTotal) => {
      expect(precioTotal).toBe(1000);
    });

    service.contadorCarrito$.subscribe((contador) => {
      expect(contador).toBe(1);
    });
  });

  it('Debe incrementar la cantidad del producto si ya existe en el carrito', () => {
    const producto: ProductoDto = {
      idProducto: '1',
      categoria: 'Electrónica',
      imagen: 'imagen.png',
      titulo: 'Celular',
      descricion: 'Descripción del producto',
      precio: '1000',
      cantidad: 1
    };

    service.agregarProducto(producto);
    service.agregarProducto(producto);

    service.productos$.subscribe((productos) => {
      expect(productos.length).toBe(1);
      expect(productos[0].cantidad).toBe(2);
    });

    service.precioTotal$.subscribe((precioTotal) => {
      expect(precioTotal).toBe(2000);
    });

    service.contadorCarrito$.subscribe((contador) => {
      expect(contador).toBe(1); //El contador no aumenta, solo la cantidad
    });
  });

  it('Debe actualizar el contador del carrito', () => {
    service.actualizarContador(5);

    service.contadorCarrito$.subscribe((contador) => {
      expect(contador).toBe(5);
    });
  });

  it('Debe actualizar la lista de productos', () => {
    const productos: ProductoDto[] = [
      {
        idProducto: '1',
        categoria: 'Electrónica',
        imagen: 'imagen1.png',
        titulo: 'Producto 1',
        descricion: 'Descripción 1',
        precio: '500',
        cantidad: 1
      },
      {
        idProducto: '2',
        categoria: 'Electrónica',
        imagen: 'imagen2.png',
        titulo: 'Producto 2',
        descricion: 'Descripción 2',
        precio: '1500',
        cantidad: 2
      }
    ];

    service.actualizarProductos(productos);

    service.productos$.subscribe((productosActualizados) => {
      expect(productosActualizados.length).toBe(2);
      expect(productosActualizados[0].idProducto).toBe('1');
      expect(productosActualizados[1].idProducto).toBe('2');
    });
  });

  it('Debe actualizar el precio total del carrito', () => {
    service.actualizarPrecioTotal(3500);

    service.precioTotal$.subscribe((precioTotal) => {
      expect(precioTotal).toBe(3500);
    });
  });
});
