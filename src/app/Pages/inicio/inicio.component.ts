import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router'; // Importa Router
import { SeguroService } from '../../Service/seguro.service';
import { Seguro } from '../../Models/Seguro';
import { PageEvent } from '@angular/material/paginator';
import { HttpResponse } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [MatCardModule, MatTableModule, MatIconModule, MatButtonModule, MatPaginatorModule, MatFormFieldModule, MatInputModule, FormsModule], 
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'] 
})
export class InicioComponent implements OnInit {

  displayedColumns: string[] = ['nombre', 'numeroIdentificacion', 'telefono', 'email', 'fechaNacimiento', 'valor', 'observacion', 'accion'];
  dataSource = new MatTableDataSource<Seguro>([]);
  numeroIdentificacion: string = '';
  totalRecords = 0;
  pageSize = 10;
  pageIndex = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private seguroServicio: SeguroService, private router: Router) {} 

  ngOnInit(): void {
    this.obtenerSeguros();
  }
  

  obtenerSeguros(pageNumber: number = 1): void {
    this.seguroServicio.lista(pageNumber, this.pageSize).subscribe({
      next: (data) => {
        this.dataSource.data = data.items;
        this.totalRecords = data.totalCount;
        if (this.paginator) {
          this.paginator.pageIndex = pageNumber - 1;
          this.paginator.pageSize = this.pageSize;
        }
      },
      error: (err) => {
        console.error(err.message);
      }
    });
  }
  
  buscarPorIdentificacion() {
    if (this.numeroIdentificacion.trim() === '') {
      alert('Ingrese un número de identificación');
      return;
    }

    this.seguroServicio.buscarPorIdentificacion(this.numeroIdentificacion).subscribe({
      next: (data) => {
        if (data.length > 0) {
          this.router.navigate(['/seguro', data[0].id]);
        } else {
          alert('Seguro no encontrado');
        }
      },
      error(err) {
        console.log(err.message);
      }
    });
  }


  onPageChange(event: PageEvent): void {
    const pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.obtenerSeguros(pageNumber);
  }

  nuevo(): void {
    this.router.navigate(['/seguro', 0]);
  }

  editar(objeto: Seguro): void {
    this.router.navigate(['/seguro', objeto.id]);
  }

  eliminar(objeto: Seguro): void {
    if (confirm(`Desea eliminar el seguro ${objeto.numeroIdentificacion}?`)) {
      this.seguroServicio.eliminar(objeto.id).subscribe({
        next: (response) => {
          if (response instanceof HttpResponse) {
            if (response.status === 204) {
              console.log('Seguro eliminado con éxito');
              this.obtenerSeguros();
            } else {
              console.error('Error en la eliminación del seguro', response.status);
            }
          }
        },
        error: (err) => {
          console.error('Error en la respuesta', err);
        }
      });
    }
  }
}
