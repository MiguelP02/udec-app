import type { ChannelInfo, ChannelItem, ChatFile, Message } from '../types/chat';

/** Fecha de ejemplo relativa a hoy, para que "Ayer" y la hora sean correctos al abrir la app. */
export function mockDate(daysAgo: number, hour: number, minute: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, minute, 0, 0);
  return d;
}

// TODO(fase 5): sustituir por useChannels() y useUnreadCounts(). Este archivo se borra al conectar Firebase.

/** Canales de la lista de Chats (orden de la especificación; la pantalla los reordena). */
export const MOCK_CHANNELS: ChannelItem[] = [
  {
    id: 'avisos',
    name: 'Avisos Generales UdeC',
    short: 'AV',
    color: 'blue',
    kind: 'Oficial',
    memberCount: 5230,
    readOnly: true,
    pinned: true,
    lastMessage: { authorName: '', text: 'Canal oficial de avisos.' },
    lastMessageAt: mockDate(0, 10, 15),
    unread: 0,
  },
  {
    id: 'is',
    name: 'Ingeniería de Software · G104',
    short: 'IS',
    color: 'green',
    kind: 'Materia',
    memberCount: 34,
    readOnly: false,
    pinned: false,
    lastMessage: { authorName: 'Laura Gómez', text: '¿Ya saben en qué orden pasamos?' },
    lastMessageAt: mockDate(0, 11, 48),
    unread: 3,
  },
  {
    id: 'bd',
    name: 'Bases de Datos',
    short: 'BD',
    color: 'blue',
    kind: 'Materia',
    memberCount: 29,
    readOnly: false,
    pinned: false,
    lastMessage: { authorName: 'Andrés Ruiz', text: 'Subí el script de la base de la biblioteca para el taller.' },
    lastMessageAt: mockDate(0, 11, 2),
    unread: 1,
  },
  {
    id: 'ua',
    name: 'Proyecto UDEC APP',
    short: 'UA',
    color: 'yellow',
    kind: 'Grupo',
    memberCount: 2,
    readOnly: false,
    pinned: false,
    lastMessage: { authorName: 'Gustavo Domínguez', text: 'Ya tengo listo el póster, ¿cómo vas con el prototipo?' },
    lastMessageAt: mockDate(1, 12, 40),
    unread: 0,
  },
  {
    id: 'm2',
    name: 'Matemáticas II',
    short: 'M2',
    color: 'purple',
    kind: 'Materia',
    memberCount: 41,
    readOnly: false,
    pinned: false,
    lastMessage: { authorName: 'Valentina Rojas', text: '¿Alguien resolvió el ejercicio 12 de la guía?' },
    lastMessageAt: mockDate(3, 18, 20),
    unread: 0,
  },
];

/** Datos del detalle por canal. Solo `is` tiene aviso fijado. */
export const CHANNEL_INFO: Partial<Record<string, ChannelInfo>> = {
  is: {
    id: 'is',
    name: 'Ingeniería de Software · G104',
    short: 'IS',
    color: 'green',
    kind: 'Materia',
    memberCount: 34,
    readOnly: false,
    pinned: { by: 'Prof. Ramírez', text: 'Traigan el avance del prototipo.' },
  },
  bd: {
    id: 'bd',
    name: 'Bases de Datos',
    short: 'BD',
    color: 'blue',
    kind: 'Materia',
    memberCount: 29,
    readOnly: false,
    pinned: null,
  },
  ua: {
    id: 'ua',
    name: 'Proyecto UDEC APP',
    short: 'UA',
    color: 'yellow',
    kind: 'Grupo',
    memberCount: 2,
    readOnly: false,
    pinned: null,
  },
  avisos: {
    id: 'avisos',
    name: 'Avisos Generales UdeC',
    short: 'AV',
    color: 'blue',
    kind: 'Oficial',
    memberCount: 5230,
    readOnly: true,
    pinned: null,
  },
  m2: {
    id: 'm2',
    name: 'Matemáticas II',
    short: 'M2',
    color: 'purple',
    kind: 'Materia',
    memberCount: 41,
    readOnly: false,
    pinned: null,
  },
};

