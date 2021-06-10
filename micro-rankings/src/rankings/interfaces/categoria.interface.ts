export interface Categoria {
  readonly _id: string;
  readonly categoria: string;
  descripcion: string;
  eventos: Array<Evento>;
}

interface Evento {
  nome: string;
  operacion: string;
  valor: number;
}
