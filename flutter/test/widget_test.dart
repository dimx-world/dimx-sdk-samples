import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:sample_app/main.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  // The plugin is a native module: its channel is answered here so the app
  // renders without a phone.
  const channel = MethodChannel('dimx_plugin');
  final calls = <String>[];
  setUp(() {
    TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger
        .setMockMethodCallHandler(channel, (MethodCall call) async {
      calls.add(call.method);
      return call.method == 'getPlatformVersion' ? 'test 1' : null;
    });
  });
  tearDown(() {
    TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger
        .setMockMethodCallHandler(channel, null);
    calls.clear();
  });

  testWidgets('the sample renders its buttons and initialises the SDK', (WidgetTester tester) async {
    await tester.pumpWidget(const SampleApp());
    await tester.pumpAndSettle();
    expect(find.text('Show AR screen'), findsOneWidget);
    expect(find.text('Show web screen'), findsOneWidget);
    expect(find.text('Running on: test 1'), findsOneWidget);
    expect(calls, contains('initializeDimxSdk'));
  });
}
