import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Producto } from '../../models/entities/producto.models';
import { ProductoService } from '../../services/producto/producto.service';
import { EditarProductoComponent } from '../editar-producto/editar-producto.component';
import { CommonModule } from '@angular/common';
import { MenuComponent } from "../menu/menu.component";
import { CarritoComponent } from "../carrito/carrito.component";
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { MatIconModule } from '@angular/material/icon';
import { CrearProductoComponent } from '../crear-producto/crear-producto.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule,RouterModule,MenuComponent,FooterComponent,CarritoComponent,MatIconModule],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss'
})
export class ProductosComponent implements OnInit {
  productos: Producto[] = [];
  carritoVisible: boolean = false;
  constructor(
    private productoService: ProductoService,private snackBar: MatSnackBar,private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.obtenerProductos();
  }
  toggleCarrito(): void {
    this.carritoVisible = !this.carritoVisible;
  }

  closeCarrito(): void {
    this.carritoVisible = false;
  }
  obtenerProductos(): void {
    this.productoService.listarProductosGestion().subscribe({
      next: (data: Producto[]) => {
        this.productos = data;
      },
      error: (err) => {
        console.error('Error al obtener los productos:', err);
        this.snackBar.open('Error al cargar los productos.', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  eliminarProducto(idProducto: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      height: '135px',
      data: { message: '¿Estás seguro de que deseas eliminar este producto?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productoService.eliminarProducto(idProducto).subscribe({
          next: () => {
            this.snackBar.open('Producto eliminado correctamente.', 'Cerrar', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'right'
            });
            this.obtenerProductos();
          },
          error: (err) => {
            this.snackBar.open('Error al eliminar el producto.', 'Cerrar', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'right'
            });
          }
        });
      }
    });
  }


  editarProducto(producto: Producto): void {
    const dialogRef = this.dialog.open(EditarProductoComponent, {
      width: '400px',
      data: { producto }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productoService.actualizarProducto(result).subscribe({
          next: () => {
            this.snackBar.open('Producto actualizado correctamente.', 'Cerrar', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'right'
            });
            this.obtenerProductos();
          },
          error: (err) => {
            console.error('Error al actualizar el producto:', err);
            this.snackBar.open('Error al actualizar el producto.', 'Cerrar', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'right'
            });
          }
        });
      }
    });
  }



  crearProducto(): void {
    const dialogRef = this.dialog.open(CrearProductoComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productoService.crearProducto(result).subscribe({
          next: () => {
            this.snackBar.open('Producto creado correctamente.', 'Cerrar', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'right'
            });
            this.obtenerProductos();
          },
          error: (err) => {
            this.snackBar.open('Error al crear el producto.', 'Cerrar', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'right'
            });
          }
        });
      }
    });
  }
}
