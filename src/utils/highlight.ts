export type TokenKind = 'plain' | 'comment' | 'string' | 'number' | 'keyword';

export type Token = { text: string; kind: TokenKind };

// Mismas palabras clave y patrón que code_block.dart de la versión Flutter.
const KEYWORDS = new Set([
  'class', 'final', 'var', 'void', 'return', 'if', 'else', 'for', 'while', 'new',
  'const', 'async', 'await', 'import', 'public', 'private', 'static', 'int',
  'String', 'function', 'let', 'def', 'print', 'true', 'false', 'null',
  'extends', 'this', 'context', 'SELECT', 'FROM', 'JOIN', 'INNER', 'LEFT', 'ON',
  'WHERE', 'AS', 'ORDER', 'BY',
]);

const TOKEN = /(\/\/.*$|--.*$|#.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|\b(\d+)\b|\b([A-Za-z_]\w*)\b/gm;

/** Divide el código en fragmentos. Unir los `text` devuelve exactamente el código original. */
export function tokenize(code: string): Token[] {
  const tokens: Token[] = [];
  let last = 0;
  for (const match of code.matchAll(TOKEN)) {
    const start = match.index ?? 0;
    if (start > last) tokens.push({ text: code.slice(last, start), kind: 'plain' });
    const text = match[0];
    let kind: TokenKind = 'plain';
    if (match[1] !== undefined) kind = 'comment';
    else if (match[2] !== undefined) kind = 'string';
    else if (match[3] !== undefined) kind = 'number';
    else if (match[4] !== undefined && KEYWORDS.has(match[4])) kind = 'keyword';
    tokens.push({ text, kind });
    last = start + text.length;
  }
  if (last < code.length) tokens.push({ text: code.slice(last), kind: 'plain' });
  return tokens;
}
