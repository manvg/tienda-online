import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from '../../models/dto/usuario.models';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuarioService } from '../../services/usuario/usuario.service';

@Component({
  selector: 'app-editar-usuario',
  standalone: true,
  imports: [  MatIconModule,MatFormFieldModule,MatInputModule,MatButtonModule,ReactiveFormsModule],
  templateUrl: './editar-usuario.component.html',
  styleUrl: './editar-usuario.component.scss'
})
export class EditarUsuarioComponent {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditarUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { usuario: Usuario },
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private snackBar: MatSnackBar
  ) {
    const { nombre, apellidos, email, perfil } = data.usuario;

    this.form = this.fb.group({
      nombre: [nombre, Validators.required],
      apellidos: [apellidos, Validators.required],
      email: [email, [Validators.required, Validators.email]],
      perfil: [perfil, Validators.required]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  async onSaveClick(): Promise<void> {
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

    try {
      const response = await this.usuarioService.actualizarUsuario(updatedUser).toPromise();
      this.dialogRef.close(response);
      this.snackBar.open('Usuario actualizado correctamente.', 'Cerrar', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'right'
      });
    } catch (error) {
      this.snackBar.open('Error al actualizar el usuario.', 'Cerrar', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'right'
      });
    }
  }
}
