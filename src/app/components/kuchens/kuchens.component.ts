import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../menu/menu.component';
import { FooterComponent } from '../footer/footer.component';
import { CarritoComponent } from '../carrito/carrito.component';
import { CarritoService } from '../../services/carrito/carrito.service';
import { Producto } from '../../models/dto/producto.model';
import { StorageService } from '../../services/storage/storage.service';

@Component({
  selector: 'app-kuchens',
  standalone: true,
  imports: [CommonModule, RouterModule, MenuComponent, FooterComponent, CarritoComponent],
  templateUrl: './kuchens.component.html',
  styleUrl: './kuchens.component.scss'
})
export class KuchensComponent implements OnInit {
  productos: Producto[] = [];
  titulo: string = 'Kuchens';
  carritoVisible: boolean = false;
  constructor(private carritoService: CarritoService, private storageService: StorageService) {}

  ngOnInit() {
    this.obtenerProductos();
  }

   obtenerProductos() {
    this.storageService.getJsonData().subscribe((data: { [key: string]: Producto }) => {
      this.productos = Object.values(data).filter((producto: Producto) => producto.categoria === 'kuchen');
    });
  }


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
