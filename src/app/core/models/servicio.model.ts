export interface Servicio {
  id?: number;
  clienteId: number;
  vehiculoId: number;
  fechaSolicitud: Date;
  fechaProgramada?: Date;
  estado: 'Solicitado' | 'Asignado' | 'EnRevision' | 'EnReparacion' | 'Finalizado' | 'Cancelado';
  mecanicoId?: number;
  observaciones?: string;
  presupuestoTope?: number;
  alertPresupuesto: boolean;
  
}

export interface FotoServicio {
  id?: number;
  servicioId: number;
  url: string;
  fechaSubida: Date;
}