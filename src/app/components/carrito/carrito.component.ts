import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CarritoService } from '../../services/carrito/carrito.service';
import { CommonModule, formatCurrency } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductoDto } from '../../models/dto/productoDto.model';

@Component({
  selector: 'app-carrito',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.scss'
})
export class CarritoComponent implements OnInit {
  productos: ProductoDto[] = [];
  precioTotal: number = 0;
  @Output() closeCarrito = new EventEmitter<void>();
  constructor(private carritoService: CarritoService, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.carritoService.productos$.subscribe(productos => {
      this.productos = productos;
    });

    this.carritoService.precioTotal$.subscribe(precioTotal => {
      this.precioTotal = precioTotal;
    });
  }

  eliminarProducto(producto: ProductoDto) {
    const productos = this.productos.filter(p => p.idProducto !== producto.idProducto);
    const precioTotal = productos.reduce((total, p) => total + (parseFloat(p.precio) * p.cantidad), 0);
    this.carritoService.actualizarProductos(productos);
    this.carritoService.actualizarPrecioTotal(precioTotal);
    this.carritoService.actualizarContador(productos.length);

    console.log('Producto eliminado');
  }

  onCloseClick() {
    this.closeCarrito.emit();
  }

  finalizarCompra() {
    this.snackBar.open('En mantenimiento  :(', 'Cerrar', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'right'
    });
  }
}
