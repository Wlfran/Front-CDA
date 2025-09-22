export interface RepuestosServicioDTO {
  id?: number;
  servicioId: number;
  repuestoId: number;
  cantidad: number;
  precioUnitario: number;
  observacion?: string;
}