# DimensionX Android SDK sample

The smallest Android app that uses the DimensionX SDK: two buttons, one
opening an AR experience, one opening its web page.

## Build and run

Open `android/` in Android Studio (Ladybug or newer) and run it on a phone.
ARCore needs a real device: Android 9 or newer with
[ARCore support](https://developers.google.com/ar/devices). The emulator will
not do.

From a terminal:

```bash
./gradlew :app:assembleDebug
adb install app/build/outputs/apk/debug/app-debug.apk
```

## What the sample shows

- `settings.gradle` adds the maven repository the SDK is served from,
  `https://dl.dimx.world/sdk/android`.
- `app/build.gradle` depends on `world.dimx:dimx-android-sdk:<version>`. The
  SDK's pom brings appcompat, ARCore and its other dependencies with it, and
  needs Android Gradle plugin 8.9.1 or newer with `compileSdk 36`.
- `MainActivity.java` asks for the camera and location permissions, initialises
  the SDK once (`AppConfig`, `ArCoreApkManager.checkInstall`,
  `Context.initializeWithConfig`) and opens the two screens with
  `Context.inst().showARScreen(...)` and `Context.inst().showWebScreen(...)`.
- The manifest declares nothing SDK-specific: the SDK's own manifest carries the
  permissions, the ARCore requirement and its activities, and they merge in.

The version this sample is pinned to is the SDK release it was validated
against; the Release Center moves it with every SDK release.
