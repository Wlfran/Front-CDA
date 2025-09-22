import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface FotoServicio {
  id: number;
  servicioId: number;
  url: string;
  fechaSubida: string;
}

@Injectable({
  providedIn: 'root'
})
export class FotosServicioService {
  private baseUrl = `${environment.apiUrl}/FotosServicio`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<FotoServicio[]> {
    return this.http.get<FotoServicio[]>(this.baseUrl);
  }

  getById(id: number): Observable<FotoServicio> {
    return this.http.get<FotoServicio>(`${this.baseUrl}/${id}`);
  }

  getByServicio(servicioId: number): Observable<FotoServicio[]> {
    return this.http.get<FotoServicio[]>(`${this.baseUrl}/servicio/${servicioId}`);
  }

  uploadFoto(servicioId: number, file: File): Observable<FotoServicio> {
    const formData = new FormData();
    formData.append('foto', file);
    return this.http.post<FotoServicio>(`${this.baseUrl}/${servicioId}`, formData);
  }

  deleteFoto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
