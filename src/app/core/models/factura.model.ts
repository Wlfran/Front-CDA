export interface Factura {
  id?: number;
  servicioId: number;
  fecha: Date;
  clienteNombre: string;
  clienteNIT: string;
  mecanicoNombre: string;
  manoObra: number;
  subtotal: number;
  iva: number;
  total: number;
  items: FacturaItem[];
}

export interface FacturaItem {
  id?: number;
  facturaId: number;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  totalItem: number;
}