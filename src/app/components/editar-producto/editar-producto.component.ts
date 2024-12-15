import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Producto } from '../../models/entities/producto.models';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-editar-producto',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './editar-producto.component.html',
  styleUrl: './editar-producto.component.scss'
})
export class EditarProductoComponent {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditarProductoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { producto: Producto },
    private fb: FormBuilder
  ) {
    const { nombre, categoria, descripcion, precio, urlImagen } = data.producto;

    this.form = this.fb.group({
      nombre: [nombre, Validators.required],
      categoria: [categoria, Validators.required],
      descripcion: [descripcion, Validators.required],
      precio: [precio, [Validators.required, Validators.min(0)]],
      urlImagen: [urlImagen]
    });
  }

  guardar(): void {
    if (this.form.valid) {
      this.dialogRef.close({ ...this.data.producto, ...this.form.value });
    }
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}
