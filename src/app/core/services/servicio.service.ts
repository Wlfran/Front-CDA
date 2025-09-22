import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Servicio } from '../models/servicio.model';
import { environment } from '../../../environments/environment';

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
}

@Injectable({
    providedIn: 'root'
})
export class ServicioService {
    private baseUrl = `${environment.apiUrl}/servicios`;

    constructor(private http: HttpClient) { }

    getServicios(): Observable<Servicio[]> {
        return this.http.get<ApiResponse<Servicio[]>>(this.baseUrl)
            .pipe(
                map(respuesta => respuesta.data ?? [])
            );
    }

    getServicio(id: number): Observable<Servicio> {
        return this.http.get<ApiResponse<Servicio>>(`${this.baseUrl}/${id}`)
            .pipe(
                map(respuesta => respuesta.data!)
            );
    }

    createServicio(servicio: Servicio): Observable<Servicio> {
        return this.http.post<ApiResponse<Servicio>>(this.baseUrl, servicio)
            .pipe(
                map(respuesta => respuesta.data!)
            );
    }

    updateServicio(id: number, servicio: Servicio): Observable<Servicio> {
        return this.http.put<ApiResponse<Servicio>>(`${this.baseUrl}/${id}`, servicio)
            .pipe(
                map(respuesta => respuesta.data!)
            );
    }

    asignarMecanico(servicioId: number, mecanicoId: number) {
        return this.http.put<any>(
            `${this.baseUrl}/${servicioId}/asignar-mecanico`,
            { MecanicoId: mecanicoId }
        ).pipe(
            map(respuesta => respuesta.data)
        );
    }

    finalizarServicio(id: number) {
        return this.http.put<any>(`${this.baseUrl}/${id}/finalizar`, {});
    }
    
    subirFoto(servicioId: number, archivo: File): Observable<any> {
        const formData = new FormData();
        formData.append('foto', archivo);
        return this.http.post(`${environment.apiUrl}/fotosServicio/${servicioId}`, formData);
    }



}
