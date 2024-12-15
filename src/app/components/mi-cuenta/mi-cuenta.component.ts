import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn, AsyncValidatorFn } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../menu/menu.component';
import { FooterComponent } from '../footer/footer.component';
import { CarritoComponent } from '../carrito/carrito.component';
import { Usuario } from '../../models/entities/usuario.models';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { UsuarioMapperService } from '../../services/usuario/usuario-mapper.service';
import { AuthService } from '../../services/autenticacion/auth.service';
import { UsuarioDto } from '../../models/dto/usuarioDto.models';

@Component({
  selector: 'app-mi-cuenta',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, MenuComponent, FooterComponent, CarritoComponent],
  templateUrl: './mi-cuenta.component.html',
  styleUrl: './mi-cuenta.component.scss'
})
export class MiCuentaComponent implements OnInit {
  miCuentaForm!: FormGroup;

  cambiarContrasenaForm!: FormGroup;
  enviadoDatosPersonales = false;
  enviadoCambiarContrasena = false;
  carritoVisible: boolean = false;
  usuarioActivo: UsuarioDto | null = null;
  constructor(private fb: FormBuilder, private usuarioService: UsuarioService, private authService: AuthService, private router: Router, private snackBar: MatSnackBar, private usuarioMapperService: UsuarioMapperService) { }

  ngOnInit(): void {
    this.miCuentaForm = this.fb.group({
      nombre: ['', { validators: [Validators.required, this.soloLetrasValidator()], updateOn: 'change' }],
      apellidoPaterno: ['', { validators: [Validators.required, this.soloLetrasValidator()], updateOn: 'change' }],
      apellidoMaterno: ['', { validators: [Validators.required, this.soloLetrasValidator()], updateOn: 'change' }],
      fechaNacimiento: ['', { validators: [Validators.required, this.validarEdad(18)], updateOn: 'change' }],
      direccion: ['', { validators: [this.alphanumericoValidator()], updateOn: 'change' }],
      telefono: ['', { validators: [Validators.required, this.soloNumerosValidator()], updateOn: 'change' }]
    });

    this.cambiarContrasenaForm = this.fb.group({
      contrasenaActual: ['', {
        validators: [Validators.required],
        updateOn: 'blur'
      }],
      nuevaContrasena: ['', {
        validators: [Validators.required, this.validarContrasena()],
        updateOn: 'change'
      }]
    });


    this.obtenerDatosUsuario();
  }

  toggleCarrito() {
    this.carritoVisible = !this.carritoVisible;
  }


  closeCarrito() {
    this.carritoVisible = false;
  }

