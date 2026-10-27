import 'package:flutter/material.dart';

import '../app_state.dart';
import '../theme.dart';
import '../widgets.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _email = TextEditingController(text: 'mpaez@ucundinamarca.edu.co');
  final _password = TextEditingController(text: 'udec2026');
  String? _error;

  @override
  void dispose() {
    _email.dispose();
    _password.dispose();
    super.dispose();
  }

  void _submit() {
    final error = AppScope.read(context).login(_email.text, _password.text);
    setState(() => _error = error);
  }

  Widget _circle(double size, Color color) => Container(
        width: size,
        height: size,
        decoration: BoxDecoration(color: color, shape: BoxShape.circle),
      );

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: ListView(
        padding: EdgeInsets.zero,
        children: [
          Container(
            height: 280,
            color: UdecColors.green,
            child: Stack(
              clipBehavior: Clip.hardEdge,
              children: [
                Positioned(right: -60, bottom: -80, child: _circle(220, UdecColors.yellow)),
                Positioned(right: 60, bottom: -110, child: _circle(160, UdecColors.blue)),
                SafeArea(
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(24, 32, 24, 24),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Row(
                          children: [
                            LogoMark(size: 52),
                            SizedBox(width: 12),
                            Expanded(
                              child: Text(
                                'Universidad de Cundinamarca',
                                style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 22),
                        const Text(
                          'UDEC APP',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 38,
                            fontWeight: FontWeight.w900,
                            letterSpacing: -0.5,
                          ),
                        ),
                        const SizedBox(height: 6),
                        SizedBox(
                          width: 220,
                          child: Text(
                            'Comunica, colabora y crece con tu comunidad UdeC.',
                            style: TextStyle(color: Colors.white.withAlpha(235), height: 1.4),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(24, 26, 24, 24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                TextField(
                  controller: _email,
                  keyboardType: TextInputType.emailAddress,
                  decoration: const InputDecoration(labelText: 'Correo institucional'),
                ),
                const SizedBox(height: 14),
                TextField(
                  controller: _password,
                  obscureText: true,
                  onSubmitted: (_) => _submit(),
                  decoration: const InputDecoration(labelText: 'Contraseña'),
                ),
                const SizedBox(height: 10),
                SizedBox(
                  height: 40,
                  child: _error == null
                      ? null
                      : Text(
                          _error!,
                          style: const TextStyle(color: UdecColors.red, fontWeight: FontWeight.w600, fontSize: 13),
                        ),
                ),
                FilledButton(
                  onPressed: _submit,
                  style: FilledButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 15),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                  child: const Text('Iniciar sesión', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
                ),
                const SizedBox(height: 16),
                const Text(
                  'Solo pueden ingresar estudiantes, docentes y administrativos con correo @ucundinamarca.edu.co.',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: UdecColors.muted, fontSize: 12.5, height: 1.4),
                ),
                TextButton(
                  onPressed: () => setState(() {
                    _email.text = 'miguel.paez@gmail.com';
                    _error = null;
                  }),
                  child: const Text('Probar con un correo personal'),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
