export class Producto {
  idProducto: number;
  categoria: string;
  nombre: string;
  descripcion: string;
  precio: number;
  urlImagen: string;

  constructor(
    idProducto: number,
    categoria: string,
    nombre: string,
    descripcion: string,
    precio: number,
    urlImagen: string
  ) {
    this.idProducto = idProducto;
    this.categoria = categoria;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precio = precio;
    this.urlImagen = urlImagen;
  }
}
