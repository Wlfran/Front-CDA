import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Repuesto, RepuestoServicio } from '../models/repuesto.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RepuestoService {
  private baseUrl = `${environment.apiUrl}/repuestos`;

  constructor(private http: HttpClient) {}

  getRepuestos(): Observable<Repuesto[]> {
  return this.http.get<any>(this.baseUrl).pipe(
    map(res => res.data)  
  );
}

  getRepuesto(id: number): Observable<Repuesto> {
    return this.http.get<Repuesto>(`${this.baseUrl}/${id}`);
  }

  createRepuesto(repuesto: Repuesto): Observable<Repuesto> {
    return this.http.post<Repuesto>(this.baseUrl, repuesto);
  }

  updateRepuesto(id: number, repuesto: Repuesto): Observable<Repuesto> {
    return this.http.put<Repuesto>(`${this.baseUrl}/${id}`, repuesto);
  }

  deleteRepuesto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getRepuestosByServicio(servicioId: number): Observable<RepuestoServicio[]> {
    return this.http.get<RepuestoServicio[]>(`${this.baseUrl}/servicio/${servicioId}`);
  }

  agregarRepuestoAServicio(repuestoServicio: RepuestoServicio): Observable<RepuestoServicio> {
    return this.http.post<RepuestoServicio>(`${this.baseUrl}/servicio`, repuestoServicio);
  }

  actualizarRepuestoServicio(id: number, repuestoServicio: RepuestoServicio): Observable<RepuestoServicio> {
    return this.http.put<RepuestoServicio>(`${this.baseUrl}/servicio/${id}`, repuestoServicio);
  }

  eliminarRepuestoServicio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/servicio/${id}`);
  }
}