const MONTHS = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isYesterday(d: Date, now: Date): boolean {
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  return isSameDay(d, yesterday);
}

/** Hora en formato de 12 horas: "4:10 p. m.". Es el formato de la app Flutter. */
export function formatClock(d: Date): string {
  const h = d.getHours();
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hour12}:${minutes} ${h < 12 ? 'a. m.' : 'p. m.'}`;
}

/** Texto relativo para publicaciones y preguntas: "Ahora", "Hace 5 min", "Ayer", "25 de octubre". */
export function formatRelative(d: Date, now: Date): string {
  const diff = now.getTime() - d.getTime();
  if (diff < MINUTE) return 'Ahora';
  if (diff < HOUR) return `Hace ${Math.floor(diff / MINUTE)} min`;
  if (diff < 24 * HOUR) return `Hace ${Math.floor(diff / HOUR)} h`;
  if (isYesterday(d, now)) return 'Ayer';
  return `${d.getDate()} de ${MONTHS[d.getMonth()]}`;
}

/** Hora para la lista de chats: hoy la hora, ayer "Ayer", antes "dd/mm". */
export function formatListTime(d: Date, now: Date): string {
  if (isSameDay(d, now)) return formatClock(d);
  if (isYesterday(d, now)) return 'Ayer';
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}`;
}

export function dayLabel(d: Date, now: Date): string {
  if (isSameDay(d, now)) return 'Hoy';
  if (isYesterday(d, now)) return 'Ayer';
  return `${d.getDate()} de ${MONTHS[d.getMonth()]}`;
}

export function dayKey(d: Date): string {
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

export { isSameDay };
