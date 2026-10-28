import { initialsFor } from './initials';

describe('initialsFor', () => {
  it('toma la inicial de las dos primeras palabras', () => {
    expect(initialsFor('Miguel Páez')).toBe('MP');
    expect(initialsFor('Laura Gómez Ruiz')).toBe('LG');
  });

  it('usa una sola letra si el nombre tiene una palabra', () => {
    expect(initialsFor('Laura')).toBe('L');
  });

  it('devuelve YO si el nombre está vacío', () => {
    expect(initialsFor('   ')).toBe('YO');
  });
});
