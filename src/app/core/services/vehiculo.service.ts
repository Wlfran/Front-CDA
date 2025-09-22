import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Vehiculo } from '../models/vehiculo.model';
import { environment } from '../../../environments/environment';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class VehiculoService {
  private baseUrl = `${environment.apiUrl}/vehiculos`;

  constructor(private http: HttpClient) {}

  getVehiculos(): Observable<Vehiculo[]> {
    return this.http.get<ApiResponse<Vehiculo[]>>(this.baseUrl)
      .pipe(map(response => response.data || []));
  }

  getVehiculo(id: number): Observable<Vehiculo> {
    return this.http.get<ApiResponse<Vehiculo>>(`${this.baseUrl}/${id}`)
      .pipe(map(response => response.data));
  }

  getVehiculosByCliente(clienteId: number): Observable<Vehiculo[]> {
    return this.http.get<ApiResponse<Vehiculo[]>>(`${this.baseUrl}/cliente/${clienteId}`)
      .pipe(map(response => response.data || []));
  }

  createVehiculo(vehiculo: Vehiculo): Observable<Vehiculo> {
    return this.http.post<ApiResponse<Vehiculo>>(this.baseUrl, vehiculo)
      .pipe(map(response => response.data));
  }

  updateVehiculo(id: number, vehiculo: Vehiculo): Observable<Vehiculo> {
    return this.http.put<ApiResponse<Vehiculo>>(`${this.baseUrl}/${id}`, vehiculo)
      .pipe(map(response => response.data));
  }

  deleteVehiculo(id: number): Observable<boolean> {
    return this.http.delete<ApiResponse<boolean>>(`${this.baseUrl}/${id}`)
      .pipe(map(response => response.data));
  }
}
