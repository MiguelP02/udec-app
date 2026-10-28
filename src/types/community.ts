import type { DataColor } from '../theme';

export type { DataColor };

export const POST_TAGS = ['#Eventos', '#Semilleros', '#Deportes', '#Ventas', '#Perdidos'] as const;
export type PostTag = (typeof POST_TAGS)[number];

export const FILTERS = ['Todo', ...POST_TAGS] as const;
export type PostFilter = (typeof FILTERS)[number];

export type EventBannerData = {
  title: string;
  subtitle: string;
  day: string; // '29'
  month: string; // 'OCT'
  color: DataColor;
};

export type PostComment = {
  id: string;
  authorId: string;
  authorName: string;
  text: string;
  createdAt: Date;
};

export type Post = {
  id: string;
  authorId: string;
  authorName: string;
  initials: string;
  color: DataColor;
  official: boolean;
  tag: PostTag;
  text: string;
  banner: EventBannerData | null;
  likeCount: number;
  commentCount: number;
  createdAt: Date;
};

/** Lo que dibuja la pantalla: el documento más el estado del usuario y los comentarios ya cargados. */
export type PostView = Post & {
  likedByMe: boolean;
  comments: PostComment[];
};

export type ListStatus = 'loading' | 'error' | 'ready';
