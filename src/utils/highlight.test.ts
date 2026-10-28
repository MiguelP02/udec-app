import { tokenize } from './highlight';

describe('tokenize', () => {
  it('clasifica comentarios, textos, números y palabras clave', () => {
    const tokens = tokenize('final x = 42; // nota\nprint("hola");');
    expect(tokens.find((t) => t.text === 'final')?.kind).toBe('keyword');
    expect(tokens.find((t) => t.text === '42')?.kind).toBe('number');
    expect(tokens.find((t) => t.text === '// nota')?.kind).toBe('comment');
    expect(tokens.find((t) => t.text === '"hola"')?.kind).toBe('string');
  });

  it('respeta comillas escapadas', () => {
    const tokens = tokenize('x = "a\\"b"');
    expect(tokens.find((t) => t.kind === 'string')?.text).toBe('"a\\"b"');
  });

  it('al unir los fragmentos obtiene el código original', () => {
    const code = 'SELECT l.titulo\nFROM libros l -- nota\nWHERE x = 3;';
    expect(tokenize(code).map((t) => t.text).join('')).toBe(code);
  });
});
