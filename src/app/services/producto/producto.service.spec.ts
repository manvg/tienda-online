import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductoService } from './producto.service';
import { Producto } from '../../models/entities/producto.models';
import { ProductoDto } from '../../models/dto/productoDto.model';

describe('ProductoService', () => {
  let service: ProductoService;
  let httpMock: HttpTestingController;

  const apiUrl = 'http://localhost:8086/api/productos';

  const mockProductos: Producto[] = [
    {
      idProducto: 1,
      nombre: 'Producto 1',
      descripcion: 'Descripción 1',
      categoria: 'Categoría 1',
      precio: 100,
      urlImagen: 'imagen1.jpg',
    },
    {
      idProducto: 2,
      nombre: 'Producto 2',
      descripcion: 'Descripción 2',
      categoria: 'Categoría 2',
      precio: 200,
      urlImagen: 'imagen2.jpg',
    },
  ];

  const mockProductoDto: ProductoDto[] = [
    {
      idProducto: '1',
      titulo: 'Producto 1',
      descricion: 'Descripción 1',
      categoria: 'Categoría 1',
      precio: '100',
      imagen: 'imagen1.jpg',
      cantidad: 0,
    },
    {
      idProducto: '2',
      titulo: 'Producto 2',
      descricion: 'Descripción 2',
      categoria: 'Categoría 2',
      precio: '200',
      imagen: 'imagen2.jpg',
      cantidad: 0,
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductoService],
    });

    service = TestBed.inject(ProductoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('Debe obtener todos los productos y mapearlos a ProductoDto', () => {
    service.getProductos().subscribe((productos: ProductoDto[]) => {
      expect(productos.length).toBe(2);
      expect(productos).toEqual(mockProductoDto);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockProductos);
  });

  it('Debe obtener un producto por su ID', () => {
    const productoId = '1';

    service.getProductoById(productoId).subscribe((producto: Producto) => {
      expect(producto).toEqual(mockProductos[0]);
    });

    const req = httpMock.expectOne(`${apiUrl}/${productoId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProductos[0]);
  });

  it('Debe crear un nuevo producto', () => {
    const nuevoProducto: Producto = {
      idProducto: 3,
      nombre: 'Producto 3',
      descripcion: 'Descripción 3',
      categoria: 'Categoría 3',
      precio: 300,
      urlImagen: 'imagen3.jpg',
    };

    service.crearProducto(nuevoProducto).subscribe((producto: Producto) => {
      expect(producto).toEqual(nuevoProducto);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(nuevoProducto);
    req.flush(nuevoProducto);
  });

  it('Debe actualizar un producto existente', () => {
    const productoActualizado: Producto = {
      idProducto: 1,
      nombre: 'Producto 1 Actualizado',
      descripcion: 'Descripción Actualizada',
      categoria: 'Categoría 1',
      precio: 150,
      urlImagen: 'imagen1_actualizada.jpg',
    };

    service.actualizarProducto(productoActualizado).subscribe((producto: Producto) => {
      expect(producto).toEqual(productoActualizado);
    });

    const req = httpMock.expectOne(`${apiUrl}/${productoActualizado.idProducto}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(productoActualizado);
    req.flush(productoActualizado);
  });


  it('Debe eliminar un producto por su ID', () => {
    const productoId = 1;

    service.eliminarProducto(productoId).subscribe((response) => {
      expect(response).toBeNull(); // Verifica que la respuesta sea null
    });

    const req = httpMock.expectOne(`${apiUrl}/${productoId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null); // Simula una respuesta null del backend
  });


  it('Debe listar los productos para gestión', () => {
    service.listarProductosGestion().subscribe((productos: Producto[]) => {
      expect(productos.length).toBe(2);
      expect(productos).toEqual(mockProductos);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockProductos);
  });
});
