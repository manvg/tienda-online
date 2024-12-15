import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Producto } from '../../models/entities/producto.models';
import { ProductoDto } from '../../models/dto/productoDto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = 'http://54.236.97.158:8086/api/productos'; // URL del endpoint del backend

  constructor(private http: HttpClient) {}

  //Obtener todos los productos en módulo
  getProductos(): Observable<ProductoDto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}`).pipe(
      map((productos: Producto[]) =>
        productos.map(producto => ({
          categoria: producto.categoria,
          idProducto: producto.idProducto.toString(),
          imagen: producto.urlImagen,
          titulo: producto.nombre,
          descricion: producto.descripcion,
          precio: producto.precio.toString(),
          cantidad: 0,
        }))
      )
    );
  }


  // Obtener un producto por ID
  getProductoById(id: string): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`);
  }

  // Crear un nuevo producto
  crearProducto(producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, producto);
  }

  // Actualizar un producto existente
  actualizarProducto(producto: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${this.apiUrl}/${producto.idProducto}`, producto);
  }

  // Eliminar un producto
  eliminarProducto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  listarProductosGestion(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}`);
  }
}
