import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BrandColors } from '../constants/theme';
import { useTheme } from '../hooks/use-theme';
import { calcularPiezas } from '../logic/calcular-piezas';
import { Celda, ResultadoCalculo } from '../logic/tipos';
import GrillaEscenario from './grilla-escenario';
import ListaPiezas from './lista-piezas';

const IMAGENES_PLACEHOLDER = {
  chapon2x1: require('../../assets/images/chaponIcon.png'),
  chapon1x1: require('../../assets/images/chaponIcon.png'),
  pata: require('../../assets/images/pataIcon.png'),
  lado2m: require('../../assets/images/ladoIcon.png'),
  lado1m: require('../../assets/images/ladoIcon.png'),
};

function seleccionACeldas(seleccion: Set<string>): Celda[] {
  return [...seleccion].map((k) => {
    const [x, y] = k.split(',');
    return { x: Number(x), y: Number(y) };
  });
}

export default function PantallaCalculadora() {
  const theme = useTheme();
  const [seleccion, setSeleccion] = useState<Set<string>>(new Set());
  const [resultado, setResultado] = useState<ResultadoCalculo | null>(null);

  const hayCeldas = seleccion.size > 0;

  const handleCalcular = () => {
    const celdas = seleccionACeldas(seleccion);
    setResultado(calcularPiezas(celdas));
  };

  const handleLimpiar = () => {
    setSeleccion(new Set());
    setResultado(null);
  };

  const handleCambiarSeleccion = (nuevaSeleccion: Set<string>) => {
    setSeleccion(nuevaSeleccion);
    // Si ya había un resultado calculado, editar la selección lo invalida:
    // el tiling dibujado en la grilla dejaría de corresponder a lo seleccionado.
    setResultado(null);
  };

  return (
    <ScrollView
      style={[styles.pantalla, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contenedor}
    >
      <Text style={[styles.titulo, { color: theme.text }]}>Armá el escenario</Text>
      <Text style={[styles.subtitulo, { color: theme.textSecondary }]}>
        Tocá una celda para agregarla o quitarla. Arrastrá de una celda a otra para
        seleccionar un rectángulo completo.
      </Text>

      <GrillaEscenario
        seleccion={seleccion}
        onCambiarSeleccion={handleCambiarSeleccion}
        chapones={resultado?.detalle.chapones}
      />

      <View style={styles.botones}>
        <Pressable
          style={[styles.boton, styles.botonSecundario]}
          onPress={handleLimpiar}
          disabled={!hayCeldas}
        >
          <Text style={styles.botonTextoSecundario}>Limpiar</Text>
        </Pressable>
        <Pressable
          style={[styles.boton, styles.botonPrimario, !hayCeldas && styles.botonDeshabilitado]}
          onPress={handleCalcular}
          disabled={!hayCeldas}
        >
          <Text style={styles.botonTexto}>Calcular</Text>
        </Pressable>
      </View>

      {resultado && <ListaPiezas resultado={resultado} imagenes={IMAGENES_PLACEHOLDER} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
  },
  contenedor: {
    paddingHorizontal: 16,
    paddingTop: 64,
    paddingBottom: 16,
    alignItems: 'center',
  },
  titulo: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  botones: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  boton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  botonPrimario: {
    backgroundColor: BrandColors.primary,
  },
  botonSecundario: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: BrandColors.secondary,
  },
  botonDeshabilitado: {
    opacity: 0.5,
  },
  botonTexto: {
    color: '#fff',
    fontWeight: '700',
  },
  botonTextoSecundario: {
    color: BrandColors.secondary,
    fontWeight: '700',
  },
});