  async onGuardarDatosPersonales(): Promise<void> {
    this.enviadoDatosPersonales = true;

    if (this.miCuentaForm.valid && this.usuarioActivo) {
      const usuarioActualizado: UsuarioDto = {
        ...this.usuarioActivo,
        ...this.miCuentaForm.value
      };

      this.usuarioService.actualizarDatosPersonales(usuarioActualizado).subscribe({
        next: () => {
          this.snackBar.open('Éxito | Datos personales actualizados correctamente.', 'Cerrar', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
          this.usuarioActivo = usuarioActualizado;
          this.enviadoDatosPersonales = false;
          this.obtenerDatosUsuario();
        },
        error: (err) => {
          console.error('Error al actualizar los datos personales:', err);
          this.snackBar.open('Error | No se pudieron actualizar los datos personales.', 'Cerrar', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
        }
      });

    } else {
      this.miCuentaForm.markAllAsTouched();
    }
  }

  async onGuardarNuevaContrasena(): Promise<void> {
    this.enviadoCambiarContrasena = true;

    if (this.cambiarContrasenaForm.valid) {
      const nuevaContrasena = this.cambiarContrasenaForm.get('nuevaContrasena')!.value;

      this.usuarioService.cambiarContrasena(nuevaContrasena).subscribe({
        next: () => {
          this.snackBar.open('Éxito | Contraseña actualizada correctamente.', 'Cerrar', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
          this.enviadoCambiarContrasena = false;
          this.cambiarContrasenaForm.reset();
        },
        error: (err) => {
          console.error('Error al cambiar la contraseña:', err);
          this.snackBar.open('Error | La contraseña no pudo ser actualizada.', 'Cerrar', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
        }
      });
    } else {
      this.cambiarContrasenaForm.markAllAsTouched();
    }
  }

  obtenerDatosUsuario(): void {
    const decodedToken = this.authService.usuarioActual;

    if (decodedToken) {
      this.usuarioService.obtenerUsuarioPorId(decodedToken.id).subscribe({
        next: (usuario) => {
          if (usuario) {
            this.usuarioActivo = {
              idUsuario: usuario.idUsuario,
              nombre: usuario.nombre,
              apellidoPaterno: usuario.apellidoPaterno,
              apellidoMaterno: usuario.apellidoMaterno,
              direccion: usuario.direccion,
              telefono: usuario.telefono,
              fechaNacimiento: usuario.fechaNacimiento,
              perfil: usuario.perfil ? { idPerfil: usuario.perfil.idPerfil, nombre: usuario.perfil.nombre }: null,
              email: usuario.email
            };

            this.miCuentaForm.patchValue({
              nombre: this.usuarioActivo.nombre,
              apellidoPaterno: this.usuarioActivo.apellidoPaterno,
              apellidoMaterno: this.usuarioActivo.apellidoMaterno,
              direccion: this.usuarioActivo.direccion,
              telefono: this.usuarioActivo.telefono,
              fechaNacimiento: this.usuarioActivo.fechaNacimiento
            });
          } else {
            console.error('No se encontró el usuario con el email proporcionado.');
            this.authService.logout();
            this.router.navigate(['/index']);
          }
        },
        error: (err) => {
          console.error('Error al obtener los datos del usuario:', err);
          this.authService.logout();
          this.router.navigate(['/index']);
        }
      });
    } else {
      this.authService.logout();
      this.router.navigate(['/index']);
    }
  }

  toggleFormulario(formulario: string): void {
    const formularioDatosPersonales = document.getElementById('formulario-datos-personales');
    const formularioCambiarContrasena = document.getElementById('formulario-cambiar-contrasena');
    if (formulario === 'datos-personales') {
      formularioDatosPersonales!.style.display = 'block';
      formularioCambiarContrasena!.style.display = 'none';
    } else if (formulario === 'cambiar-contrasena') {
      formularioDatosPersonales!.style.display = 'none';
      formularioCambiarContrasena!.style.display = 'block';
    }
  }

//#region Validaciones
getErrorMessage(control: AbstractControl | null): string {
  if (control?.errors) {
    if (control.errors['required']) {
      return 'Este campo es obligatorio.';
    }
  }
  return '';
}

//#region Validación contraseña
validarContrasena(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const contrasena = control.value;
    if (!contrasena) {
      return null; // Si no hay contraseña, no validar
    }

    const errors: ValidationErrors = {};

    if (contrasena.length < 6 || contrasena.length > 18) {
      errors['length'] = 'Largo entre 6 y 18 caracteres';
    }
    if (!/[A-Z]/.test(contrasena)) {
      errors['uppercase'] = 'Debe contener al menos una letra mayúscula';
    }
    if (!/\d/.test(contrasena)) {
      errors['number'] = 'Debe contener al menos un número';
    }

    return Object.keys(errors).length ? errors : null;
  };
}

// validarContrasenaActual(): AsyncValidatorFn {
//   return (control: AbstractControl): Observable<ValidationErrors | null> => {
//     const contrasenaActual = control.value;
//     if (!contrasenaActual) {
//       return new Observable(observer => {
//         observer.next(null);
//         observer.complete();
//       });
//     }

//     return from(this.storageService.obtenerUsuarioActivo()).pipe(
//       map(usuarioActivo => {
//         if (usuarioActivo && contrasenaActual !== usuarioActivo.contrasena) {
//           return { validarContrasenaActual: true };
//         }
//         return null;
//       })
//     );
//   };
// }

//#endregion

//#region Validación edad
calcularEdad(fechaNacimiento: Date): number {
  const hoy = new Date();
  let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
  const mes = hoy.getMonth() - fechaNacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
    edad--;
  }
  return edad;
}

validarEdad(edadMinima: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const fechaNacimiento = control.value;
    if (!fechaNacimiento) {
      return null;
    }

    const edad = this.calcularEdad(new Date(fechaNacimiento));
    if (edad < edadMinima) {
      return { menorEdad: 'Debes ser mayor de 18 años.' };
    }
    return null;
  };
}
//#endregion

//#region Validaciones ingreso de texto y números
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

//#endregion
}
