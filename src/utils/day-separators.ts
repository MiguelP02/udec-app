import { dayKey, dayLabel, isSameDay } from './time';

export type ChatItem<T> =
  | { kind: 'message'; key: string; message: T }
  | { kind: 'day'; key: string; label: string };

/**
 * Recibe los mensajes del más nuevo al más viejo y devuelve los elementos de la lista invertida.
 * El separador de día va después (en orden de lista) del último mensaje de ese día,
 * así que en pantalla queda encima de los mensajes de su día.
 */
export function withDaySeparators<T extends { key: string; createdAt: Date }>(
  messagesDesc: T[],
  now: Date,
): ChatItem<T>[] {
  const items: ChatItem<T>[] = [];
  messagesDesc.forEach((message, index) => {
    items.push({ kind: 'message', key: message.key, message });
    const next = messagesDesc[index + 1];
    if (!next || !isSameDay(message.createdAt, next.createdAt)) {
      items.push({
        kind: 'day',
        key: `day-${dayKey(message.createdAt)}`,
        label: dayLabel(message.createdAt, now),
      });
    }
  });
  return items;
}
