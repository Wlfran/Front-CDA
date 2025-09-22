export interface Usuario {
  id?: number;
  username: string;
  rol: 'Admin' | 'Mecanico' | 'Recepcion';
  nombre: string;
  disponible: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
}