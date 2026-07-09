import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { BrandColors } from '../constants/theme';
import { useTheme } from '../hooks/use-theme';

interface MedidasEscenarioProps {
  a: number | undefined;
  b: number | undefined;
  formaIrregular: boolean;
  maxA: number;
  maxB: number;
  onCambiarA: (a: number | undefined) => void;
  onCambiarB: (b: number | undefined) => void;
  onAplicar: () => void;
}

// Filtra a solo dígitos y limita el valor al máximo de la grilla (12x8):
// es la opción menos invasiva frente a agregar un componente de aviso/toast
// que hoy no existe en el resto de la app.
function parsearMedida(texto: string, maximo: number): number | undefined {
  const soloDigitos = texto.replace(/[^0-9]/g, '');
  if (soloDigitos === '') return undefined;
  const valor = Number(soloDigitos);
  if (valor <= 0) return undefined;
  return Math.min(valor, maximo);
}

export default function MedidasEscenario({
  a,
  b,
  formaIrregular,
  maxA,
  maxB,
  onCambiarA,
  onCambiarB,
  onAplicar,
}: MedidasEscenarioProps) {
  const theme = useTheme();
  const puedeAplicar = a !== undefined && b !== undefined;

  return (
    <View style={[styles.contenedor, { backgroundColor: theme.backgroundElement }]}>
      <Text style={[styles.titulo, { color: theme.text }]}>Medidas del escenario (a x b)</Text>

      <View style={styles.fila}>
        <View style={styles.campo}>
          <Text style={[styles.etiqueta, { color: theme.textSecondary }]}>a (frente/fondo)</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.backgroundSelected, color: theme.text }]}
            value={a !== undefined ? String(a) : ''}
            onChangeText={(texto) => onCambiarA(parsearMedida(texto, maxA))}
            keyboardType="number-pad"
            inputMode="numeric"
            placeholder={formaIrregular ? 'irregular' : '-'}
            placeholderTextColor={theme.textSecondary}
          />
        </View>

        <Text style={[styles.separador, { color: theme.textSecondary }]}>×</Text>

        <View style={styles.campo}>
          <Text style={[styles.etiqueta, { color: theme.textSecondary }]}>b (lados)</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.backgroundSelected, color: theme.text }]}
            value={b !== undefined ? String(b) : ''}
            onChangeText={(texto) => onCambiarB(parsearMedida(texto, maxB))}
            keyboardType="number-pad"
            inputMode="numeric"
            placeholder={formaIrregular ? 'irregular' : '-'}
            placeholderTextColor={theme.textSecondary}
          />
        </View>

        <Pressable
          style={[styles.boton, !puedeAplicar && styles.botonDeshabilitado]}
          onPress={onAplicar}
          disabled={!puedeAplicar}
        >
          <Text style={styles.botonTexto}>Aplicar</Text>
        </Pressable>
      </View>

      {formaIrregular && (
        <Text style={styles.aviso}>Forma irregular: no se puede expresar como a × b</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    width: '100%',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  titulo: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 10,
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  campo: {
    flex: 1,
  },
  etiqueta: {
    fontSize: 12,
    marginBottom: 4,
  },
  input: {
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 14,
    textAlign: 'center',
  },
  separador: {
    fontSize: 16,
    paddingBottom: 8,
  },
  boton: {
    backgroundColor: BrandColors.secondary,
    borderRadius: 6,
    paddingVertical: 9,
    paddingHorizontal: 14,
  },
  botonDeshabilitado: {
    opacity: 0.4,
  },
  botonTexto: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  aviso: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '700',
    color: BrandColors.alert,
  },
});
