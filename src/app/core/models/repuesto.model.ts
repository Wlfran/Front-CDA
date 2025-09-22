export interface Repuesto {
  id?: number;
  codigo: string;
  nombre: string;
  precioUnitario: number;
  stock: number;
}

export interface RepuestoServicio {
  id?: number;
  servicioId: number;
  repuestoId: number;
  cantidad: number;
  precioUnitario: number;
  observacion?: string;
  repuesto?: Repuesto;
}