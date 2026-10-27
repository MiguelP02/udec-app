import 'models.dart';
import 'theme.dart';

/// Datos de ejemplo para la demostración. En la versión final vendrán de Firebase.

const _pdf = UdecColors.red;
const _doc = UdecColors.blue;
const _img = UdecColors.green;
const _sql = UdecColors.purple;

List<Channel> sampleChannels() => [
      Channel(
        id: 'is',
        name: 'Ingeniería de Software · G104',
        short: 'IS',
        color: UdecColors.green,
        kind: 'Materia',
        members: '34',
        unread: 3,
        pinned: const Pinned('Prof. Ramírez (docente)',
            'Exposición de prototipos: hoy 27 de octubre. 5 minutos por grupo, en orden de lista.'),
        files: [
          const ChatFile(name: 'Rubrica_prototipo.pdf', size: '240 KB', type: 'PDF', uploadedBy: 'Prof. Ramírez', color: _pdf),
          const ChatFile(name: 'Plantilla_IEEE830.docx', size: '88 KB', type: 'DOC', uploadedBy: 'Prof. Ramírez', color: _doc),
          const ChatFile(name: 'Diagrama_casos_uso.png', size: '1,2 MB', type: 'IMG', uploadedBy: 'Gustavo Domínguez', color: _img),
        ],
        messages: [
          const Message.separator('Ayer'),
          const Message(author: 'Prof. Ramírez', role: 'Docente', text: 'Recuerden subir el documento del proyecto antes de la exposición.', time: '4:10 p. m.'),
          const Message(author: 'Gustavo Domínguez', text: 'Profe, ¿el prototipo puede ser web o tiene que ser móvil?', time: '4:22 p. m.'),
          const Message(author: 'Prof. Ramírez', role: 'Docente', text: 'Puede ser cualquiera, pero debe verse cómo funcionaría en el celular.', time: '4:30 p. m.'),
          const Message.separator('Hoy'),
          const Message(author: 'Prof. Ramírez', role: 'Docente', text: 'Les dejo la rúbrica de evaluación.', fileIndex: 0, time: '7:02 a. m.'),
          const Message(author: 'Laura Gómez', text: '¿Ya saben en qué orden pasamos?', time: '11:48 a. m.'),
        ],
        replies: [
          'Pasamos después del grupo de Laura 👍',
          'Profe, ¿se puede proyectar desde el celular?',
          'Ya revisé la rúbrica, el prototipo vale 40%',
          'Listo, nos vemos en el salón 204',
        ],
      ),
      Channel(
        id: 'bd',
        name: 'Bases de Datos',
        short: 'BD',
        color: UdecColors.blue,
        kind: 'Materia',
        members: '29',
        pinned: const Pinned('Ing. Torres (docente)', 'Taller 3 de normalización: entrega el viernes 30 de octubre.'),
        files: [
          const ChatFile(name: 'Taller3_normalizacion.pdf', size: '310 KB', type: 'PDF', uploadedBy: 'Ing. Torres', color: _pdf),
          const ChatFile(name: 'script_biblioteca.sql', size: '12 KB', type: 'SQL', uploadedBy: 'Andrés Ruiz', color: _sql),
        ],
        messages: [
          const Message.separator('Hoy'),
          const Message(author: 'Andrés Ruiz', text: 'Subí el script de la base de la biblioteca para el taller.', fileIndex: 1, time: '9:15 a. m.'),
          const Message(author: 'Ing. Torres', role: 'Docente', text: 'Revisen la tercera forma normal antes de entregar.', time: '10:02 a. m.'),
        ],
        replies: ['¿Alguien tiene el diagrama entidad-relación?', 'Gracias por el script 🙌'],
      ),
      Channel(
        id: 'proy',
        name: 'Proyecto UDEC APP',
        short: 'UA',
        color: UdecColors.yellow,
        kind: 'Grupo',
        members: '2',
        unread: 1,
        pinned: const Pinned('Miguel Páez', 'Tareas: Miguel → prototipo · Gustavo → documento y diapositivas.'),
        files: [
          const ChatFile(name: 'Documento_UDEC_APP.pdf', size: '650 KB', type: 'PDF', uploadedBy: 'Miguel Páez', color: _pdf),
          const ChatFile(name: 'Poster_UDEC_APP.png', size: '2,4 MB', type: 'IMG', uploadedBy: 'Gustavo Domínguez', color: _img),
        ],
        messages: [
          const Message.separator('Hoy'),
          const Message(author: 'Gustavo Domínguez', text: 'Ya tengo listo el póster, ¿cómo vas con el prototipo?', time: '12:40 p. m.'),
        ],
        replies: [
          '¡Se ve muy bien! Lo probé en mi celular',
          'Yo presento el problema y tú haces la demo',
          'Recuerda mostrar el login con correo institucional',
        ],
      ),
      Channel(
        id: 'avisos',
        name: 'Avisos Generales UdeC',
        short: 'AV',
        color: UdecColors.blue,
        kind: 'Oficial',
        members: '5.230',
        unread: 2,
        readOnly: true,
        pinned: const Pinned('Secretaría Académica', 'Las notas del segundo corte se publican hasta el 7 de noviembre.'),
        files: [
          const ChatFile(name: 'Calendario_academico_2026-2.pdf', size: '420 KB', type: 'PDF', uploadedBy: 'Secretaría Académica', color: _pdf),
        ],
        messages: [
          const Message.separator('Hoy'),
          const Message(author: 'Secretaría Académica', role: 'Oficial', text: 'Se publicó el calendario académico actualizado del semestre 2026-2.', fileIndex: 0, time: '8:00 a. m.'),
          const Message(author: 'Bienestar Universitario', role: 'Oficial', text: 'Jornada de salud mental este jueves en la plazoleta central.', time: '10:30 a. m.'),
        ],
        replies: [],
      ),
      Channel(
        id: 'mat',
        name: 'Matemáticas II',
        short: 'M2',
        color: UdecColors.purple,
        kind: 'Materia',
        members: '41',
        pinned: const Pinned('Prof. Salazar (docente)', 'Parcial de integrales: martes 3 de noviembre.'),
        files: [],
        messages: [
          const Message.separator('Ayer'),
          const Message(author: 'Valentina Rojas', text: '¿Alguien resolvió el ejercicio 12 de la guía?', time: '6:20 p. m.'),
        ],
        replies: ['Yo lo hice por sustitución trigonométrica'],
      ),
    ];

