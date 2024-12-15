import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Perfil, Usuario } from '../../models/entities/usuario.models';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editar-usuario',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSelectModule
  ],
  templateUrl: './editar-usuario.component.html',
  styleUrl: './editar-usuario.component.scss'
})
export class EditarUsuarioComponent {
  form: FormGroup;
  perfiles: Perfil[] = [
    { idPerfil: 1, nombre: 'Administrador' },
    { idPerfil: 2, nombre: 'Cliente' }
  ];

  constructor(
    public dialogRef: MatDialogRef<EditarUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { usuario: Usuario },
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private snackBar: MatSnackBar
  ) {
    const { nombre, apellidoPaterno, apellidoMaterno, email, perfil } = data.usuario;

    this.form = this.fb.group({
      nombre: [nombre, Validators.required],
      apellidoPaterno: [apellidoPaterno, Validators.required],
      apellidoMaterno: [apellidoMaterno, Validators.required],
      email: [email, [Validators.required, Validators.email]],
      perfil: [perfil, Validators.required]
    });
  }

  compararPerfiles(p1: Perfil, p2: Perfil): boolean {
    return p1 && p2 ? p1.nombre === p2.nombre : p1 === p2;
  }

  cancelar(): void {
    this.dialogRef.close();
  }

  guardar(): void {
    if (this.form.invalid) {
      this.snackBar.open('Por favor completa todos los campos correctamente.', 'Cerrar', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'right'
      });
      return;
    }

    const updatedUser: Usuario = {
      ...this.data.usuario,
      ...this.form.value
    };

    this.usuarioService.actualizarUsuario(updatedUser).subscribe({
      next: (response) => {
        this.dialogRef.close(response);
        this.snackBar.open('Usuario actualizado correctamente.', 'Cerrar', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
      },
      error: (error) => {
        console.error('Error al actualizar el usuario:', error);
        this.snackBar.open('Error al actualizar el usuario.', 'Cerrar', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
      }
    });
  }
}
