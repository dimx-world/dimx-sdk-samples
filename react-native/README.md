# DimensionX React Native SDK sample

A React Native 0.87 app that installs `@dimx/react-native-sdk` from npm and
opens an AR experience and its web page with it. It is the consumer's view of the bridge: the
package comes from the registry exactly as it would in your own app.

## Build and run

Node 22.11 or newer, a JDK 17 or newer and the Android SDK with platform 37
(React Native 0.87 compiles against it; the app itself targets Android 16).
On Windows the SDK also needs a CMake 4.x (SDK Manager, SDK Tools tab): the
New Architecture's C++ build produces paths longer than 260 characters, which
the ninja bundled with the default CMake 3.22.1 cannot open.

```bash
npm install
npm test                 # the app renders with the SDK mocked
npm run android:build    # gradle :app:assembleDebug, with the Android SDK found for you
npm run android          # on a connected phone
```

The debug build embeds its JavaScript bundle (`debuggableVariants = []` in
`android/app/build.gradle`), so a Run from Android Studio, or the APK
`android:build` made, works with nothing else running. React Native's default
is the opposite: a debug build carries no JavaScript and loads it from
**Metro**, the bundler on the development machine, so a build started from
Android Studio - which starts no Metro - stops at *Unable to load script*.
With Metro up the debug app loads from it instead, hot reload included:
`npm run android` starts it and runs `adb reverse tcp:8081 tcp:8081` so the
phone reaches it through adb; from Android Studio, `npm start` and the
reverse by hand. The release build is what testers get:

```bash
npm run android:release  # gradle installRelease on the connected phone
```

iOS needs a mac with CocoaPods 1.13 or newer (`bundle install` reads the
Gemfile):

```bash
cd ios && bundle exec pod install && cd ..
npm run ios
```

`pod install` must report `[SPM] Adding SPM dependency on product ["DimxCore"]`:
the bridge's podspec pulls the DimensionX iOS SDK in as a Swift package. ARCore
needs a real device on both platforms.

## What the sample shows

- `package.json` depends on `@dimx/react-native-sdk` at an exact version - the
  SDK release the sample was validated against.
- `App.tsx` calls `initializeDimxSdk({...})` once and `showARScreen(url)` /
  `showWebScreen(url)` on the buttons; all return promises that reject with a
  reason when the SDK cannot.
- `android/build.gradle` adds the maven repository the native Android SDK comes
  from (`https://dl.dimx.world/sdk/android`) under `allprojects`, which the host
  app has to do itself.
- `ios/Podfile` builds pods as dynamic frameworks, which the Swift package
  products require. Its post-install also adds a phase to the app target that
  removes the app's copies of the SDK xcframeworks' `.signature` files: an
  archive collects one per target that processed a framework, the bridge pod
  and the app both do, and Xcode (15.0 through 26.x) fails the archive on the
  second copy. A plain build never shows it; only an archive does.
- `scripts/with-android-env.js` finds the Android SDK and a JDK so the npm
  scripts work on any machine without local paths.
