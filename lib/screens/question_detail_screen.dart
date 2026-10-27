import 'package:flutter/material.dart';

import '../app_state.dart';
import '../code_block.dart';
import '../models.dart';
import '../theme.dart';
import '../widgets.dart';
import 'forum_screen.dart';

class QuestionDetailScreen extends StatefulWidget {
  final int questionId;
  const QuestionDetailScreen({super.key, required this.questionId});

  @override
  State<QuestionDetailScreen> createState() => _QuestionDetailScreenState();
}

class _QuestionDetailScreenState extends State<QuestionDetailScreen> {
  final _answer = TextEditingController();
  final _code = TextEditingController();

  @override
  void dispose() {
    _answer.dispose();
    _code.dispose();
    super.dispose();
  }

  void _reply(Question q) {
    final t = _answer.text.trim();
    if (t.isEmpty) return;
    AppScope.read(context).addAnswer(q, t, _code.text);
    _answer.clear();
    _code.clear();
    FocusScope.of(context).unfocus();
    showToast(context, 'Respuesta publicada');
  }

  @override
  Widget build(BuildContext context) {
    final app = AppScope.of(context);
    final q = app.question(widget.questionId);
    final answers = [...q.answers]
      ..sort((a, b) {
        if (a.solution != b.solution) return a.solution ? -1 : 1;
        return b.votes.compareTo(a.votes);
      });

    return Scaffold(
      appBar: AppBar(title: Text('Foro técnico · ${q.answers.length} respuestas', style: const TextStyle(fontSize: 18))),
      body: ListView(
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(q.title, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800, height: 1.2)),
                const SizedBox(height: 8),
                TagRow(tags: q.tags),
                const SizedBox(height: 10),
                Text(q.body, style: const TextStyle(height: 1.5, fontSize: 14.5)),
                if (q.code != null) CodeBlock(code: q.code!, lang: q.lang),
                Row(
                  children: [
                    Expanded(
                      child: Text('${q.author} · ${q.time}',
                          style: const TextStyle(fontSize: 12.5, color: UdecColors.muted)),
                    ),
                    _VoteButton(
                      votes: q.votes,
                      voted: q.voted,
                      onPressed: () => app.toggleQuestionVote(q),
                      showCount: true,
                    ),
                  ],
                ),
              ],
            ),
          ),
          for (final a in answers)
            _AnswerTile(
              answer: a,
              canMarkSolution: q.author == app.me && !a.solution,
              onVote: () => app.toggleAnswerVote(a),
              onMarkSolution: () {
                app.markSolution(q, a);
                showToast(context, 'Marcaste la respuesta como solución');
              },
            ),
          if (q.answers.isEmpty)
            const Padding(
              padding: EdgeInsets.all(20),
              child: Text('Nadie ha respondido todavía. ¡Sé el primero en ayudar!',
                  textAlign: TextAlign.center, style: TextStyle(color: UdecColors.muted)),
            ),
          Container(
            padding: const EdgeInsets.fromLTRB(16, 14, 16, 24),
            decoration: const BoxDecoration(border: Border(top: BorderSide(color: UdecColors.line))),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const Text('Tu respuesta',
                    style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.w700, color: UdecColors.muted)),
                const SizedBox(height: 6),
                TextField(
                  controller: _answer,
                  minLines: 2,
                  maxLines: 5,
                  decoration: const InputDecoration(hintText: 'Explica la solución'),
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: _code,
                  minLines: 2,
                  maxLines: 8,
                  style: const TextStyle(fontFamily: 'monospace', fontFamilyFallback: ['Consolas', 'Courier New'], fontSize: 13),
                  decoration: const InputDecoration(hintText: 'Código corregido (opcional)'),
                ),
                const SizedBox(height: 10),
                FilledButton(onPressed: () => _reply(q), child: const Text('Responder')),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _AnswerTile extends StatelessWidget {
  final Answer answer;
  final bool canMarkSolution;
  final VoidCallback onVote;
  final VoidCallback onMarkSolution;

  const _AnswerTile({
    required this.answer,
    required this.canMarkSolution,
    required this.onVote,
    required this.onMarkSolution,
  });

  @override
  Widget build(BuildContext context) {
    final a = answer;
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: a.solution ? UdecColors.greenSoft : null,
        border: const Border(top: BorderSide(color: UdecColors.line)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Column(
            children: [
              _VoteButton(votes: a.votes, voted: a.voted, onPressed: onVote),
              const SizedBox(height: 4),
              Text('${a.votes}', style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 16)),
            ],
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (a.solution)
                  const Padding(
                    padding: EdgeInsets.only(bottom: 4),
                    child: Row(
                      children: [
                        Icon(Icons.check_circle, size: 16, color: UdecColors.greenDark),
                        SizedBox(width: 4),
                        Text('Solución aceptada',
                            style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: UdecColors.greenDark)),
                      ],
                    ),
                  ),
                Text(a.text, style: const TextStyle(height: 1.45, fontSize: 14.5)),
                if (a.code != null) CodeBlock(code: a.code!, lang: a.lang),
                Row(
                  children: [
                    Expanded(child: Text(a.author, style: const TextStyle(fontSize: 12.5, color: UdecColors.muted))),
                    if (canMarkSolution)
                      TextButton(onPressed: onMarkSolution, child: const Text('Marcar como solución')),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _VoteButton extends StatelessWidget {
  final int votes;
  final bool voted;
  final VoidCallback onPressed;
  final bool showCount;

  const _VoteButton({required this.votes, required this.voted, required this.onPressed, this.showCount = false});

  @override
  Widget build(BuildContext context) {
    return OutlinedButton(
      onPressed: onPressed,
      style: OutlinedButton.styleFrom(
        minimumSize: const Size(36, 32),
        padding: const EdgeInsets.symmetric(horizontal: 8),
        backgroundColor: voted ? UdecColors.green : null,
        foregroundColor: voted ? Colors.white : UdecColors.muted,
        side: BorderSide(color: voted ? UdecColors.green : UdecColors.line),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.keyboard_arrow_up, size: 20),
          if (showCount) Text('$votes'),
        ],
      ),
    );
  }
}
