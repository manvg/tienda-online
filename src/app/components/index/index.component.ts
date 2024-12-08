import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../menu/menu.component';
import { FooterComponent } from '../footer/footer.component';
import { CarritoComponent } from '../carrito/carrito.component';
import { CarritoService } from '../../services/carrito/carrito.service';
import { Producto } from '../../models/dto/producto.model';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, RouterModule, MenuComponent, FooterComponent, CarritoComponent],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss'
})
export class IndexComponent {

  carritoVisible: boolean = false;
  constructor(private carritoService: CarritoService) {}
  ngOnInit() {}

  agregarProducto(producto: Producto) {
    this.carritoService.agregarProducto(producto);
  }

  toggleCarrito() {
    this.carritoVisible = !this.carritoVisible;
  }

  closeCarrito() {
    this.carritoVisible = false;
  }
}
