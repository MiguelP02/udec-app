import 'package:flutter/material.dart';

import '../app_state.dart';
import '../models.dart';
import '../theme.dart';
import '../widgets.dart';
import 'ask_question_screen.dart';
import 'question_detail_screen.dart';

class ForumScreen extends StatelessWidget {
  const ForumScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final app = AppScope.of(context);
    return Scaffold(
      appBar: udecAppBar('Foro técnico', 'Preguntas de programación entre compañeros'),
      floatingActionButton: FloatingActionButton(
        tooltip: 'Hacer una pregunta',
        backgroundColor: UdecColors.yellow,
        foregroundColor: const Color(0xFF2A2000),
        onPressed: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => const AskQuestionScreen())),
        child: const Icon(Icons.add, size: 28),
      ),
      body: ListView.separated(
        padding: const EdgeInsets.only(bottom: 90),
        itemCount: app.questions.length,
        separatorBuilder: (_, __) => const Divider(height: 1, color: UdecColors.line),
        itemBuilder: (context, i) => _QuestionTile(question: app.questions[i]),
      ),
    );
  }
}

class _QuestionTile extends StatelessWidget {
  final Question question;
  const _QuestionTile({required this.question});

  @override
  Widget build(BuildContext context) {
    final q = question;
    return InkWell(
      onTap: () => Navigator.of(context).push(MaterialPageRoute(
        builder: (_) => QuestionDetailScreen(questionId: q.id),
      )),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SizedBox(
              width: 56,
              child: Column(
                children: [
                  Text('${q.votes}', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800)),
                  const Text('votos', style: TextStyle(fontSize: 11, color: UdecColors.muted)),
                  const SizedBox(height: 6),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 3),
                    decoration: BoxDecoration(
                      color: q.solved ? UdecColors.green : null,
                      border: Border.all(color: q.solved ? UdecColors.green : UdecColors.line),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      '${q.solved ? '✓ ' : ''}${q.answers.length} resp.',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                        color: q.solved ? Colors.white : UdecColors.muted,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(q.title, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700, height: 1.3)),
                  const SizedBox(height: 6),
                  TagRow(tags: q.tags),
                  const SizedBox(height: 6),
                  Text('${q.author} · ${q.time}', style: const TextStyle(fontSize: 12, color: UdecColors.muted)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class TagRow extends StatelessWidget {
  final List<String> tags;
  const TagRow({super.key, required this.tags});

  @override
  Widget build(BuildContext context) => Wrap(
        spacing: 6,
        runSpacing: 6,
        children: [
          for (final t in tags)
            Pill(t, background: UdecColors.blueSoft, foreground: UdecColors.blue),
        ],
      );
}
