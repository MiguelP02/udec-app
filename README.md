# UDEC APP

Aplicación móvil de comunicación académica para la Universidad de Cundinamarca (UdeC), programa de Ingeniería de Software, Grupo 104, semestre 2025-2.

Busca reemplazar el uso de WhatsApp para lo académico y funcionar también como red social de la comunidad universitaria.

## Funcionalidades

1. **Chats por materia y grupo:** conversaciones por materia, mensaje fijado por el docente, pestaña de archivos por canal y canales oficiales de solo lectura (Avisos Generales).
2. **Comunidad UdeC:** muro con etiquetas (#Eventos, #Semilleros, #Deportes, #Ventas, #Perdidos), cuentas oficiales verificadas, me gusta y comentarios.
3. **Foro técnico de programación:** preguntas con código resaltado, votos, respuestas y marcar una respuesta como solución.
4. **Acceso institucional:** solo cuentas `@ucundinamarca.edu.co`, con verificación por correo, y perfil del estudiante con cambio de contraseña y tema claro u oscuro.

## Estado del proyecto

El proyecto se migró de Flutter a **React Native con Expo**. La versión actual es un prototipo navegable con datos de ejemplo:

- Todas las pantallas están implementadas: login, registro, recuperar contraseña, verificar correo, chats, detalle del chat, archivos, comunidad, foro (lista, detalle y nueva pregunta), perfil y bienvenida.
- Los datos viven en `src/data/` y son de ejemplo. La sesión de demostración es **solo para la presentación**.
- **Pendiente:** conectar Firebase Authentication y Firestore (fase 4), adjuntos con Cloudinary (fase 5) y los datos reales de comunidad, foro y perfil (fases 6 a 8).

El código Flutter original se conserva como referencia en `reference/flutter/`.

## Cómo ejecutarlo

Requisitos: Node.js 22.13 o superior y la app **Expo Go** instalada en el teléfono (Android o iPhone). Expo Go debe ser de la misma versión de SDK que el proyecto (SDK 58).

```bash
npm install
npm start
```

Escanea el código QR con la cámara del iPhone o con Expo Go en Android. Si la red no permite la conexión directa, usa `npm run start:tunnel`.

Para ver los cambios de configuración de Tailwind o de `app.json`, reinicia con `npx expo start -c`.

### Sesión de demostración

Mientras no esté conectado Firebase, el login acepta una única cuenta de prueba:

- Correo: `mantoniopaez@ucundinamarca.edu.co`
- Contraseña: `test123`

Cualquier otro correo muestra el error de dominio institucional. La contraseña se puede cambiar desde el perfil; el cambio dura hasta cerrar la app.

## Scripts

| Comando | Qué hace |
|---|---|
| `npm start` | Inicia el servidor de Expo |
| `npm run start:tunnel` | Inicia el servidor por túnel (útil en redes que aíslan dispositivos) |
| `npm run typecheck` | Revisa los tipos de TypeScript |
| `npm run lint` | Revisa el código con ESLint |
| `npm test` | Ejecuta las pruebas unitarias con Jest |
| `node scripts/build-theme-css.js` | Regenera `src/global.css` después de cambiar un color de la paleta |

## Tecnologías

- **Expo SDK 58** con **Expo Router** (navegación por archivos) y **TypeScript** en modo estricto.
- **NativeWind 4** (Tailwind CSS) para los estilos, con un tema claro y uno oscuro que se cambian en el perfil.
- **Public Sans** como tipografía y `@expo/vector-icons` para los íconos.
- Planeado: **Firebase** (Auth y Firestore) para la versión real, y **Cloudinary** para los archivos adjuntos.

## Estructura

```
src/
  app/          Rutas (Expo Router): (auth), (app)/(tabs), chat, foro
  components/   Componentes reutilizables (estados, control segmentado, publicaciones...)
  data/         Datos de ejemplo (se reemplazan por Firebase)
  providers/    Sesión de demostración
  theme/        Paletas claro y oscuro, tokens, tipografía y contexto del tema
  types/        Tipos de dominio
  utils/        Fechas, iniciales, archivos, resaltado de código y correos
docs/           Plan de migración, especificaciones de UI y guías
design/         Diseño de referencia exportado desde Google Stitch
reference/      Código Flutter original (solo referencia)
scripts/        Utilidades de desarrollo
```

Las pantallas siguen las especificaciones de `docs/ui/`. El plan completo de la migración está en `docs/PLAN_MIGRACION_RN.md` y el avance por fase en `docs/PROGRESO.md`.

## Autores

- Miguel Antonio Páez Leonel
- Gustavo Adolfo Domínguez Páez

Ingeniería de Software, Grupo 104, Universidad de Cundinamarca.
