import type { PostView } from '@/types/community';

const hoursAgo = (hours: number): Date => new Date(Date.now() - hours * 60 * 60 * 1000);

export const CURRENT_USER = { id: 'mock-user', name: 'Miguel Páez', initials: 'MP' };

export const MOCK_POSTS: PostView[] = [
  {
    id: 'p1',
    authorId: 'mock-bienestar',
    authorName: 'Bienestar UdeC',
    initials: 'BU',
    color: 'blue',
    official: true,
    tag: '#Eventos',
    text: 'Esta semana tenemos actividades abiertas para todos.',
    banner: {
      title: 'Feria de Emprendimiento UdeC',
      subtitle: 'Bloque C · 9:00 a. m. a 4:00 p. m.',
      day: '29',
      month: 'OCT',
      color: 'blue',
    },
    likeCount: 12,
    commentCount: 3,
    createdAt: hoursAgo(1),
    likedByMe: false,
    comments: [], // los 3 comentarios no están cargados en el ejemplo: el contador viene del documento
  },
  {
    id: 'p2',
    authorId: 'mock-laura',
    authorName: 'Laura Gómez',
    initials: 'LG',
    color: 'green',
    official: false,
    tag: '#Semilleros',
    text: '¿Alguien se une al semillero de datos?',
    banner: null,
    likeCount: 5,
    commentCount: 1,
    createdAt: hoursAgo(3),
    likedByMe: false,
    comments: [
      {
        id: 'c1',
        authorId: 'mock-gustavo',
        authorName: 'Gustavo Domínguez',
        text: 'Yo me apunto.',
        createdAt: hoursAgo(2),
      },
    ],
  },
];
