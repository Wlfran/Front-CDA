import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Factura } from '../models/factura.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {
  private baseUrl = `${environment.apiUrl}/facturas`;

  constructor(private http: HttpClient) {}

  getFacturas(): Observable<Factura[]> {
    return this.http.get<Factura[]>(this.baseUrl);
  }

  getFactura(id: number): Observable<Factura> {
    return this.http.get<Factura>(`${this.baseUrl}/${id}`);
  }

  generarFactura(servicioId: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${servicioId}`, {});
  }
}
