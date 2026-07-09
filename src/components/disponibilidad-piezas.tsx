import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useTheme } from '../hooks/use-theme';
import { Disponibilidad } from '../logic/tipos';

interface DisponibilidadPiezasProps {
  disponibilidad: Disponibilidad;
  onCambiarDisponibilidad: (disponibilidad: Disponibilidad) => void;
}

const CAMPOS: { clave: keyof Disponibilidad; etiqueta: string }[] = [
  { clave: 'chapones2x1', etiqueta: 'Chapón 2x1' },
  { clave: 'chapones1x1', etiqueta: 'Chapón 1x1' },
  { clave: 'patas', etiqueta: 'Patas' },
  { clave: 'lados2m', etiqueta: 'Lados de 2m' },
  { clave: 'lados1m', etiqueta: 'Lados de 1m' },
];

export default function DisponibilidadPiezas({
  disponibilidad,
  onCambiarDisponibilidad,
}: DisponibilidadPiezasProps) {
  const theme = useTheme();
  const [expandido, setExpandido] = useState(false);

  const handleCambiarTexto = (clave: keyof Disponibilidad, texto: string) => {
    const soloDigitos = texto.replace(/[^0-9]/g, '');
    const valor = soloDigitos === '' ? undefined : Number(soloDigitos);
    onCambiarDisponibilidad({ ...disponibilidad, [clave]: valor });
  };

  return (
    <View style={[styles.contenedor, { backgroundColor: theme.backgroundElement }]}>
      <Pressable style={styles.encabezado} onPress={() => setExpandido((v) => !v)}>
        <Text style={[styles.titulo, { color: theme.text }]}>Piezas disponibles en depósito</Text>
        <Text style={[styles.flecha, { color: theme.textSecondary }]}>{expandido ? '▾' : '▸'}</Text>
      </Pressable>

      {expandido && (
        <View style={styles.campos}>
          {CAMPOS.map(({ clave, etiqueta }) => (
            <View key={clave} style={styles.fila}>
              <Text style={[styles.etiqueta, { color: theme.text }]}>{etiqueta}</Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: theme.backgroundSelected, color: theme.text },
                ]}
                value={disponibilidad[clave] !== undefined ? String(disponibilidad[clave]) : ''}
                onChangeText={(texto) => handleCambiarTexto(clave, texto)}
                keyboardType="number-pad"
                inputMode="numeric"
                placeholder="Sin límite"
                placeholderTextColor={theme.textSecondary}
              />
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    width: '100%',
    borderRadius: 8,
    marginTop: 16,
    overflow: 'hidden',
  },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  titulo: {
    fontSize: 15,
    fontWeight: '700',
  },
  flecha: {
    fontSize: 15,
  },
  campos: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 8,
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  etiqueta: {
    fontSize: 14,
  },
  input: {
    width: 90,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    fontSize: 14,
    textAlign: 'right',
  },
});
