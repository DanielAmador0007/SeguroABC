import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../Settings/appsettings';
import { Seguro } from '../Models/Seguro';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../Models/PaginatedResponse';
import { PagedResult } from '../Models/PagedResult';

@Injectable({
  providedIn: 'root'
})


export class SeguroService {

  private http = inject(HttpClient);
  private apiUrl = appsettings.apiUrl + "Seguro";

  constructor() { }

  lista(pageNumber: number, pageSize: number): Observable<PagedResult<Seguro>> {
    return this.http.get<PagedResult<Seguro>>(`${this.apiUrl}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }

  obtener(id: number): Observable<Seguro> {
    return this.http.get<Seguro>(`${this.apiUrl}/${id}`);
  }

  buscarPorIdentificacion(NumeroIdentificacion: string): Observable<Seguro[]> {
    return this.http.get<Seguro[]>(`${this.apiUrl}/filtrar?NumeroIdentificacion=${NumeroIdentificacion}`);
  }

  crear(objeto: Seguro): Observable<HttpResponse<Seguro>> {
    return this.http.post<Seguro>(this.apiUrl, objeto, { observe: 'response' });
  }

  editar(objeto: Seguro): Observable<HttpResponse<Seguro>> {
    return this.http.put<Seguro>(`${this.apiUrl}/${objeto.id}`, objeto, { observe: 'response' });
  }

  eliminar(id: number): Observable<HttpResponse<void>> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { observe: 'response' });
  }


}
