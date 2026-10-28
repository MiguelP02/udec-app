export type ForumLang = 'dart' | 'java' | 'python' | 'sql' | 'javascript';
export type UserRole = 'estudiante' | 'docente' | 'oficial';

export type MockUser = {
  id: string;
  name: string;
  initials: string;
  email: string;
  program: string;
  role: UserRole;
};

export type Question = {
  id: string;
  title: string;
  tags: string[];
  authorId: string;
  authorName: string;
  body: string;
  code: string | null;
  lang: ForumLang;
  voteCount: number;
  answerCount: number;
  solvedAnswerId: string | null;
  createdAt: Date;
};

export type Answer = {
  id: string;
  authorId: string;
  authorName: string;
  text: string;
  code: string | null;
  lang: ForumLang;
  voteCount: number;
  createdAt: Date;
};

const minutesAgo = (minutes: number): Date => new Date(Date.now() - minutes * 60_000);

const PROGRAM = 'Ingeniería de Software · Grupo 104';

/** Usuario autenticado de ejemplo. En la Fase 4 saldrá de Firebase Auth. */
export const MOCK_CURRENT_USER_ID = 'u-miguel';

export const mockUsers: Record<string, MockUser> = {
  'u-miguel': {
    id: 'u-miguel',
    name: 'Miguel Páez',
    initials: 'MP',
    email: 'miguel.paez@ucundinamarca.edu.co',
    program: PROGRAM,
    role: 'estudiante',
  },
  'u-gustavo': {
    id: 'u-gustavo',
    name: 'Gustavo Domínguez',
    initials: 'GD',
    email: 'gustavo.dominguez@ucundinamarca.edu.co',
    program: PROGRAM,
    role: 'estudiante',
  },
  'u-laura': {
    id: 'u-laura',
    name: 'Laura Gómez',
    initials: 'LG',
    email: 'laura.gomez@ucundinamarca.edu.co',
    program: PROGRAM,
    role: 'estudiante',
  },
};

export const mockQuestions: Question[] = [
  {
    id: 'q1',
    title: '¿Por qué mi StreamBuilder no se actualiza al enviar un mensaje a Firestore?',
    tags: ['flutter', 'firebase', 'dart'],
    authorId: 'u-gustavo',
    authorName: 'Gustavo Domínguez',
    body: 'Estoy haciendo el chat del proyecto. El mensaje sí se guarda en Firestore, pero la lista no se actualiza hasta que reinicio la app.',
    code: `// Pantalla del chat
final mensajes = await FirebaseFirestore.instance
    .collection('channels/is/messages')
    .get(); // solo lee una vez

ListView(children: mensajes.docs
    .map((d) => Text(d['texto']))
    .toList());`,
    lang: 'dart',
    voteCount: 7,
    answerCount: 2,
    solvedAnswerId: 'a1',
    createdAt: minutesAgo(120),
  },
  {
    id: 'q2',
    title: 'Diferencia entre LEFT JOIN e INNER JOIN para el taller de biblioteca',
    tags: ['sql', 'bases-de-datos'],
    authorId: 'u-laura',
    authorName: 'Laura Gómez',
    body: 'En el taller 3 me salen menos libros de los que hay. Creo que es por el JOIN.',
    code: `SELECT l.titulo, p.fecha
FROM libros l
INNER JOIN prestamos p ON p.libro_id = l.id;`,
    lang: 'sql',
    voteCount: 4,
    answerCount: 1,
    solvedAnswerId: 'a3',
    createdAt: minutesAgo(1560),
  },
  {
    id: 'q3',
    title: 'NullPointerException al recorrer un ArrayList en Java',
    tags: ['java', 'poo'],
    authorId: 'u-laura',
    authorName: 'Laura Gómez',
    body: 'Me sale NullPointerException en la línea del for. ¿Qué estoy haciendo mal?',
    code: `public class Curso {
    private ArrayList<String> estudiantes;

    public void listar() {
        for (String e : estudiantes) {
            System.out.println(e);
        }
    }
}`,
    lang: 'java',
    voteCount: 1,
    answerCount: 0,
    solvedAnswerId: null,
    createdAt: minutesAgo(30),
  },
  {
    id: 'q4',
    title: '¿Por qué mi widget no se actualiza?',
    tags: ['flutter', 'dart'],
    authorId: 'u-miguel',
    authorName: 'Miguel Páez',
    body: 'Cambio el estado pero la pantalla no se redibuja.',
    code: `// Actualización de contador
void _incrementCounter() {
  _counter++;
  // No se llama a setState
}`,
    lang: 'dart',
    voteCount: 4,
    answerCount: 2,
    solvedAnswerId: 'a4',
    createdAt: minutesAgo(300),
  },
];

export const mockAnswersByQuestion: Record<string, Answer[]> = {
  q1: [
    {
      id: 'a1',
      authorId: 'u-laura',
      authorName: 'Laura Gómez',
      text: 'Estás usando get(), que lee los datos una sola vez. Para tiempo real usa snapshots() dentro de un StreamBuilder:',
      code: `StreamBuilder(
  stream: FirebaseFirestore.instance
      .collection('channels/is/messages')
      .orderBy('fecha')
      .snapshots(), // escucha cambios en vivo
  builder: (context, snap) {
    if (!snap.hasData) return const CircularProgressIndicator();
    return ListView(children: snap.data!.docs
        .map((d) => Text(d['texto'])).toList());
  },
);`,
      lang: 'dart',
      voteCount: 5,
      createdAt: minutesAgo(90),
    },
    {
      id: 'a2',
      authorId: 'u-miguel',
      authorName: 'Miguel Páez',
      text: 'También revisa que las reglas de seguridad de Firestore permitan leer la colección.',
      code: null,
      lang: 'dart',
      voteCount: 1,
      createdAt: minutesAgo(60),
    },
  ],
  q2: [
    {
      id: 'a3',
      authorId: 'u-gustavo',
      authorName: 'Gustavo Domínguez',
      text: 'INNER JOIN solo devuelve libros que tienen préstamos. Si quieres todos los libros, aunque nunca se hayan prestado, usa LEFT JOIN.',
      code: `SELECT l.titulo, p.fecha
FROM libros l
LEFT JOIN prestamos p ON p.libro_id = l.id;`,
      lang: 'sql',
      voteCount: 6,
      createdAt: minutesAgo(1400),
    },
  ],
  q3: [],
  q4: [
    {
      id: 'a4',
      authorId: 'u-laura',
      authorName: 'Laura Gómez',
      text: 'Llama a setState después de cambiar la variable.',
      code: null,
      lang: 'dart',
      voteCount: 3,
      createdAt: minutesAgo(240),
    },
    {
      id: 'a5',
      authorId: 'u-gustavo',
      authorName: 'Gustavo Domínguez',
      text: 'Revisa que el widget sea StatefulWidget.',
      code: null,
      lang: 'dart',
      voteCount: 1,
      createdAt: minutesAgo(200),
    },
  ],
};
