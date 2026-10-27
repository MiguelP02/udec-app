import 'package:flutter/material.dart';

/// Colores institucionales tomados del póster de UDEC APP.
class UdecColors {
  static const green = Color(0xFF0B7A3F);
  static const greenDark = Color(0xFF075A2E);
  static const greenSoft = Color(0xFFDFF1E6);
  static const yellow = Color(0xFFF3B414);
  static const yellowSoft = Color(0xFFFFF3CF);
  static const yellowInk = Color(0xFF7A5600);
  static const blue = Color(0xFF163F80);
  static const blueSoft = Color(0xFFE2EAF7);
  static const purple = Color(0xFF6B4FA8);
  static const rust = Color(0xFFB8572F);
  static const red = Color(0xFFC0392B);
  static const stage = Color(0xFFE3ECE6);
  static const surface2 = Color(0xFFF2F6F3);
  static const line = Color(0xFFDBE5DE);
  static const text = Color(0xFF13231A);
  static const muted = Color(0xFF5D7166);
  static const codeBg = Color(0xFF14211A);
}

ThemeData buildUdecTheme() {
  final scheme = ColorScheme.fromSeed(
    seedColor: UdecColors.green,
    primary: UdecColors.green,
    secondary: UdecColors.yellow,
    surface: Colors.white,
  );
  return ThemeData(
    useMaterial3: true,
    colorScheme: scheme,
    scaffoldBackgroundColor: Colors.white,
    appBarTheme: const AppBarTheme(
      backgroundColor: UdecColors.green,
      foregroundColor: Colors.white,
      elevation: 0,
      scrolledUnderElevation: 0,
      titleTextStyle: TextStyle(
        color: Colors.white,
        fontSize: 20,
        fontWeight: FontWeight.w800,
      ),
    ),
    navigationBarTheme: const NavigationBarThemeData(
      backgroundColor: Colors.white,
      indicatorColor: UdecColors.yellowSoft,
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: UdecColors.surface2,
      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: UdecColors.line),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: UdecColors.line),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: UdecColors.green, width: 1.5),
      ),
    ),
  );
}
