export interface Categoria {
  readonly _id: string;
  readonly categoria: string;
  descricion: string;
  eventos: Array<Evento>;
}

interface Evento {
  nombre: string;
  operacion: string;
  valor: number;
}
