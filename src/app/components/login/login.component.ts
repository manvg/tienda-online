import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../menu/menu.component';
import { FooterComponent } from '../footer/footer.component';
import { CarritoComponent } from '../carrito/carrito.component';
import { AuthService } from '../../services/autenticacion/auth.service';
import { AuthResponse } from '../../models/dto/authResponse.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, MenuComponent, FooterComponent, CarritoComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  formLogin!: FormGroup;
  enviado = false;
  loginError = '';
  carritoVisible: boolean = false;
  titulo: string = 'Iniciar Sesión';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.formLogin = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required]]
    });
  }

  toggleCarrito(): void {
    this.carritoVisible = !this.carritoVisible;
  }

  closeCarrito(): void {
    this.carritoVisible = false;
  }

  iniciarSesion(): void {
    console.log('Comienza inicio sesión...');
    this.enviado = true;
    this.loginError = '';
    this.loading = true;

    if (this.formLogin.valid) {
      const email = this.formLogin.get('email')!.value;
      const contrasena = this.formLogin.get('contrasena')!.value;

      this.authService.login(email, contrasena).subscribe({
        next: (response: AuthResponse) => {
          this.loading = false;
          if (response.status) {
            console.log('Inicio de sesión exitoso, token recibido:', response.token);

            const usuario = this.authService.usuarioActual;
            console.log('Usuario actual:', usuario);

            // Redirigir según el perfil del usuario
            if (usuario && usuario.perfil.includes('admin')) {
              this.router.navigate(['/dashboard']);
            } else {
              this.router.navigate(['/mi-cuenta']);
            }
          } else {
            this.loginError = response.message || 'Credenciales incorrectas';
          }
        },
        error: (err) => {
          this.loading = false;
          console.error('Error durante el inicio de sesión:', err);

          this.loginError = 'Hubo un error durante el inicio de sesión. Por favor, inténtelo de nuevo más tarde.';
        }
      });
    } else {
      this.loading = false;
    }
  }
}
