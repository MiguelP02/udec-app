import type { DataColor } from '../theme';

/** Tipo de canal: Materia (grupo de una materia), Grupo (de trabajo) u Oficial (solo lectura). */
export type ChannelKind = 'Materia' | 'Grupo' | 'Oficial';

/** Rol del autor de un mensaje. Solo docente y oficial muestran pastilla. */
export type AuthorRole = 'estudiante' | 'docente' | 'oficial';

/** Colores válidos para la insignia de un archivo. */
export type FileColor = 'red' | 'blue' | 'green' | 'purple' | 'rust';

/** Archivo de un canal (modelo `files` del plan). En los datos de ejemplo, url y campos de Cloudinary son null. */
export type ChatFile = {
  id: string;
  name: string;
  size: string;
  /** 'pdf' | 'doc' | 'img' | 'sql' | otros. */
  type: string;
  color: FileColor;
  url: string | null;
  publicId: string | null;
  resourceType: string | null;
  uploadedBy: string;
  uploadedById: string;
  createdAt: Date;
};

/** Canal tal como aparece en la lista de Chats. */
export type Channel = {
  id: string;
  name: string;
  short: string;
  color: DataColor;
  kind: ChannelKind;
  memberCount: number;
  readOnly: boolean;
  /** Canal fijado arriba en la lista de Chats. */
  pinned: boolean;
  /** authorName '' = sin autor en la vista previa (canal oficial). */
  lastMessage: { authorName: string; text: string } | null;
  lastMessageAt: Date;
};

/** Canal con su contador de no leídos (vendrá de use-unread-counts en la Fase 5). */
export type ChannelItem = Channel & { unread: number };

/** Datos del canal que muestra el detalle. `pinned` es el aviso fijado del chat (distinto del fijado de la lista). */
export type ChannelInfo = {
  id: string;
  name: string;
  short: string;
  color: DataColor;
  kind: ChannelKind;
  memberCount: number;
  readOnly: boolean;
  pinned: { by: string; text: string } | null;
};

/** Mensaje de un canal. La lista de mensajes del detalle va del más nuevo al más viejo. */
export type Message = {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: AuthorRole;
  text: string;
  file: ChatFile | null;
  createdAt: Date;
};
