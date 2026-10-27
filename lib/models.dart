import 'package:flutter/material.dart';

class UserProfile {
  final String name;
  final String initials;
  final String email;
  final String program;

  const UserProfile({
    required this.name,
    required this.initials,
    required this.email,
    required this.program,
  });
}

class ChatFile {
  final String name;
  final String size;
  final String type;
  final String uploadedBy;
  final Color color;

  const ChatFile({
    required this.name,
    required this.size,
    required this.type,
    required this.uploadedBy,
    required this.color,
  });
}

class Message {
  final String author;
  final String? role; // Docente, Oficial o null para estudiantes
  final String text;
  final String time;
  final int? fileIndex;
  final String? day; // si tiene valor, es un separador de fecha

  const Message({
    this.author = '',
    this.role,
    this.text = '',
    this.time = '',
    this.fileIndex,
  }) : day = null;

  const Message.separator(String label)
      : day = label,
        author = '',
        role = null,
        text = '',
        time = '',
        fileIndex = null;

  bool get isDay => day != null;
}

class Pinned {
  final String by;
  final String text;
  const Pinned(this.by, this.text);
}

class Channel {
  final String id;
  final String name;
  final String short;
  final Color color;
  final String kind; // Materia, Grupo, Oficial
  final String members;
  final bool readOnly;
  final Pinned? pinned;
  final List<ChatFile> files;
  final List<Message> messages;
  final List<String> replies;
  int unread;

  Channel({
    required this.id,
    required this.name,
    required this.short,
    required this.color,
    required this.kind,
    required this.members,
    this.readOnly = false,
    this.pinned,
    required this.files,
    required this.messages,
    required this.replies,
    this.unread = 0,
  });

  Message? get lastMessage {
    for (final m in messages.reversed) {
      if (!m.isDay) return m;
    }
    return null;
  }
}

class Comment {
  final String author;
  final String text;
  const Comment(this.author, this.text);
}

class EventBanner {
  final String title;
  final String subtitle;
  final String day;
  final String month;
  final Color color;

  const EventBanner({
    required this.title,
    required this.subtitle,
    required this.day,
    required this.month,
    required this.color,
  });
}

class Post {
  final int id;
  final String author;
  final String initials;
  final Color color;
  final bool official;
  final String tag;
  final String time;
  final String text;
  final EventBanner? banner;
  final List<Comment> comments;
  int likes;
  bool liked;

  Post({
    required this.id,
    required this.author,
    required this.initials,
    required this.color,
    this.official = false,
    required this.tag,
    required this.time,
    required this.text,
    this.banner,
    List<Comment>? comments,
    this.likes = 0,
    this.liked = false,
  }) : comments = comments ?? [];
}

class Answer {
  final int id;
  final String author;
  final String text;
  final String? code;
  final String lang;
  int votes;
  bool voted;
  bool solution;

  Answer({
    required this.id,
    required this.author,
    required this.text,
    this.code,
    this.lang = '',
    this.votes = 0,
    this.voted = false,
    this.solution = false,
  });
}

class Question {
  final int id;
  final String title;
  final List<String> tags;
  final String author;
  final String time;
  final String body;
  final String? code;
  final String lang;
  final List<Answer> answers;
  int votes;
  bool voted;

  Question({
    required this.id,
    required this.title,
    required this.tags,
    required this.author,
    required this.time,
    required this.body,
    this.code,
    required this.lang,
    List<Answer>? answers,
    this.votes = 0,
    this.voted = false,
  }) : answers = answers ?? [];

  bool get solved => answers.any((a) => a.solution);
}
