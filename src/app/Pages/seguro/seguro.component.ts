import { Component, Input, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SeguroService } from '../../Service/seguro.service';
import { Router } from '@angular/router';
import { Seguro } from '../../Models/Seguro';
import { HttpResponse } from '@angular/common/http';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-seguro',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDatepickerModule
  ],
  templateUrl: './seguro.component.html',
  styleUrls: ['./seguro.component.css'], // Corrige el error aquí
})
export class SeguroComponent implements OnInit {
  @Input('id') id!: number;
  public formSeguro: FormGroup;

  constructor(
    private router: Router,
    private formBuild: FormBuilder,
    private seguroServicio: SeguroService
  ) {
    // Inicialización del formulario en el constructor
    this.formSeguro = this.formBuild.group({
      nombre: [''],
      segundoNombre: [''],
      apellido: [''],
      segundoApellido: [''],
      numeroIdentificacion: [''],
      telefono: [''],
      email: [''],
      fechaNacimiento: [''],
      valor: [0],
      observacion: [''],
    });
  }

  ngOnInit(): void {
    if (this.id) {
      this.seguroServicio.obtener(this.id).subscribe({
        next: (data) => {
          // Aquí aseguramos que `data` sea tratado como un objeto Seguro, no un arreglo
          this.formSeguro.patchValue({
            nombre: data.nombre || '',
            segundoNombre: data.segundoNombre || '',
            apellido: data.apellido || '',
            segundoApellido: data.segundoApellido || '',
            numeroIdentificacion: data.numeroIdentificacion || '',
            telefono: data.telefono || '',
            email: data.email || '',
            fechaNacimiento: data.fechaNacimiento || '',
            valor: data.valor || 0,
            observacion: data.observacion || '',
          });
        },
        error: (err) => {
          console.log(err.message);
        },
      });
    }
  }


  guardar(form: any) {
    if (form.valid) {
      const objeto: Seguro = {
        id: this.id,
        nombre: this.formSeguro.value.nombre,
        segundoNombre: this.formSeguro.value.segundoNombre,
        apellido: this.formSeguro.value.apellido,
        segundoApellido: this.formSeguro.value.segundoApellido,
        numeroIdentificacion: this.formSeguro.value.numeroIdentificacion,
        telefono: this.formSeguro.value.telefono,
        email: this.formSeguro.value.email,
        fechaNacimiento: this.formSeguro.value.fechaNacimiento,
        valor: this.formSeguro.value.valor,
        observacion: this.formSeguro.value.observacion,
      };

      if (this.id == 0) {
        this.seguroServicio.crear(objeto).subscribe((response) => {
          if (response instanceof HttpResponse) {
            if (response.status === 201) {
              this.router.navigate(['/']);
            } else {
              alert('Error al crear');
            }
          }
        });
      } else {
        this.seguroServicio.editar(objeto).subscribe({
          next: (response) => {
            if (response instanceof HttpResponse) {
              if (response.status === 204) {
                // Verifica el código de estado para edición exitosa
                this.router.navigate(['/']);
              } else {
                alert('Error al editar: Código de estado inesperado');
              }
            } else {
              alert('Error en la respuesta del servidor');
            }
          },
          error: (err) => {
            // Manejo de errores
            console.error('Error en la solicitud de edición', err);
            alert('Error al editar: ' + (err.message || 'Error desconocido'));
          },
        });
      }
    } else {
      // Si el formulario no es válido, muestra un mensaje de error
      alert('Por favor, complete todos los campos obligatorios.');
    }
  }

  volver() {
    this.router.navigate(['/']);
  }
}
