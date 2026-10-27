import 'package:flutter_test/flutter_test.dart';

import 'package:udec_app/main.dart';

void main() {
  testWidgets('Muestra la pantalla de inicio de sesión', (tester) async {
    await tester.pumpWidget(const UdecApp());
    expect(find.text('UDEC APP'), findsOneWidget);
    expect(find.text('Iniciar sesión'), findsOneWidget);
  });
}
