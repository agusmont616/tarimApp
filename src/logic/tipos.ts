// Celda de la grilla (1x1). Origen (0,0) arriba a la izquierda.
// Eje X = "a" = frente/fondo del escenario.
// Eje Y = "b" = lados del escenario.
export interface Celda {
  x: number;
  y: number;
}

// Un chapón ocupa un rectángulo de celdas: desde (x,y) hasta (x+ancho, y+alto).
// ancho/alto están en CELDAS (1 o 2), nunca ambos 2 a la vez (no existe chapón 2x2).
export interface Chapon {
  x: number;
  y: number;
  ancho: 1 | 2;
  alto: 1 | 2;
}

// Pata: vértice en la grilla de esquinas (no de celdas).
export interface Pata {
  x: number;
  y: number;
}

// Lado: arista entre dos patas, de longitud 1 o 2 metros.
export interface Lado {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  longitud: 1 | 2;
}

export interface ResultadoCalculo {
  chapones2x1: number;
  chapones1x1: number;
  patas: number;
  lados2m: number;
  lados1m: number;
  // false si el escenario tiene algún lado de 2m con una pata apoyada en su
  // punto medio: no se puede construir así en la vida real.
  esValido: boolean;
  // Celdas de todos los chapones involucrados en algún conflicto de ese tipo
  // (el dueño del lado de 2m y el/los que aportan la pata en el medio).
  // Vacío cuando esValido es true.
  celdasConflictivas: Celda[];
  // Detalle geométrico, útil para dibujar el resultado o depurar:
  detalle: {
    chapones: Chapon[];
    patas: Pata[];
    lados: Lado[];
  };
}

// Cantidad de cada pieza que el usuario tiene disponible en el depósito.
// Un campo en `undefined` significa que no se cargó dato para esa pieza,
// por lo que no debe limitarla (no se muestra falta de stock).
export interface Disponibilidad {
  chapones2x1?: number;
  chapones1x1?: number;
  patas?: number;
  lados2m?: number;
  lados1m?: number;
}