import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Usuario } from '../models/usuario.model';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private baseUrl = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) { }

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<ApiResponse<Usuario[]>>(this.baseUrl).pipe(
      map(res => res.data ?? [])
    );
  }

  getUsuario(id: number): Observable<Usuario> {
    return this.http.get<ApiResponse<Usuario>>(`${this.baseUrl}/${id}`).pipe(
      map(res => res.data!)
    );
  }

  getUsuariosByRol(rol: string): Observable<Usuario[]> {
    return this.http.get<ApiResponse<Usuario[]>>(`${this.baseUrl}?rol=${rol}`).pipe(
      map(res => res.data ?? [])
    );
  }

  getMecanicosDisponibles(): Observable<Usuario[]> {
    return this.http.get<ApiResponse<Usuario[]>>(`${this.baseUrl}/mecanicos-disponibles`)
      .pipe(map(res => res.data ?? []));
  }

  createUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.baseUrl, usuario);
  }

}
