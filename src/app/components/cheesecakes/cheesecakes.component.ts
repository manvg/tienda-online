import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../menu/menu.component';
import { FooterComponent } from '../footer/footer.component';
import { CarritoComponent } from '../carrito/carrito.component';
import { CarritoService } from '../../services/carrito/carrito.service';
import { Producto } from '../../models/dto/producto.model';
import { ProductoService } from '../../services/producto/producto.service';

@Component({
  selector: 'app-cheesecakes',
  standalone: true,
  imports: [CommonModule, RouterModule, MenuComponent, FooterComponent, CarritoComponent],
  templateUrl: './cheesecakes.component.html',
  styleUrl: './cheesecakes.component.scss'
})
export class CheesecakesComponent implements OnInit {
  productos: Producto[] = [];
  titulo: string = 'Cheesecakes';
  carritoVisible: boolean = false;

  constructor(
    private carritoService: CarritoService,
    private productoService: ProductoService
  ) {}

  ngOnInit(): void {
    this.obtenerProductos();
  }

  obtenerProductos(): void {
    this.productoService.getProductos().subscribe({
      next: (data: Producto[]) => {
        this.productos = data.filter((producto: Producto) => producto.categoria === 'cheesecake');
      },
      error: (err) => {
        console.error('Error al obtener los productos:', err);
      }
    });
  }

  agregarProducto(producto: Producto): void {
    this.carritoService.agregarProducto(producto);
  }

  toggleCarrito(): void {
    this.carritoVisible = !this.carritoVisible;
  }

  closeCarrito(): void {
    this.carritoVisible = false;
  }
}
