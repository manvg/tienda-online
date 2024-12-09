import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../menu/menu.component';
import { FooterComponent } from '../footer/footer.component';
import { CarritoComponent } from '../carrito/carrito.component';
import { CarritoService } from '../../services/carrito/carrito.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Usuario } from '../../models/dto/usuario.models';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, RouterModule, MenuComponent, FooterComponent, CarritoComponent, ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {
  formRegistro!: FormGroup;
  enviado = false;
  carritoVisible: boolean = false;
  titulo: string = 'Formulario de Registro';

  constructor(
    private carritoService: CarritoService,
    private fb: FormBuilder,
    private router: Router,
    private usuarioService: UsuarioService,
    private snackBar: MatSnackBar
  ) {}

  toggleCarrito(): void {
    this.carritoVisible = !this.carritoVisible;
  }

  closeCarrito(): void {
    this.carritoVisible = false;
  }

  ngOnInit(): void {
    this.formRegistro = this.fb.group({
      nombre: ['', [Validators.required, this.soloLetrasValidator()]],
      apellidos: ['', [Validators.required, this.soloLetrasValidator()]],
      fechaNacimiento: ['', [Validators.required, this.validarEdad(18)]],
      direccion: ['', [this.alphanumericoValidator()]],
      telefono: ['', [Validators.required, this.soloNumerosValidator(), Validators.minLength(9), Validators.maxLength(9)]],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, this.validarContrasena()]],
      confirmarContrasena: ['', Validators.required]
    }, { validators: this.validarIgualdadContrasena });
  }

  formularioRegistro(): void {
    this.enviado = true;
    if (this.formRegistro.valid) {
      const nuevoUsuario: Usuario = {
        nombre: this.formRegistro.get('nombre')!.value,
        apellidos: this.formRegistro.get('apellidos')!.value,
        fechaNacimiento: this.formRegistro.get('fechaNacimiento')!.value,
        direccion: this.formRegistro.get('direccion')!.value,
        telefono: this.formRegistro.get('telefono')!.value,
        email: this.formRegistro.get('correo')!.value,
        contrasena: this.formRegistro.get('contrasena')!.value,
        perfil: 'cliente'
      };

      this.usuarioService.crearUsuario(nuevoUsuario).subscribe({
        next: () => {
          this.snackBar.open('Éxito | Usuario creado correctamente.', 'Cerrar', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
          this.limpiarFormulario(); // Usar el método recién agregado
          this.enviado = false;
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Error al registrar usuario:', err);
          this.snackBar.open('Error | No se pudo registrar el usuario.', 'Cerrar', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
        }
      });
    }
  }

  limpiarFormulario(): void {
    this.formRegistro.reset(); // Reinicia el formulario
    this.enviado = false; // Restablece la bandera de envío
  }

  //#region Validaciones
  validarIgualdadContrasena(form: FormGroup): ValidationErrors | null {
    const contrasena = form.get('contrasena')!.value;
    const confirmarContrasena = form.get('confirmarContrasena')!.value;

    return contrasena && confirmarContrasena && contrasena !== confirmarContrasena
      ? { contrasenasDistintas: true }
      : null;
  }

  validarContrasena(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const contrasena = control.value;
      if (!contrasena) return null;

      const errors: ValidationErrors = {};
      if (contrasena.length < 6 || contrasena.length > 18) errors['length'] = 'Largo entre 6 y 18 caracteres';
      if (!/[A-Z]/.test(contrasena)) errors['uppercase'] = 'Debe contener al menos una letra mayúscula';
      if (!/\d/.test(contrasena)) errors['number'] = 'Debe contener al menos un número';

      return Object.keys(errors).length ? errors : null;
    };
  }

  validarEdad(edadMinima: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const fechaNacimiento = control.value;
      if (!fechaNacimiento) return null;

      const edad = this.calcularEdad(new Date(fechaNacimiento));
      return edad < edadMinima ? { menorEdad: true } : null;
    };
  }

  calcularEdad(fechaNacimiento: Date): number {
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mes = hoy.getMonth() - fechaNacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
      edad--;
    }
    return edad;
  }

  soloLetrasValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const regex = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s-]+$/;
      if (control.value && !regex.test(control.value)) {
        control.setValue(control.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s-]/g, ''));
        return { soloLetras: 'Sólo se permiten letras' };
      }
      return null;
    };
  }

  alphanumericoValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const regex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ\s-]+$/;
      if (control.value && !regex.test(control.value)) {
        control.setValue(control.value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ\s-]/g, ''));
        return { alphanumerico: 'Sólo se permiten caracteres alfanuméricos' };
      }
      return null;
    };
  }

  soloNumerosValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const regex = /^[0-9]+$/;
      if (control.value && !regex.test(control.value)) {
        control.setValue(control.value.replace(/[^0-9]/g, ''));
        return { soloNumeros: 'Sólo se permiten números' };
      }
      return null;
    };
  }
  //#endregion
}
