import { Celda, Chapon, Lado, Pata, ResultadoCalculo } from './tipos';

function claveCelda(x: number, y: number): string {
  return `${x},${y}`;
}

function claveVertice(x: number, y: number): string {
  return `${x},${y}`;
}

// Clave canónica para una arista, sin importar el orden en que se pasen los extremos.
function claveArista(x1: number, y1: number, x2: number, y2: number): string {
  if (x1 > x2 || (x1 === x2 && y1 > y2)) {
    return `${x2},${y2}-${x1},${y1}`;
  }
  return `${x1},${y1}-${x2},${y2}`;
}

/**
 * Genera las celdas de un escenario rectangular a x b.
 * a = eje horizontal (frente/fondo), b = eje vertical (lados).
 */
export function generarCeldasRectangulo(a: number, b: number): Celda[] {
  const celdas: Celda[] = [];
  for (let y = 0; y < b; y++) {
    for (let x = 0; x < a; x++) {
      celdas.push({ x, y });
    }
  }
  return celdas;
}

/**
 * Fase 1: decide cómo agrupar las celdas seleccionadas en chapones.
 * Prioridad: 2x1 horizontal > 2x1 vertical (caso borde) > 1x1.
 */
export function calcularTiling(celdas: Celda[]): Chapon[] {
  const set = new Set(celdas.map((c) => claveCelda(c.x, c.y)));
  const usadas = new Set<string>();
  const chapones: Chapon[] = [];

  const ordenadas = [...celdas].sort((a, b) => a.y - b.y || a.x - b.x);

  // Paso 1: parejas horizontales (lado largo paralelo al eje "a")
  for (const c of ordenadas) {
    const k = claveCelda(c.x, c.y);
    if (usadas.has(k)) continue;
    const kDerecha = claveCelda(c.x + 1, c.y);
    if (set.has(kDerecha) && !usadas.has(kDerecha)) {
      chapones.push({ x: c.x, y: c.y, ancho: 2, alto: 1 });
      usadas.add(k);
      usadas.add(kDerecha);
    }
  }

  // Paso 2: entre las celdas que quedaron sueltas, parejas verticales (caso borde)
  for (const c of ordenadas) {
    const k = claveCelda(c.x, c.y);
    if (usadas.has(k)) continue;
    const kAbajo = claveCelda(c.x, c.y + 1);
    if (set.has(kAbajo) && !usadas.has(kAbajo)) {
      chapones.push({ x: c.x, y: c.y, ancho: 1, alto: 2 });
      usadas.add(k);
      usadas.add(kAbajo);
    }
  }

  // Paso 3: lo que quede, chapón 1x1
  for (const c of ordenadas) {
    const k = claveCelda(c.x, c.y);
    if (usadas.has(k)) continue;
    chapones.push({ x: c.x, y: c.y, ancho: 1, alto: 1 });
    usadas.add(k);
  }

  return chapones;
}

/**
 * Fase 2: a partir de los chapones, extrae patas (deduplicadas) y lados (deduplicados).
 */
export function extraerPatasYLados(chapones: Chapon[]): {
  patas: Set<string>;
  lados: Map<string, Lado>;
} {
  const patas = new Set<string>();
  const lados = new Map<string, Lado>();

  for (const ch of chapones) {
    const x1 = ch.x;
    const y1 = ch.y;
    const x2 = ch.x + ch.ancho;
    const y2 = ch.y + ch.alto;

    patas.add(claveVertice(x1, y1));
    patas.add(claveVertice(x2, y1));
    patas.add(claveVertice(x1, y2));
    patas.add(claveVertice(x2, y2));

    const bordes: [number, number, number, number][] = [
      [x1, y1, x2, y1], // superior
      [x1, y2, x2, y2], // inferior
      [x1, y1, x1, y2], // izquierdo
      [x2, y1, x2, y2], // derecho
    ];

    for (const [bx1, by1, bx2, by2] of bordes) {
      const longitud = Math.max(Math.abs(bx2 - bx1), Math.abs(by2 - by1)) as 1 | 2;
      const key = claveArista(bx1, by1, bx2, by2);
      if (!lados.has(key)) {
        lados.set(key, { x1: bx1, y1: by1, x2: bx2, y2: by2, longitud });
      }
    }
  }

  return { patas, lados };
}

/**
 * Fase 3: si un lado de 2m tiene, en su punto medio, una pata aportada por
 * otro chapón vecino, ese lado se parte en dos lados de 1m (no se puede
 * apoyar una pata contra la mitad de un lado de 2m).
 */
function dividirLadosSiHacePataEnElMedio(
  lados: Map<string, Lado>,
  patas: Set<string>
): Map<string, Lado> {
  const resultado = new Map<string, Lado>();

  for (const [key, lado] of lados) {
    if (lado.longitud === 2) {
      const mx = (lado.x1 + lado.x2) / 2;
      const my = (lado.y1 + lado.y2) / 2;
      if (patas.has(claveVertice(mx, my))) {
        const k1 = claveArista(lado.x1, lado.y1, mx, my);
        const k2 = claveArista(mx, my, lado.x2, lado.y2);
        resultado.set(k1, { x1: lado.x1, y1: lado.y1, x2: mx, y2: my, longitud: 1 });
        resultado.set(k2, { x1: mx, y1: my, x2: lado.x2, y2: lado.y2, longitud: 1 });
        continue;
      }
    }
    resultado.set(key, lado);
  }

  return resultado;
}

/**
 * Punto de entrada principal: recibe la selección de celdas (rectángulo
 * a x b, o forma irregular) y devuelve la lista de piezas necesarias.
 */
export function calcularPiezas(celdas: Celda[]): ResultadoCalculo {
  const chapones = calcularTiling(celdas);
  const { patas, lados } = extraerPatasYLados(chapones);
  const ladosFinales = dividirLadosSiHacePataEnElMedio(lados, patas);

  let chapones2x1 = 0;
  let chapones1x1 = 0;
  for (const ch of chapones) {
    if (ch.ancho === 2 || ch.alto === 2) chapones2x1++;
    else chapones1x1++;
  }

  let lados2m = 0;
  let lados1m = 0;
  for (const lado of ladosFinales.values()) {
    if (lado.longitud === 2) lados2m++;
    else lados1m++;
  }

  const patasDetalle: Pata[] = [...patas].map((k) => {
    const partes = k.split(',');
    return { x: Number(partes[0]), y: Number(partes[1]) };
  });

  return {
    chapones2x1,
    chapones1x1,
    patas: patas.size,
    lados2m,
    lados1m,
    detalle: {
      chapones,
      patas: patasDetalle,
      lados: [...ladosFinales.values()],
    },
  };
}