// TODO(fase 5): archivos del canal desde Firestore (y Cloudinary para la url).
const RUBRICA: ChatFile = {
  id: 'f1',
  name: 'Rubrica_prototipo.pdf',
  size: '240 KB',
  type: 'pdf',
  color: 'red',
  url: null,
  publicId: null,
  resourceType: null,
  uploadedBy: 'Prof. Ramírez',
  uploadedById: 'mock-teacher',
  createdAt: new Date('2026-10-26T15:10:00'),
};

/** Archivos por canal. Solo `is` tiene archivos en los datos de ejemplo. */
export const MOCK_FILES: Partial<Record<string, ChatFile[]>> = {
  is: [
    RUBRICA,
    {
      id: 'f2',
      name: 'Informe_avance.doc',
      size: '240 KB',
      type: 'doc',
      color: 'blue',
      url: null,
      publicId: null,
      resourceType: null,
      uploadedBy: 'Prof. Ramírez',
      uploadedById: 'mock-teacher',
      createdAt: new Date('2026-10-26T15:20:00'),
    },
    {
      id: 'f3',
      name: 'Mockup_login.png',
      size: '240 KB',
      type: 'img',
      color: 'green',
      url: null,
      publicId: null,
      resourceType: null,
      uploadedBy: 'Prof. Ramírez',
      uploadedById: 'mock-teacher',
      createdAt: new Date('2026-10-26T15:30:00'),
    },
    {
      id: 'f4',
      name: 'Esquema_datos.sql',
      size: '240 KB',
      type: 'sql',
      color: 'purple',
      url: null,
      publicId: null,
      resourceType: null,
      uploadedBy: 'Prof. Ramírez',
      uploadedById: 'mock-teacher',
      createdAt: new Date('2026-10-26T15:40:00'),
    },
  ],
  bd: [],
  ua: [],
  avisos: [],
  m2: [],
};

/** Mensajes por canal, del más nuevo al más viejo (así lo espera withDaySeparators). */
export const MOCK_MESSAGES: Partial<Record<string, Message[]>> = {
  is: [
    {
      id: 'm6',
      authorId: 'me',
      authorName: 'Miguel Páez',
      authorRole: 'estudiante',
      text: 'Pasamos después del grupo de Laura.',
      file: null,
      createdAt: mockDate(0, 11, 50),
    },
    {
      id: 'm5',
      authorId: 'u-laura',
      authorName: 'Laura Gómez',
      authorRole: 'estudiante',
      text: '¿Ya saben en qué orden pasamos?',
      file: null,
      createdAt: mockDate(0, 11, 48),
    },
    {
      id: 'm4',
      authorId: 'u-ramirez',
      authorName: 'Prof. Ramírez',
      authorRole: 'docente',
      text: 'Les dejo la rúbrica de evaluación.',
      file: RUBRICA,
      createdAt: mockDate(0, 7, 2),
    },
    {
      id: 'm3',
      authorId: 'u-ramirez',
      authorName: 'Prof. Ramírez',
      authorRole: 'docente',
      text: 'Puede ser cualquiera, pero debe verse cómo funcionaría en el celular.',
      file: null,
      createdAt: mockDate(1, 16, 30),
    },
    {
      id: 'm2',
      authorId: 'u-gustavo',
      authorName: 'Gustavo Domínguez',
      authorRole: 'estudiante',
      text: 'Profe, ¿el prototipo puede ser web o tiene que ser móvil?',
      file: null,
      createdAt: mockDate(1, 16, 22),
    },
    {
      id: 'm1',
      authorId: 'u-ramirez',
      authorName: 'Prof. Ramírez',
      authorRole: 'docente',
      text: 'Recuerden subir el documento del proyecto antes de la exposición.',
      file: null,
      createdAt: mockDate(1, 16, 10),
    },
  ],
  bd: [],
  ua: [],
  avisos: [],
  m2: [],
};
