# UDEC APP · Prototipo en Flutter

Aplicación móvil de comunicación académica para la Universidad de Cundinamarca.
Incluye tres funcionalidades principales:

1. **Chats por materia y grupo**: mensajes en tiempo real, mensaje fijado por el docente, pestaña de archivos y canales oficiales de solo lectura.
2. **Comunidad UdeC**: muro tipo red social con etiquetas (#Eventos, #Semilleros…), cuentas oficiales verificadas, me gusta y comentarios.
3. **Foro técnico**: preguntas de programación con código resaltado, votos y respuesta marcada como solución.

Además: inicio de sesión que solo acepta correos `@ucundinamarca.edu.co` y perfil del estudiante.

## Cómo ejecutarlo

### Opción rápida (Windows)
Doble clic en **EJECUTAR.bat**. La primera vez prepara el proyecto y luego abre la app en Chrome.

### Opción manual
```bash
flutter create --project-name udec_app --org co.edu.ucundinamarca --platforms=android,web .
flutter pub get
flutter run -d chrome      # en el navegador
flutter run                # en un celular Android conectado o emulador
```
`flutter create .` solo agrega las carpetas que faltan (android, web); no reemplaza el código de `lib/`.

### Generar el APK para instalar en el celular
```bash
flutter build apk --release
```
El archivo queda en `build/app/outputs/flutter-apk/app-release.apk`.

## Estructura

```
lib/
  main.dart                 App, tema y barra de navegación inferior
  app_state.dart            Estado de la app (mensajes, publicaciones, foro)
  models.dart               Modelos: Channel, Message, Post, Question, Answer
  sample_data.dart          Datos de ejemplo para la demostración
  theme.dart                Colores institucionales UdeC
  widgets.dart              Componentes reutilizables
  code_block.dart           Resaltado de código del foro
  screens/
    login_screen.dart
    chats_screen.dart
    chat_detail_screen.dart
    community_screen.dart
    forum_screen.dart
    ask_question_screen.dart
    question_detail_screen.dart
    profile_screen.dart
```

## Siguiente fase: Firebase
El prototipo usa datos en memoria. Para la versión real:
- **Firebase Auth** para el inicio de sesión institucional.
- **Cloud Firestore** con `snapshots()` para los mensajes en tiempo real.
- **Firebase Storage** para los archivos de cada materia.

Los métodos de `AppState` (`sendMessage`, `addPost`, `askQuestion`…) son los puntos donde se conecta Firestore.

**Autores:** Miguel Antonio Páez Leonel · Gustavo Adolfo Domínguez Páez — Ingeniería de Software, Grupo 104.
