<div align="center">
  <img src="./assets/images/android-icon-foreground.png" alt="tarimApp" width="120" />

  # tarimApp

  Calculadora de piezas para armar escenarios y tarimas modulares.

  ![Expo SDK](https://img.shields.io/badge/Expo-SDK%2057-000000?logo=expo&logoColor=white)
  ![React Native](https://img.shields.io/badge/React%20Native-0.86-61DAFB?logo=react&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)
  ![License](https://img.shields.io/badge/license-MIT-orange)
</div>

---

## Qué hace

Armás el escenario tocando y arrastrando sobre una grilla, y la app calcula automáticamente todas las piezas necesarias para montarlo físicamente:

- **Chapones** de 2x1 y 1x1 (los paneles que forman la superficie).
- **Patas** (los apoyos en cada vértice de la estructura).
- **Lados** de 2m y 1m (los caños/rieles que conectan las patas).

Después de calcular, la grilla muestra el **tiling**: cómo se acomodan los chapones sobre el área seleccionada, para saber exactamente dónde va cada pieza.

## Cómo se usa

1. Tocá una celda para agregarla o quitarla de la selección.
2. Arrastrá de una celda a otra para seleccionar un rectángulo completo.
3. Tocá **Calcular** para obtener la lista de piezas y ver el armado sugerido en la grilla.
4. Tocá **Limpiar** para empezar de nuevo.

## El algoritmo

La lógica de cálculo vive en [`src/logic/calcular-piezas.ts`](src/logic/calcular-piezas.ts):

1. **Tiling**: agrupa las celdas seleccionadas priorizando chapones 2x1 horizontales, después 2x1 verticales (casos de borde), y cubre el resto con 1x1.
2. **Patas y lados**: a partir de los chapones, deduce los vértices (patas) y las aristas (lados) sin duplicados.
3. **Ajuste de lados**: si un lado de 2m tiene una pata apoyada justo en su punto medio (por un chapón vecino), se parte en dos lados de 1m, porque no se puede apoyar una pata contra la mitad de un caño de 2m.

## Stack técnico

- [Expo](https://docs.expo.dev/versions/v57.0.0/) SDK 57 + [Expo Router](https://docs.expo.dev/router/introduction/)
- React Native 0.86 (New Architecture)
- TypeScript
- EAS Build para generar builds de desarrollo y APKs standalone

## Empezar a desarrollar

```bash
npm install
npx expo start
```

Desde ahí podés abrir la app en:

- **Expo Go**, escaneando el QR (si el proyecto es compatible con la versión de Expo Go instalada).
- Un **development build** propio (`npx expo start --dev-client`), necesario si Expo Go no soporta el SDK o algún módulo nativo del proyecto.
- El **navegador** (`npx expo start --web`).

## Generar un APK

Con [`eas.json`](eas.json) ya configurado en el proyecto:

```bash
# Build de desarrollo (requiere expo start --dev-client corriendo)
eas build --profile development --platform android

# Build standalone, con el JS ya empaquetado adentro (no depende de Metro)
eas build --profile preview --platform android
```

## Estructura del proyecto

```
src/
├── app/            # Rutas de Expo Router (tabs, layout)
├── components/     # Pantallas y componentes de UI
├── logic/          # Cálculo de piezas (independiente de la UI)
├── constants/      # Tema, colores de marca, espaciados
└── hooks/          # Hooks compartidos (tema, color scheme)
```

## Licencia

MIT — ver [LICENSE](LICENSE).
