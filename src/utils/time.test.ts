import { dayLabel, formatClock, formatListTime, formatRelative } from './time';

const now = new Date(2026, 9, 27, 15, 0); // 27 oct 2026, 3:00 p. m.

describe('formatClock', () => {
  it('usa formato de 12 horas con a. m. y p. m.', () => {
    expect(formatClock(new Date(2026, 9, 27, 0, 5))).toBe('12:05 a. m.');
    expect(formatClock(new Date(2026, 9, 27, 13, 7))).toBe('1:07 p. m.');
    expect(formatClock(new Date(2026, 9, 27, 11, 48))).toBe('11:48 a. m.');
  });
});

describe('formatRelative', () => {
  it('describe el tiempo transcurrido', () => {
    expect(formatRelative(new Date(now.getTime() - 10_000), now)).toBe('Ahora');
    expect(formatRelative(new Date(now.getTime() - 5 * 60_000), now)).toBe('Hace 5 min');
    expect(formatRelative(new Date(now.getTime() - 3 * 3_600_000), now)).toBe('Hace 3 h');
  });

  it('muestra horas si es menos de 24 h, aunque sea de ayer', () => {
    expect(formatRelative(new Date(2026, 9, 26, 22, 0), now)).toBe('Hace 17 h');
  });

  it('usa Ayer y la fecha larga para más de 24 h', () => {
    expect(formatRelative(new Date(2026, 9, 26, 8, 0), now)).toBe('Ayer');
    expect(formatRelative(new Date(2026, 9, 20, 9, 0), now)).toBe('20 de octubre');
  });
});

describe('formatListTime', () => {
  it('muestra la hora si es hoy, Ayer si es ayer y dd/mm en otro caso', () => {
    expect(formatListTime(new Date(2026, 9, 27, 11, 48), now)).toBe('11:48 a. m.');
    expect(formatListTime(new Date(2026, 9, 26, 18, 20), now)).toBe('Ayer');
    expect(formatListTime(new Date(2026, 9, 20, 9, 0), now)).toBe('20/10');
  });
});

describe('dayLabel', () => {
  it('etiqueta Hoy, Ayer o la fecha', () => {
    expect(dayLabel(new Date(2026, 9, 27, 8, 0), now)).toBe('Hoy');
    expect(dayLabel(new Date(2026, 9, 26, 8, 0), now)).toBe('Ayer');
    expect(dayLabel(new Date(2026, 9, 25, 8, 0), now)).toBe('25 de octubre');
  });
});