List<Post> samplePosts() => [
      Post(
        id: 1,
        author: 'Bienestar Universitario',
        initials: 'BU',
        color: UdecColors.blue,
        official: true,
        tag: 'Eventos',
        time: 'Hace 1 h',
        text: 'Ven a conocer los emprendimientos de estudiantes de todas las facultades. ¡Habrá premios para los mejores proyectos!',
        banner: const EventBanner(title: 'Feria de Emprendimiento UdeC', subtitle: 'Bloque C · 9:00 a. m. a 4:00 p. m.', day: '29', month: 'OCT', color: UdecColors.blue),
        likes: 84,
        comments: [
          const Comment('Camila Ortiz', '¿Se pueden inscribir proyectos de software?'),
          const Comment('Bienestar Universitario', 'Sí, Camila. La inscripción está abierta hasta el miércoles.'),
        ],
      ),
      Post(
        id: 2,
        author: 'Semillero de IA – UdeC',
        initials: 'IA',
        color: UdecColors.green,
        official: true,
        tag: 'Semilleros',
        time: 'Hace 3 h',
        text: 'Abrimos convocatoria para nuevos integrantes de Ingeniería de Software y Sistemas. Trabajamos con visión por computador y modelos de lenguaje. Reunión informativa el lunes en la sala de sistemas 3.',
        likes: 52,
      ),
      Post(
        id: 3,
        author: 'Juan Esteban Mora',
        initials: 'JM',
        color: UdecColors.rust,
        tag: 'Ventas',
        time: 'Hace 5 h',
        text: 'Vendo calculadora científica Casio fx-991 en buen estado, ideal para Cálculo y Física. Escríbanme por chat.',
        likes: 9,
        comments: [const Comment('Daniel Peña', '¿En cuánto la dejas?')],
      ),
      Post(
        id: 4,
        author: 'Deportes UdeC',
        initials: 'DU',
        color: UdecColors.yellow,
        official: true,
        tag: 'Deportes',
        time: 'Ayer',
        text: 'Arma tu equipo de 8 jugadores e inscríbelo en la oficina de deportes.',
        banner: const EventBanner(title: 'Torneo interno de microfútbol', subtitle: 'Inscripciones abiertas por programa', day: '05', month: 'NOV', color: UdecColors.green),
        likes: 120,
      ),
      Post(
        id: 5,
        author: 'Natalia Ríos',
        initials: 'NR',
        color: UdecColors.purple,
        tag: 'Perdidos',
        time: 'Ayer',
        text: 'Encontré una USB negra en la sala de sistemas 3. La dejé en la portería del bloque B.',
        likes: 23,
      ),
    ];

