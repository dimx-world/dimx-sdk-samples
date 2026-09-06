# DimensionX Flutter SDK sample

A Flutter app that takes `dimx_flutter_sdk` from pub.dev and opens a
DimensionX AR experience and its web page with it. It is the consumer's view
of the plugin: the package comes from the registry exactly as it would in
your own app.

## Build and run

Flutter 3.44 or newer (on 3.24 to 3.43, run
`flutter config --enable-swift-package-manager` once for iOS), a JDK 17 or
newer and the Android SDK; Xcode on a mac for iOS.

```bash
flutter pub get
flutter test                       # the app renders with the plugin mocked
flutter run -d <device-id>         # flutter devices lists them
```

A real phone is needed on both platforms: the SDKs use ARCore and ARKit,
which the emulators and the simulator do not provide.

## What the sample shows

- `pubspec.yaml` depends on `dimx_flutter_sdk` at an exact version - the SDK
  release the sample was validated against.
- `lib/main.dart` calls `initializeDimxSdk({...})` once and `showARScreen(url)`
  / `showWebScreen(url)` on the buttons; every call returns a future that
  fails with a `PlatformException` naming the reason when the SDK cannot.
- `android/build.gradle.kts` adds the maven repository the native Android SDK
  comes from (`https://dl.dimx.world/sdk/android`) under `allprojects`, which
  the host app has to do itself, and `android/app/build.gradle.kts` sets
  `minSdk 28`, which ARCore needs.
- `ios/Runner/Info.plist` carries the camera, location, photo library and
  Bluetooth usage descriptions the SDK's screens require. The plugin is a
  Swift package, so Flutter resolves the native SDK through Swift Package
  Manager; nothing is built or vendored by hand.
- `ios/Runner.xcodeproj` targets iOS 16.4, the SDK's floor - Flutter's
  template starts lower, and the plugin's package refuses a target below it.
- There is no Podfile and no CocoaPods integration in the Xcode project:
  with Swift Package Manager on, Flutter needs neither, and this app has no
  plugin that would.
