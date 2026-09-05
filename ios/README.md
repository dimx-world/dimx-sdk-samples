# DimensionX iOS SDK sample

The smallest iOS app that uses the DimensionX SDK: two buttons, one opening an
AR experience, one opening its web page.

## Build and run

Open `DimxSample.xcodeproj` in Xcode 16 or newer, pick your team under
Signing & Capabilities, and run it on an iPhone. The SDK ships device-only
binaries (`ios-arm64`), so the simulator is not a destination.

The SDK is a Swift package resolved from
`https://github.com/dimx-world/dimx-ios-sdk.git` at an exact version, so the
first build downloads the engine and its dependencies; nothing has to be cloned
or added by hand. To try another SDK version, change the version rule of the
package in the project's Package Dependencies.

To check the sample compiles without a signing identity:

```bash
xcodebuild -project DimxSample.xcodeproj -scheme DimxSample -sdk iphoneos \
    -configuration Release CODE_SIGNING_ALLOWED=NO build
```

## What the sample shows

- The project depends on the `DimxCore` product of the `dimx-ios-sdk` package
  (`project.pbxproj`, `XCRemoteSwiftPackageReference`, `exactVersion`).
- `SceneDelegate.swift` initialises the SDK once the window exists:
  `AppConfig`, `addWebVersion`, `setShowAppScreenAction` (how the SDK hands the
  screen back to the app), then `Context.initialize(window, appConfig)`.
- `ViewController.swift` checks `Context.inst().permissionsGranted()`, asks with
  `validatePermissions` when needed, and opens the screens with
  `Context.inst().showARScreen(url, "", "")` and `showWebScreen(url)`.
- `Info.plist` carries the camera, location and Bluetooth usage descriptions the
  SDK's screens require.

The version this sample is pinned to is the SDK release it was validated
against; the Release Center moves it with every SDK release.
