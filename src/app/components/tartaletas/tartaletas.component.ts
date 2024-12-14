import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../menu/menu.component';
import { FooterComponent } from '../footer/footer.component';
import { CarritoComponent } from '../carrito/carrito.component';
import { CarritoService } from '../../services/carrito/carrito.service';
import { ProductoDto } from '../../models/dto/productoDto.model';
import { ProductoService } from '../../services/producto/producto.service';

@Component({
  selector: 'app-tartaletas',
  standalone: true,
  imports: [CommonModule, RouterModule, MenuComponent, FooterComponent, CarritoComponent],
  templateUrl: './tartaletas.component.html',
  styleUrl: './tartaletas.component.scss'
})
export class TartaletasComponent implements OnInit {
  productos: ProductoDto[] = [];
  titulo: string = 'Tartaletas';
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
      next: (data: ProductoDto[]) => {
        this.productos = data.filter((producto: ProductoDto) => producto.categoria === 'tartaletas');
      },
      error: (err) => {
        console.error('Error al obtener los productos:', err);
      }
    });
  }

  agregarProducto(producto: ProductoDto): void {
    this.carritoService.agregarProducto(producto);
  }

  toggleCarrito(): void {
    this.carritoVisible = !this.carritoVisible;
  }

  closeCarrito(): void {
    this.carritoVisible = false;
  }
}
