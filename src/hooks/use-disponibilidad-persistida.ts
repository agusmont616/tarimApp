import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';
import { Disponibilidad } from '@/logic/tipos';

const CLAVE_STORAGE = 'disponibilidad';

// Carga la disponibilidad guardada al montar y persiste cada cambio
// posterior. `cargado` distingue "todavía no leí el storage" de "leí y no
// había nada guardado", para que la UI no muestre "Sin límite" un instante
// antes de que llegue el valor real.
export function useDisponibilidadPersistida() {
  const [disponibilidad, setDisponibilidad] = useState<Disponibilidad>({});
  const [cargado, setCargado] = useState(false);
  const yaCargo = useRef(false);

  useEffect(() => {
    AsyncStorage.getItem(CLAVE_STORAGE)
      .then((valor) => {
        if (valor) setDisponibilidad(JSON.parse(valor));
      })
      .finally(() => {
        yaCargo.current = true;
        setCargado(true);
      });
  }, []);

  useEffect(() => {
    // Evita pisar el dato guardado con el `{}` inicial mientras la lectura
    // de arriba todavía está en vuelo.
    if (!yaCargo.current) return;
    AsyncStorage.setItem(CLAVE_STORAGE, JSON.stringify(disponibilidad));
  }, [disponibilidad]);

  return { disponibilidad, setDisponibilidad, cargado };
}
