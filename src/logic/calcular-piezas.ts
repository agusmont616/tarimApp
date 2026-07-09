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

export type ResultadoDeteccionRectangulo = { esRectangulo: true; a: number; b: number } | { esRectangulo: false };

/**
 * Determina si una selección de celdas forma un rectángulo perfecto (sin
 * huecos): todas las celdas entre (minX, minY) y (maxX, maxY) presentes y
 * ninguna otra. Si lo es, devuelve sus medidas a (ancho) x b (alto).
 */
export function detectarRectangulo(seleccion: Celda[] | Set<string>): ResultadoDeteccionRectangulo {
  const celdas: Celda[] =
    seleccion instanceof Set
      ? [...seleccion].map((k) => {
          const [x, y] = k.split(',');
          return { x: Number(x), y: Number(y) };
        })
      : seleccion;

  if (celdas.length === 0) return { esRectangulo: false };

  const claves = seleccion instanceof Set ? seleccion : new Set(celdas.map((c) => claveCelda(c.x, c.y)));

  const xs = celdas.map((c) => c.x);
  const ys = celdas.map((c) => c.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const a = maxX - minX + 1;
  const b = maxY - minY + 1;

  if (claves.size !== a * b) return { esRectangulo: false };

  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      if (!claves.has(claveCelda(x, y))) return { esRectangulo: false };
    }
  }

  return { esRectangulo: true, a, b };
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
 * Fase 3: un lado de 2m es físicamente imposible de construir si, en su
 * punto medio, hay una pata aportada por otro chapón vecino (no se puede
 * apoyar una pata contra la mitad de un lado de 2m). En vez de "corregir"
 * la situación, se detecta y se devuelven las celdas de todos los chapones
 * involucrados: el dueño del lado de 2m y el/los que aportan la pata en
 * el medio.
 */
function chaponTieneLado(chapon: Chapon, lado: Lado): boolean {
  const x1 = chapon.x;
  const y1 = chapon.y;
  const x2 = chapon.x + chapon.ancho;
  const y2 = chapon.y + chapon.alto;
  const bordes: [number, number, number, number][] = [
    [x1, y1, x2, y1],
    [x1, y2, x2, y2],
    [x1, y1, x1, y2],
    [x2, y1, x2, y2],
  ];
  const claveLado = claveArista(lado.x1, lado.y1, lado.x2, lado.y2);
  return bordes.some(([bx1, by1, bx2, by2]) => claveArista(bx1, by1, bx2, by2) === claveLado);
}

function chaponTienePataEn(chapon: Chapon, x: number, y: number): boolean {
  const esquinas: [number, number][] = [
    [chapon.x, chapon.y],
    [chapon.x + chapon.ancho, chapon.y],
    [chapon.x, chapon.y + chapon.alto],
    [chapon.x + chapon.ancho, chapon.y + chapon.alto],
  ];
  return esquinas.some(([ex, ey]) => ex === x && ey === y);
}

function detectarCeldasConflictivas(
  chapones: Chapon[],
  lados: Map<string, Lado>,
  patas: Set<string>
): Celda[] {
  const celdasConflictivas = new Map<string, Celda>();

  const marcarCeldasDeChapon = (chapon: Chapon) => {
    for (let dy = 0; dy < chapon.alto; dy++) {
      for (let dx = 0; dx < chapon.ancho; dx++) {
        const x = chapon.x + dx;
        const y = chapon.y + dy;
        celdasConflictivas.set(claveCelda(x, y), { x, y });
      }
    }
  };

  for (const lado of lados.values()) {
    if (lado.longitud !== 2) continue;
    const mx = (lado.x1 + lado.x2) / 2;
    const my = (lado.y1 + lado.y2) / 2;
    if (!patas.has(claveVertice(mx, my))) continue;

    for (const chapon of chapones) {
      if (chaponTieneLado(chapon, lado) || chaponTienePataEn(chapon, mx, my)) {
        marcarCeldasDeChapon(chapon);
      }
    }
  }

  return [...celdasConflictivas.values()];
}

/**
 * Punto de entrada principal: recibe la selección de celdas (rectángulo
 * a x b, o forma irregular) y devuelve la lista de piezas necesarias.
 */
export function calcularPiezas(celdas: Celda[]): ResultadoCalculo {
  const chapones = calcularTiling(celdas);
  const { patas, lados } = extraerPatasYLados(chapones);
  const celdasConflictivas = detectarCeldasConflictivas(chapones, lados, patas);

  let chapones2x1 = 0;
  let chapones1x1 = 0;
  for (const ch of chapones) {
    if (ch.ancho === 2 || ch.alto === 2) chapones2x1++;
    else chapones1x1++;
  }

  let lados2m = 0;
  let lados1m = 0;
  for (const lado of lados.values()) {
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
    esValido: celdasConflictivas.length === 0,
    celdasConflictivas,
    detalle: {
      chapones,
      patas: patasDetalle,
      lados: [...lados.values()],
    },
  };
}