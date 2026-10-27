import 'package:flutter/material.dart';

import '../app_state.dart';
import '../theme.dart';
import '../widgets.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final app = AppScope.of(context);
    final user = app.user;
    if (user == null) return const SizedBox.shrink();

    final myPosts = app.posts.where((p) => p.author == app.me).length;
    final myQuestions = app.questions.where((q) => q.author == app.me).length;
    final myAnswers = app.questions.fold<int>(0, (n, q) => n + q.answers.where((a) => a.author == app.me).length);

    Widget stat(int n, String label) => Expanded(
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 12),
            child: Column(
              children: [
                Text('$n', style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800)),
                Text(label, style: const TextStyle(fontSize: 12, color: UdecColors.muted)),
              ],
            ),
          ),
        );

    Widget option(String title, String value, String message) => ListTile(
          title: Text(title, style: const TextStyle(fontWeight: FontWeight.w600)),
          trailing: Text(value, style: const TextStyle(color: UdecColors.muted)),
          onTap: () => showToast(context, message),
        );

    BoxDecoration box() => BoxDecoration(
          border: Border.all(color: UdecColors.line),
          borderRadius: BorderRadius.circular(16),
        );

    return Scaffold(
      appBar: udecAppBar('Mi perfil', 'Cuenta institucional'),
      body: ListView(
        padding: const EdgeInsets.only(bottom: 24),
        children: [
          const SizedBox(height: 24),
          Center(child: InitialsAvatar(text: user.initials, color: UdecColors.green, size: 84)),
          const SizedBox(height: 10),
          Text(user.name, textAlign: TextAlign.center, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800)),
          Text(user.program, textAlign: TextAlign.center, style: const TextStyle(color: UdecColors.muted)),
          Text(user.email, textAlign: TextAlign.center, style: const TextStyle(color: UdecColors.muted)),
          const SizedBox(height: 8),
          Center(child: Pill('Estudiante verificado', background: UdecColors.greenSoft, foreground: UdecColors.greenDark)),
          const SizedBox(height: 16),
          Container(
            margin: const EdgeInsets.symmetric(horizontal: 16),
            decoration: box(),
            child: Row(
              children: [
                stat(myPosts, 'Publicaciones'),
                Container(width: 1, height: 40, color: UdecColors.line),
                stat(myQuestions, 'Preguntas'),
                Container(width: 1, height: 40, color: UdecColors.line),
                stat(myAnswers, 'Respuestas'),
              ],
            ),
          ),
          Container(
            margin: const EdgeInsets.fromLTRB(16, 12, 16, 0),
            decoration: box(),
            clipBehavior: Clip.antiAlias,
            child: Column(
              children: [
                option('Notificaciones', 'Inteligentes', 'Solo menciones y avisos oficiales'),
                const Divider(height: 1, color: UdecColors.line),
                option('Privacidad', 'Solo UdeC', 'Tu perfil solo es visible para la comunidad UdeC'),
                const Divider(height: 1, color: UdecColors.line),
                option('Sede', 'Fusagasugá', 'Sede Fusagasugá · Facultad de Ingeniería'),
              ],
            ),
          ),
          Container(
            margin: const EdgeInsets.fromLTRB(16, 12, 16, 0),
            decoration: box(),
            clipBehavior: Clip.antiAlias,
            child: ListTile(
              title: const Text('Cerrar sesión', style: TextStyle(color: UdecColors.red, fontWeight: FontWeight.w600)),
              onTap: app.logout,
            ),
          ),
        ],
      ),
    );
  }
}
