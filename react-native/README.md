# DimensionX React Native SDK sample

A React Native 0.76 app that installs `@dimx/react-native-sdk` from npm and
opens an AR experience with it. It is the consumer's view of the bridge: the
package comes from the registry exactly as it would in your own app.

## Build and run

```bash
npm install
npm test                 # the app renders with the SDK mocked
npm run android:build    # gradle :app:assembleDebug, with the Android SDK found for you
npm run android          # on a connected phone
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
- `App.tsx` calls `initializeDimxSdk({...})` once and `showARScreen(url)` on the
  button; both return promises that reject with a reason when the SDK cannot.
- `android/build.gradle` adds the maven repository the native Android SDK comes
  from (`https://dl.dimx.world/sdk/android`) under `allprojects`, which the host
  app has to do itself, and pins the Android Gradle plugin at 8.9.1 because the
  SDK's dependencies need it.
- `ios/Podfile` builds pods as dynamic frameworks, which the Swift package
  products require.
- `scripts/with-android-env.js` finds the Android SDK and a JDK so the npm
  scripts work on any machine without local paths.
