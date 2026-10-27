import 'package:flutter/material.dart';

import '../app_state.dart';
import '../theme.dart';
import '../widgets.dart';
import 'question_detail_screen.dart';

class AskQuestionScreen extends StatefulWidget {
  const AskQuestionScreen({super.key});

  @override
  State<AskQuestionScreen> createState() => _AskQuestionScreenState();
}

class _AskQuestionScreenState extends State<AskQuestionScreen> {
  final _title = TextEditingController();
  final _body = TextEditingController();
  final _code = TextEditingController();
  String _lang = 'dart';

  @override
  void dispose() {
    _title.dispose();
    _body.dispose();
    _code.dispose();
    super.dispose();
  }

  void _publish() {
    if (_title.text.trim().isEmpty) {
      showToast(context, 'Escribe un título para tu pregunta');
      return;
    }
    final q = AppScope.read(context).askQuestion(
      title: _title.text.trim(),
      body: _body.text.trim(),
      code: _code.text,
      lang: _lang,
    );
    Navigator.of(context).pushReplacement(MaterialPageRoute(
      builder: (_) => QuestionDetailScreen(questionId: q.id),
    ));
    showToast(context, 'Pregunta publicada. Tus compañeros la verán en el foro');
  }

  Widget _label(String t) => Padding(
        padding: const EdgeInsets.only(top: 14, bottom: 6),
        child: Text(t, style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w700, color: UdecColors.muted)),
      );

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Nueva pregunta')),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(16, 4, 16, 24),
        children: [
          _label('Título'),
          TextField(
            controller: _title,
            decoration: const InputDecoration(hintText: 'Ej: ¿Cómo valido un formulario en Flutter?'),
          ),
          _label('Describe tu problema'),
          TextField(
            controller: _body,
            minLines: 3,
            maxLines: 6,
            decoration: const InputDecoration(hintText: '¿Qué intentaste y qué error te sale?'),
          ),
          _label('Código (opcional)'),
          TextField(
            controller: _code,
            minLines: 4,
            maxLines: 12,
            style: const TextStyle(fontFamily: 'monospace', fontFamilyFallback: ['Consolas', 'Courier New'], fontSize: 13),
            decoration: const InputDecoration(hintText: 'Pega aquí tu código'),
          ),
          _label('Lenguaje'),
          DropdownButtonFormField<String>(
            value: _lang,
            items: [
              for (final l in ['dart', 'java', 'python', 'sql', 'javascript'])
                DropdownMenuItem(value: l, child: Text(l)),
            ],
            onChanged: (v) => setState(() => _lang = v ?? _lang),
          ),
          const SizedBox(height: 20),
          FilledButton(
            onPressed: _publish,
            style: FilledButton.styleFrom(
              backgroundColor: UdecColors.yellow,
              foregroundColor: const Color(0xFF2A2000),
              padding: const EdgeInsets.symmetric(vertical: 14),
            ),
            child: const Text('Publicar pregunta', style: TextStyle(fontWeight: FontWeight.w700)),
          ),
        ],
      ),
    );
  }
}
