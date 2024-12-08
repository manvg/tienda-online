import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';

import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../menu/menu.component';
import { FooterComponent } from '../footer/footer.component';
import { CarritoComponent } from '../carrito/carrito.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-recuperar-contrasena',
  standalone: true,
  imports: [CommonModule, RouterModule, MenuComponent, FooterComponent, CarritoComponent, MatIconModule, ReactiveFormsModule],
  templateUrl: './recuperar-contrasena.component.html',
  styleUrl: './recuperar-contrasena.component.scss'
})
export class RecuperarContrasenaComponent implements OnInit {
  formRecuperar!: FormGroup;
  enviado = false;
  carritoVisible: boolean = false;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.formRecuperar = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  enviarRecuperacion(): void {
    this.enviado = true;
    if (this.formRecuperar.valid) {
      const email = this.formRecuperar.get('email')?.value;
      const usuarios = this.localStorageService.obtenerUsuarios();
      const usuario = usuarios.find(user => user.email === email);

      if (usuario) {
        this.snackBar.open('Correo de recuperación enviado.', 'Cerrar', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3500);
      } else {
        this.snackBar.open('Correo no registrado.', 'Cerrar', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
      }
    }
  }

  toggleCarrito(): void {
    this.carritoVisible = !this.carritoVisible;
  }

  closeCarrito(): void {
    this.carritoVisible = false;
  }
}
