import { Image, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';
import { ResultadoCalculo } from '../logic/tipos';

interface ItemPieza {
  nombre: string;
  cantidad: number;
  imagen: ImageSourcePropType;
}

interface ListaPiezasProps {
  resultado: ResultadoCalculo;
  // Cada imagen se pasa desde afuera (require('../../assets/images/...'))
  // para no acoplar este componente a rutas de assets concretas.
  imagenes: {
    chapon2x1: ImageSourcePropType;
    chapon1x1: ImageSourcePropType;
    pata: ImageSourcePropType;
    lado2m: ImageSourcePropType;
    lado1m: ImageSourcePropType;
  };
}

export default function ListaPiezas({ resultado, imagenes }: ListaPiezasProps) {
  const items: ItemPieza[] = [
    { nombre: 'Chapón 2x1', cantidad: resultado.chapones2x1, imagen: imagenes.chapon2x1 },
    { nombre: 'Chapón 1x1', cantidad: resultado.chapones1x1, imagen: imagenes.chapon1x1 },
    { nombre: 'Patas', cantidad: resultado.patas, imagen: imagenes.pata },
    { nombre: 'Lados de 2m', cantidad: resultado.lados2m, imagen: imagenes.lado2m },
    { nombre: 'Lados de 1m', cantidad: resultado.lados1m, imagen: imagenes.lado1m },
  ].filter((item) => item.cantidad > 0);

  return (
    <View style={styles.contenedor}>
      {items.map((item) => (
        <View key={item.nombre} style={styles.fila}>
          <Image source={item.imagen} style={styles.imagen} resizeMode="contain" />
          <Text style={styles.nombre}>{item.nombre}</Text>
          <Text style={styles.cantidad}>x{item.cantidad}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    marginTop: 16,
    gap: 8,
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
  },
  imagen: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  nombre: {
    flex: 1,
    fontSize: 16,
  },
  cantidad: {
    fontSize: 16,
    fontWeight: '700',
  },
});