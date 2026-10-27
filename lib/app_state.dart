import 'dart:async';

import 'package:flutter/material.dart';

import 'models.dart';
import 'sample_data.dart';
import 'theme.dart';

/// Estado global de la app. En la versión con Firebase, estos métodos
/// leerían y escribirían en Firestore en lugar de listas en memoria.
class AppState extends ChangeNotifier {
  static const institutionalDomain = '@ucundinamarca.edu.co';
  static final _emailPattern = RegExp(r'^[^@\s]+@ucundinamarca\.edu\.co$');

  UserProfile? user;
  final List<Channel> channels = sampleChannels();
  final List<Post> posts = samplePosts();
  final List<Question> questions = sampleQuestions();
  final Set<String> typingIn = {};
  String? viewingChannel;

  String get me => user?.name ?? 'Yo';
  String get myInitials => user?.initials ?? 'YO';

  int get totalUnread => channels.fold(0, (sum, c) => sum + c.unread);

  Channel channel(String id) => channels.firstWhere((c) => c.id == id);
  Question question(int id) => questions.firstWhere((q) => q.id == id);

  static String clock() {
    final t = DateTime.now();
    final h = t.hour % 12 == 0 ? 12 : t.hour % 12;
    final m = t.minute.toString().padLeft(2, '0');
    return '$h:$m ${t.hour < 12 ? 'a. m.' : 'p. m.'}';
  }

  // ---------- Autenticación ----------
  String? login(String email, String password) {
    final e = email.trim().toLowerCase();
    if (!_emailPattern.hasMatch(e)) {
      return 'Usa tu correo institucional $institutionalDomain. Los correos personales no tienen acceso.';
    }
    if (password.isEmpty) return 'Escribe tu contraseña.';
    user = UserProfile(
      name: 'Miguel Páez',
      initials: 'MP',
      email: e,
      program: 'Ingeniería de Software · Grupo 104',
    );
    notifyListeners();
    return null;
  }

  void logout() {
    user = null;
    notifyListeners();
  }

  // ---------- Chats ----------
  void markRead(Channel c) {
    if (c.unread == 0) return;
    c.unread = 0;
    notifyListeners();
  }

  void sendMessage(Channel c, String text) {
    c.messages.add(Message(author: me, text: text, time: clock()));
    notifyListeners();
    if (c.replies.isEmpty) return;

    // Simula que un compañero responde (en Firebase llegaría por el stream).
    Timer(const Duration(milliseconds: 700), () {
      typingIn.add(c.id);
      notifyListeners();
    });
    Timer(const Duration(milliseconds: 2300), () {
      typingIn.remove(c.id);
      final reply = c.replies.removeAt(0);
      c.replies.add(reply);
      final classmates = c.messages
          .where((m) => !m.isDay && m.author != me && m.role == null)
          .map((m) => m.author)
          .toList();
      c.messages.add(Message(
        author: classmates.isNotEmpty ? classmates.last : 'Compañero',
        text: reply,
        time: clock(),
      ));
      if (viewingChannel != c.id) c.unread++;
      notifyListeners();
    });
  }

  void attachFile(Channel c) {
    c.files.add(ChatFile(
      name: 'Avance_prototipo.pdf',
      size: '1,1 MB',
      type: 'PDF',
      uploadedBy: me,
      color: UdecColors.red,
    ));
    c.messages.add(Message(author: me, fileIndex: c.files.length - 1, time: clock()));
    notifyListeners();
  }

  // ---------- Comunidad ----------
  void addPost(String text, String tag) {
    posts.insert(
      0,
      Post(
        id: DateTime.now().millisecondsSinceEpoch,
        author: me,
        initials: myInitials,
        color: UdecColors.green,
        tag: tag,
        time: 'Ahora',
        text: text,
      ),
    );
    notifyListeners();
  }

  void toggleLike(Post p) {
    p.liked = !p.liked;
    p.likes += p.liked ? 1 : -1;
    notifyListeners();
  }

  void addComment(Post p, String text) {
    p.comments.add(Comment(me, text));
    notifyListeners();
  }

  // ---------- Foro ----------
  Question askQuestion({
    required String title,
    required String body,
    required String code,
    required String lang,
  }) {
    final q = Question(
      id: DateTime.now().millisecondsSinceEpoch,
      title: title,
      tags: [lang],
      author: me,
      time: 'Ahora',
      body: body.isEmpty ? 'Sin descripción.' : body,
      code: code.trim().isEmpty ? null : code.trimRight(),
      lang: lang,
    );
    questions.insert(0, q);
    notifyListeners();

    Timer(const Duration(seconds: 4), () {
      q.answers.add(Answer(
        id: 1,
        author: 'Laura Gómez',
        votes: 1,
        text: '¡Buena pregunta! Revisa que la variable esté inicializada antes de usarla. '
            'Si me compartes el error completo te ayudo mejor.',
      ));
      notifyListeners();
    });
    return q;
  }

  void addAnswer(Question q, String text, String code) {
    q.answers.add(Answer(
      id: DateTime.now().millisecondsSinceEpoch,
      author: me,
      text: text,
      code: code.trim().isEmpty ? null : code.trimRight(),
      lang: q.lang,
    ));
    notifyListeners();
  }

  void toggleQuestionVote(Question q) {
    q.voted = !q.voted;
    q.votes += q.voted ? 1 : -1;
    notifyListeners();
  }

  void toggleAnswerVote(Answer a) {
    a.voted = !a.voted;
    a.votes += a.voted ? 1 : -1;
    notifyListeners();
  }

  void markSolution(Question q, Answer a) {
    for (final x in q.answers) {
      x.solution = identical(x, a);
    }
    notifyListeners();
  }
}

/// Pone el [AppState] a disposición de toda la app sin paquetes externos.
class AppScope extends InheritedNotifier<AppState> {
  const AppScope({super.key, required super.notifier, required super.child});

  /// Lee el estado y reconstruye el widget cuando cambia.
  static AppState of(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<AppScope>()!.notifier!;

  /// Lee el estado sin suscribirse (para usar en eventos como onPressed).
  static AppState read(BuildContext context) =>
      context.getInheritedWidgetOfExactType<AppScope>()!.notifier!;
}
