import 'package:flutter/material.dart';

import 'theme.dart';

/// Muestra código con resaltado de sintaxis sencillo (palabras clave,
/// textos, números y comentarios) para Dart, Java, SQL, Python y JavaScript.
class CodeBlock extends StatelessWidget {
  final String code;
  final String lang;
  const CodeBlock({super.key, required this.code, required this.lang});

  static const _keywords = {
    'class', 'final', 'var', 'void', 'return', 'if', 'else', 'for', 'while', 'new',
    'const', 'async', 'await', 'import', 'public', 'private', 'static', 'int',
    'String', 'function', 'let', 'def', 'print', 'true', 'false', 'null',
    'extends', 'this', 'context', 'SELECT', 'FROM', 'JOIN', 'INNER', 'LEFT', 'ON',
    'WHERE', 'AS', 'ORDER', 'BY',
  };

  static final _token = RegExp(
    r'''(//.*$|--.*$|#.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|\b(\d+)\b|\b([A-Za-z_]\w*)\b''',
    multiLine: true,
  );

  static const _base = TextStyle(
    fontFamily: 'monospace',
    fontFamilyFallback: ['Consolas', 'Menlo', 'Courier New'],
    fontSize: 12.5,
    height: 1.5,
    color: Color(0xFFDBE8DF),
  );
  static const _kw = TextStyle(color: UdecColors.yellow, fontWeight: FontWeight.w600);
  static const _str = TextStyle(color: Color(0xFF7FD3A0));
  static const _num = TextStyle(color: Color(0xFF8FB6FF));
  static const _comment = TextStyle(color: Color(0xFF7F9A8A), fontStyle: FontStyle.italic);

  List<TextSpan> _highlight() {
    final spans = <TextSpan>[];
    var last = 0;
    for (final m in _token.allMatches(code)) {
      if (m.start > last) spans.add(TextSpan(text: code.substring(last, m.start)));
      final text = m.group(0)!;
      TextStyle? style;
      if (m.group(1) != null) {
        style = _comment;
      } else if (m.group(2) != null) {
        style = _str;
      } else if (m.group(3) != null) {
        style = _num;
      } else if (_keywords.contains(m.group(4))) {
        style = _kw;
      }
      spans.add(TextSpan(text: text, style: style));
      last = m.end;
    }
    if (last < code.length) spans.add(TextSpan(text: code.substring(last)));
    return spans;
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.symmetric(vertical: 10),
      decoration: BoxDecoration(color: UdecColors.codeBg, borderRadius: BorderRadius.circular(12)),
      child: Stack(
        children: [
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.fromLTRB(14, 14, 14, 12),
            child: Text.rich(TextSpan(style: _base, children: _highlight())),
          ),
          Positioned(
            top: 6,
            right: 10,
            child: Text(
              lang.toUpperCase(),
              style: const TextStyle(color: Color(0xFF7F9A8A), fontSize: 10, letterSpacing: 1),
            ),
          ),
        ],
      ),
    );
  }
}
