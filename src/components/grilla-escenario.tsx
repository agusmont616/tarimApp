import { useCallback, useRef, useState } from 'react';
import {
    LayoutChangeEvent,
    PanResponder,
    StyleSheet,
    View,
} from 'react-native';
import { BrandColors } from '../constants/theme';

const COLUMNAS = 12; // eje X = "a" = frente/fondo
const FILAS = 8; // eje Y = "b" = lados

interface Punto {
  x: number;
  y: number;
}

interface GrillaEscenarioProps {
  seleccion: Set<string>;
  onCambiarSeleccion: (seleccion: Set<string>) => void;
  tamanoCelda?: number;
}

export function claveCelda(x: number, y: number): string {
  return `${x},${y}`;
}

export default function GrillaEscenario({
  seleccion,
  onCambiarSeleccion,
  tamanoCelda = 28,
}: GrillaEscenarioProps) {
  const contenedorRef = useRef<View>(null);
  const origenPagina = useRef<Punto>({ x: 0, y: 0 });
  const [arrastre, setArrastre] = useState<{ inicio: Punto; actual: Punto } | null>(null);

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
        setArrastre((previo) => {
          if (!previo) return null;
          const { inicio, actual } = previo;
          const esTap = inicio.x === actual.x && inicio.y === actual.y;
          const nuevaSeleccion = new Set(seleccion);

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

          onCambiarSeleccion(nuevaSeleccion);
          return null;
        });
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
            return (
              <View
                key={x}
                style={[
                  styles.celda,
                  { width: tamanoCelda, height: tamanoCelda },
                  seleccionada && styles.celdaSeleccionada,
                  enPrevisualizacion && !seleccionada && styles.celdaPrevisualizada,
                ]}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grilla: {
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: '#ccc',
    alignSelf: 'center',
  },
  fila: {
    flexDirection: 'row',
  },
  celda: {
    borderWidth: 0.5,
    borderColor: '#ddd',
    backgroundColor: '#fafafa',
  },
  celdaSeleccionada: {
    backgroundColor: BrandColors.secondary,
  },
  celdaPrevisualizada: {
    backgroundColor: BrandColors.secondaryLight,
  },
});