import 'package:flutter/material.dart';

import 'theme.dart';

/// Logo "U" amarillo de UDEC APP.
class LogoMark extends StatelessWidget {
  final double size;
  const LogoMark({super.key, this.size = 34});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      alignment: Alignment.center,
      decoration: BoxDecoration(
        color: UdecColors.yellow,
        borderRadius: BorderRadius.circular(size * 0.3),
      ),
      child: Text(
        'U',
        style: TextStyle(
          color: const Color(0xFF0B3A1F),
          fontWeight: FontWeight.w900,
          fontSize: size * 0.58,
        ),
      ),
    );
  }
}

/// Avatar cuadrado redondeado con iniciales.
class InitialsAvatar extends StatelessWidget {
  final String text;
  final Color color;
  final double size;
  const InitialsAvatar({super.key, required this.text, required this.color, this.size = 46});

  @override
  Widget build(BuildContext context) {
    final darkText = color == UdecColors.yellow;
    return Container(
      width: size,
      height: size,
      alignment: Alignment.center,
      decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(size * 0.3)),
      child: Text(
        text,
        style: TextStyle(
          color: darkText ? const Color(0xFF2A2000) : Colors.white,
          fontWeight: FontWeight.w700,
          fontSize: size * 0.33,
        ),
      ),
    );
  }
}

/// Etiqueta pequeña de color (Materia, Oficial, #Eventos...).
class Pill extends StatelessWidget {
  final String label;
  final Color background;
  final Color foreground;
  const Pill(this.label, {super.key, required this.background, required this.foreground});

  factory Pill.kind(String kind) {
    switch (kind) {
      case 'Oficial':
        return Pill(kind, background: UdecColors.blueSoft, foreground: UdecColors.blue);
      case 'Grupo':
      case 'Docente':
        return Pill(kind, background: UdecColors.yellowSoft, foreground: UdecColors.yellowInk);
      default:
        return Pill(kind, background: UdecColors.greenSoft, foreground: UdecColors.greenDark);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
      decoration: BoxDecoration(color: background, borderRadius: BorderRadius.circular(6)),
      child: Text(
        label,
        style: TextStyle(color: foreground, fontSize: 11, fontWeight: FontWeight.w700),
      ),
    );
  }
}

/// Ícono de archivo con el tipo (PDF, DOC, IMG...).
class FileBadge extends StatelessWidget {
  final String type;
  final Color color;
  final double width;
  const FileBadge({super.key, required this.type, required this.color, this.width = 40});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: width,
      height: width * 1.1,
      alignment: Alignment.center,
      decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(8)),
      child: Text(
        type,
        style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.w800),
      ),
    );
  }
}

/// Encabezado verde con el logo, usado en las pestañas principales.
PreferredSizeWidget udecAppBar(String title, String subtitle) {
  return AppBar(
    toolbarHeight: 64,
    titleSpacing: 16,
    title: Row(
      children: [
        const LogoMark(),
        const SizedBox(width: 10),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(title, overflow: TextOverflow.ellipsis),
              Text(
                subtitle,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: Color(0xDDFFFFFF)),
              ),
            ],
          ),
        ),
      ],
    ),
  );
}

void showToast(BuildContext context, String text) {
  ScaffoldMessenger.of(context)
    ..hideCurrentSnackBar()
    ..showSnackBar(SnackBar(
      content: Text(text),
      behavior: SnackBarBehavior.floating,
      duration: const Duration(seconds: 2),
    ));
}
