import { useCallback, useRef, useState } from 'react';
import {
    LayoutChangeEvent,
    PanResponder,
    StyleSheet,
    View,
} from 'react-native';
import { BrandColors } from '../constants/theme';
import { Chapon } from '../logic/tipos';

const COLUMNAS = 12; // eje X = "a" = frente/fondo
const FILAS = 8; // eje Y = "b" = lados
const ESPACIO_ENTRE_CHAPONES = 2;

interface Punto {
  x: number;
  y: number;
}

interface GrillaEscenarioProps {
  seleccion: Set<string>;
  onCambiarSeleccion: (seleccion: Set<string>) => void;
  tamanoCelda?: number;
  // Tiling resultante del cálculo: si viene presente, se dibuja como bloques
  // (uno por chapón) en vez de pintar cada celda seleccionada por separado.
  chapones?: Chapon[];
  // Celdas de chapones involucrados en un conflicto físico (pata en el medio
  // de un lado de 2m): se pintan de rojo en vez del color normal.
  celdasConflictivas?: Set<string>;
}

export function claveCelda(x: number, y: number): string {
  return `${x},${y}`;
}

export default function GrillaEscenario({
  seleccion,
  onCambiarSeleccion,
  tamanoCelda = 28,
  chapones,
  celdasConflictivas,
}: GrillaEscenarioProps) {
  const contenedorRef = useRef<View>(null);
  const origenPagina = useRef<Punto>({ x: 0, y: 0 });
  const [arrastre, setArrastre] = useState<{ inicio: Punto; actual: Punto } | null>(null);

  // El PanResponder se crea una sola vez (useRef), así que sus callbacks deben
  // leer el estado más reciente a través de refs en vez de por clausura directa.
  const arrastreRef = useRef(arrastre);
  arrastreRef.current = arrastre;
  const seleccionRef = useRef(seleccion);
  seleccionRef.current = seleccion;
  const onCambiarSeleccionRef = useRef(onCambiarSeleccion);
  onCambiarSeleccionRef.current = onCambiarSeleccion;

  const coordenadaACelda = useCallback(
    (pageX: number, pageY: number): Punto => {
      const localX = pageX - origenPagina.current.x;
      const localY = pageY - origenPagina.current.y;
      const x = Math.floor(localX / tamanoCelda);
      const y = Math.floor(localY / tamanoCelda);
      return {
        x: Math.max(0, Math.min(COLUMNAS - 1, x)),
        y: Math.max(0, Math.min(FILAS - 1, y)),
      };
    },
    [tamanoCelda]
  );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const celda = coordenadaACelda(evt.nativeEvent.pageX, evt.nativeEvent.pageY);
        setArrastre({ inicio: celda, actual: celda });
      },
      onPanResponderMove: (evt) => {
        const celda = coordenadaACelda(evt.nativeEvent.pageX, evt.nativeEvent.pageY);
        setArrastre((previo) => (previo ? { ...previo, actual: celda } : { inicio: celda, actual: celda }));
      },
      onPanResponderRelease: () => {
        const previo = arrastreRef.current;
        if (!previo) return;

        const { inicio, actual } = previo;
        const esTap = inicio.x === actual.x && inicio.y === actual.y;
        const nuevaSeleccion = new Set(seleccionRef.current);

        if (esTap) {
          const k = claveCelda(inicio.x, inicio.y);
          if (nuevaSeleccion.has(k)) {
            nuevaSeleccion.delete(k);
          } else {
            nuevaSeleccion.add(k);
          }
        } else {
          const minX = Math.min(inicio.x, actual.x);
          const maxX = Math.max(inicio.x, actual.x);
          const minY = Math.min(inicio.y, actual.y);
          const maxY = Math.max(inicio.y, actual.y);
          for (let y = minY; y <= maxY; y++) {
            for (let x = minX; x <= maxX; x++) {
              nuevaSeleccion.add(claveCelda(x, y));
            }
          }
        }

        onCambiarSeleccionRef.current(nuevaSeleccion);
        setArrastre(null);
      },
    })
  ).current;

  const onLayout = useCallback((_evt: LayoutChangeEvent) => {
    // measure() da la posición absoluta en pantalla, necesaria para convertir
    // los toques (que llegan en coordenadas de página) a coordenadas de celda.
    contenedorRef.current?.measure((_x, _y, _w, _h, pageX, pageY) => {
      origenPagina.current = { x: pageX, y: pageY };
    });
  }, []);

  let previsualizacion: Set<string> | null = null;
  if (arrastre) {
    const { inicio, actual } = arrastre;
    const minX = Math.min(inicio.x, actual.x);
    const maxX = Math.max(inicio.x, actual.x);
    const minY = Math.min(inicio.y, actual.y);
    const maxY = Math.max(inicio.y, actual.y);
    previsualizacion = new Set();
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        previsualizacion.add(claveCelda(x, y));
      }
    }
  }

  return (
    <View
      ref={contenedorRef}
      onLayout={onLayout}
      style={[
        styles.grilla,
        { width: COLUMNAS * tamanoCelda, height: FILAS * tamanoCelda },
      ]}
      {...panResponder.panHandlers}
    >
      {Array.from({ length: FILAS }).map((_, y) => (
        <View key={y} style={styles.fila}>
          {Array.from({ length: COLUMNAS }).map((_, x) => {
            const k = claveCelda(x, y);
            const seleccionada = seleccion.has(k);
            const enPrevisualizacion = previsualizacion?.has(k) ?? false;
            const esConflictiva = seleccionada && (celdasConflictivas?.has(k) ?? false);
            return (
              <View
                key={x}
                style={[
                  styles.celda,
                  { width: tamanoCelda, height: tamanoCelda },
                  seleccionada && !chapones && styles.celdaSeleccionada,
                  enPrevisualizacion && !seleccionada && styles.celdaPrevisualizada,
                  esConflictiva && styles.celdaConflictiva,
                ]}
              />
            );
          })}
        </View>
      ))}

      {chapones && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {chapones.map((ch, i) => {
            const esDoble = ch.ancho === 2 || ch.alto === 2;
            const esConflictivo = celdasConflictivas?.has(claveCelda(ch.x, ch.y)) ?? false;
            return (
              <View
                key={`${ch.x},${ch.y}-${i}`}
                style={[
                  styles.chapon,
                  {
                    left: ch.x * tamanoCelda + ESPACIO_ENTRE_CHAPONES,
                    top: ch.y * tamanoCelda + ESPACIO_ENTRE_CHAPONES,
                    width: ch.ancho * tamanoCelda - ESPACIO_ENTRE_CHAPONES * 2,
                    height: ch.alto * tamanoCelda - ESPACIO_ENTRE_CHAPONES * 2,
                    backgroundColor: esConflictivo
                      ? BrandColors.alert
                      : esDoble
                      ? BrandColors.secondary
                      : BrandColors.secondaryLight,
                  },
                ]}
              />
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  grilla: {
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: '#3a3a3a',
    alignSelf: 'center',
  },
  fila: {
    flexDirection: 'row',
  },
  celda: {
    borderWidth: 0.5,
    borderColor: '#333',
    backgroundColor: '#1e1e1e',
  },
  celdaSeleccionada: {
    backgroundColor: BrandColors.secondary,
  },
  celdaPrevisualizada: {
    backgroundColor: BrandColors.secondaryLight,
  },
  celdaConflictiva: {
    backgroundColor: BrandColors.alert,
  },
  chapon: {
    position: 'absolute',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#1e1e1e',
  },
});