List<Question> sampleQuestions() => [
      Question(
        id: 1,
        title: '¿Por qué mi StreamBuilder no se actualiza al enviar un mensaje a Firestore?',
        tags: ['flutter', 'firebase', 'dart'],
        author: 'Gustavo Domínguez',
        time: 'Hace 2 h',
        votes: 7,
        body: 'Estoy haciendo el chat del proyecto. El mensaje sí se guarda en Firestore, pero la lista no se actualiza hasta que reinicio la app.',
        lang: 'dart',
        code: '''// Pantalla del chat
final mensajes = await FirebaseFirestore.instance
    .collection('channels/is/messages')
    .get(); // solo lee una vez

ListView(children: mensajes.docs
    .map((d) => Text(d['texto']))
    .toList());''',
        answers: [
          Answer(
            id: 1,
            author: 'Laura Gómez',
            votes: 5,
            solution: true,
            text: 'Estás usando get(), que lee los datos una sola vez. Para tiempo real usa snapshots() dentro de un StreamBuilder:',
            lang: 'dart',
            code: '''StreamBuilder(
  stream: FirebaseFirestore.instance
      .collection('channels/is/messages')
      .orderBy('fecha')
      .snapshots(), // escucha cambios en vivo
  builder: (context, snap) {
    if (!snap.hasData) return const CircularProgressIndicator();
    return ListView(children: snap.data!.docs
        .map((d) => Text(d['texto'])).toList());
  },
);''',
          ),
          Answer(
            id: 2,
            author: 'Andrés Ruiz',
            votes: 1,
            text: 'También revisa que las reglas de seguridad de Firestore permitan leer la colección.',
          ),
        ],
      ),
      Question(
        id: 2,
        title: 'Diferencia entre LEFT JOIN e INNER JOIN para el taller de biblioteca',
        tags: ['sql', 'bases-de-datos'],
        author: 'Valentina Rojas',
        time: 'Ayer',
        votes: 4,
        body: 'En el taller 3 me salen menos libros de los que hay. Creo que es por el JOIN.',
        lang: 'sql',
        code: '''SELECT l.titulo, p.fecha
FROM libros l
INNER JOIN prestamos p ON p.libro_id = l.id;''',
        answers: [
          Answer(
            id: 1,
            author: 'Ing. Torres',
            votes: 6,
            solution: true,
            text: 'INNER JOIN solo devuelve libros que tienen préstamos. Si quieres todos los libros, aunque nunca se hayan prestado, usa LEFT JOIN.',
            lang: 'sql',
            code: '''SELECT l.titulo, p.fecha
FROM libros l
LEFT JOIN prestamos p ON p.libro_id = l.id;''',
          ),
        ],
      ),
      Question(
        id: 3,
        title: 'NullPointerException al recorrer un ArrayList en Java',
        tags: ['java', 'poo'],
        author: 'Daniel Peña',
        time: 'Hace 30 min',
        votes: 1,
        body: 'Me sale NullPointerException en la línea del for. ¿Qué estoy haciendo mal?',
        lang: 'java',
        code: '''public class Curso {
    private ArrayList<String> estudiantes;

    public void listar() {
        for (String e : estudiantes) {
            System.out.println(e);
        }
    }
}''',
      ),
    ];
