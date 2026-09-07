# DimensionX iOS SDK sample

The smallest iOS app that uses the DimensionX SDK: two buttons, one opening an
AR experience, one opening its web page.

## Build and run

Open `SampleApp.xcodeproj` in Xcode 16 or newer, pick your team under
Signing & Capabilities, and run it on an iPhone. The SDK ships device-only
binaries (`ios-arm64`), so the simulator is not a destination.

The SDK is a Swift package resolved from
`https://github.com/dimx-world/dimx-ios-sdk.git` at an exact version, so the
first build downloads the engine and its dependencies; nothing has to be cloned
or added by hand. To try another SDK version, change the version rule of the
package in the project's Package Dependencies.

To check the sample compiles without a signing identity:

```bash
xcodebuild -project SampleApp.xcodeproj -scheme SampleApp -sdk iphoneos \
    -configuration Release CODE_SIGNING_ALLOWED=NO build
```

## What the sample shows

- The project depends on the `DimxCore` product of the `dimx-ios-sdk` package
  (`project.pbxproj`, `XCRemoteSwiftPackageReference`, `exactVersion`).
- `SceneDelegate.swift` initialises the SDK once the window exists:
  `AppConfig`, `addWebVersion`, `setShowAppScreenAction` (how the SDK hands the
  screen back to the app), then `Context.initialize(window, appConfig)`.
- `ViewController.swift` opens the screens with
  `Context.inst().showARScreen(url, "", "", onDenied:)` and `showWebScreen(url)`;
  the SDK asks for the permissions itself when the AR screen opens, and
  `onDenied` is where a refused camera lands.
- `Info.plist` carries the camera, location, photo library and Bluetooth usage
  descriptions the SDK's APIs make App Store Connect demand: a binary linking
  the SDK without one is refused at upload (ITMS-90683).
- The target links with `-ObjC` (Other Linker Flags). ARCore, inside the SDK,
  ships as static libraries whose Objective-C categories the linker drops
  otherwise, and the app then dies at launch with an unrecognized selector.

The version this sample is pinned to is the SDK release it was validated
against; the Release Center moves it with every SDK release.
