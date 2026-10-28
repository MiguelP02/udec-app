import { withDaySeparators } from './day-separators';

const now = new Date(2026, 9, 27, 12, 0);
const msg = (key: string, createdAt: Date) => ({ key, createdAt });

describe('withDaySeparators', () => {
  it('pone el separador de cada día después del último mensaje de ese día', () => {
    const items = withDaySeparators(
      [
        msg('a', new Date(2026, 9, 27, 10, 0)),
        msg('b', new Date(2026, 9, 27, 9, 0)),
        msg('c', new Date(2026, 9, 26, 18, 0)),
      ],
      now,
    );
    expect(items.map((i) => (i.kind === 'day' ? `día:${i.label}` : i.message.key))).toEqual([
      'a',
      'b',
      'día:Hoy',
      'c',
      'día:Ayer',
    ]);
  });

  it('devuelve lista vacía si no hay mensajes', () => {
    expect(withDaySeparators([], now)).toEqual([]);
  });
});
