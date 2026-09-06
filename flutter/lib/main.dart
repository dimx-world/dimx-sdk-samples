import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:dimx_flutter_sdk/dimx_flutter_sdk.dart';

// docs:begin urls
// A public DimensionX experience: the dimension and one of its locations.
const demoArUrl = 'https://go.dimx.world/?dim=3358080808&loc=2134961551&live=1&place=1';
const demoWebUrl = 'https://go.dimx.world/?dim=3358080808';
// docs:end

void main() {
  runApp(const SampleApp());
}

class SampleApp extends StatefulWidget {
  const SampleApp({super.key});

  @override
  State<SampleApp> createState() => _SampleAppState();
}

class _SampleAppState extends State<SampleApp> {
  final _dimx = DimxPlugin();
  String _platformVersion = 'Unknown';
  Future<void>? _initialization;

  @override
  void initState() {
    super.initState();
    _readPlatformVersion();
    _ensureInitialized().catchError(_report);
  }

  // docs:begin init
  /// The SDK is initialised once; every screen waits for it.
  Future<void> _ensureInitialized() {
    return _initialization ??= _dimx.initializeDimxSdk({
      'qrCodeEnabled': true,
      'sharePhotoEnabled': true,
      'shareVideoEnabled': false,
      'webVersionUrl': 'https://app.dimx.world/version',
      'defaultAppUrl': 'https://go.dimx.world',
      'appScreenActivity': 'world.dimx.sampleapp.flutter.MainActivity',
    }).catchError((Object error) {
      _initialization = null;
      throw error;
    });
  }
  // docs:end

  Future<void> _readPlatformVersion() async {
    String version;
    try {
      version = await _dimx.getPlatformVersion() ?? 'Unknown platform version';
    } on PlatformException {
      version = 'Failed to get platform version.';
    }
    if (!mounted) return;
    setState(() => _platformVersion = version);
  }

  // docs:begin screens
  Future<void> _showAR() async {
    try {
      await _ensureInitialized();
      await _dimx.showARScreen(demoArUrl);
    } catch (error) {
      _report(error);
    }
  }

  Future<void> _showWeb() async {
    try {
      await _ensureInitialized();
      await _dimx.showWebScreen(demoWebUrl);
    } catch (error) {
      _report(error);
    }
  }
  // docs:end

  void _report(Object error) {
    final messenger = _messengerKey.currentState;
    messenger?.showSnackBar(SnackBar(content: Text('Dimx: $error')));
  }

  final _messengerKey = GlobalKey<ScaffoldMessengerState>();

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      scaffoldMessengerKey: _messengerKey,
      home: Scaffold(
        appBar: AppBar(title: const Text('DimensionX Flutter Sample')),
        body: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text('Running on: $_platformVersion'),
              const SizedBox(height: 32),
              ElevatedButton(onPressed: _showAR, child: const Text('Show AR screen')),
              const SizedBox(height: 16),
              ElevatedButton(onPressed: _showWeb, child: const Text('Show web screen')),
            ],
          ),
        ),
      ),
    );
  }
}
