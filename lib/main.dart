import 'package:flutter/material.dart';

import 'app_state.dart';
import 'screens/chats_screen.dart';
import 'screens/community_screen.dart';
import 'screens/forum_screen.dart';
import 'screens/login_screen.dart';
import 'screens/profile_screen.dart';
import 'theme.dart';

void main() => runApp(const UdecApp());

class UdecApp extends StatefulWidget {
  const UdecApp({super.key});

  @override
  State<UdecApp> createState() => _UdecAppState();
}

class _UdecAppState extends State<UdecApp> {
  final _state = AppState();

  @override
  void dispose() {
    _state.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AppScope(
      notifier: _state,
      child: MaterialApp(
        title: 'UDEC APP',
        debugShowCheckedModeBanner: false,
        theme: buildUdecTheme(),
        // En computador o proyector se ve con ancho de celular, centrada.
        builder: (context, child) => ColoredBox(
          color: UdecColors.stage,
          child: Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 430),
              child: ClipRect(child: child),
            ),
          ),
        ),
        home: const RootGate(),
      ),
    );
  }
}

/// Muestra el login o la app según si hay sesión iniciada.
class RootGate extends StatelessWidget {
  const RootGate({super.key});

  @override
  Widget build(BuildContext context) {
    final app = AppScope.of(context);
    return app.user == null ? const LoginScreen() : const HomeShell();
  }
}

class HomeShell extends StatefulWidget {
  const HomeShell({super.key});

  @override
  State<HomeShell> createState() => _HomeShellState();
}

class _HomeShellState extends State<HomeShell> {
  int _index = 0;

  @override
  Widget build(BuildContext context) {
    final unread = AppScope.of(context).totalUnread;
    return Scaffold(
      body: IndexedStack(
        index: _index,
        children: const [
          ChatsScreen(),
          CommunityScreen(),
          ForumScreen(),
          ProfileScreen(),
        ],
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _index,
        onDestinationSelected: (i) => setState(() => _index = i),
        destinations: [
          NavigationDestination(
            icon: Badge(
              isLabelVisible: unread > 0,
              label: Text('$unread'),
              backgroundColor: UdecColors.yellow,
              textColor: const Color(0xFF2A2000),
              child: const Icon(Icons.chat_bubble_outline),
            ),
            selectedIcon: const Icon(Icons.chat_bubble, color: UdecColors.green),
            label: 'Chats',
          ),
          const NavigationDestination(
            icon: Icon(Icons.groups_outlined),
            selectedIcon: Icon(Icons.groups, color: UdecColors.green),
            label: 'Comunidad',
          ),
          const NavigationDestination(
            icon: Icon(Icons.code),
            selectedIcon: Icon(Icons.code, color: UdecColors.green),
            label: 'Foro',
          ),
          const NavigationDestination(
            icon: Icon(Icons.person_outline),
            selectedIcon: Icon(Icons.person, color: UdecColors.green),
            label: 'Perfil',
          ),
        ],
      ),
    );
  }
}
