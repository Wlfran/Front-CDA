import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { RepuestosServicioDTO } from '../models/RepuestosServicio.model';


interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

@Injectable({
  providedIn: 'root'
})
export class RepuestoDetalleService {
  private baseUrl = `${environment.apiUrl}/RepuestosServicio`;

  constructor(private http: HttpClient) {}

  agregarRepuestoAServicio(dto: RepuestosServicioDTO): Observable<RepuestosServicioDTO> {
    debugger
    return this.http.post<RepuestosServicioDTO>(this.baseUrl, dto);
  }
}
