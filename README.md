# dimx-sdk-samples

Sample apps for the DimensionX SDKs, one per platform, each the smallest app
that opens a DimensionX AR experience and its web page. Every one of them is
`SampleApp` - the Xcode project, the Gradle project, the React Native app, the
Flutter package `sample_app` - and installs as *DimensionX Sample*; the React
Native and Flutter ones as *DimensionX RN Sample* and *DimensionX Flutter
Sample*, so they sit beside the native Android sample on one phone:

| directory | SDK | how the SDK is consumed |
| --- | --- | --- |
| [`android/`](android/) | [dimx-android-sdk](https://github.com/dimx-world/dimx-android-sdk) | `implementation "world.dimx:dimx-android-sdk:<version>"` from `https://dl.dimx.world/sdk/android` |
| [`ios/`](ios/) | [dimx-ios-sdk](https://github.com/dimx-world/dimx-ios-sdk) | Swift package `https://github.com/dimx-world/dimx-ios-sdk.git`, exact version |
| [`react-native/`](react-native/) | [@dimx/react-native-sdk](https://www.npmjs.com/package/@dimx/react-native-sdk) | `npm install @dimx/react-native-sdk@<version>` |
| [`flutter/`](flutter/) | [dimx_flutter_sdk](https://pub.dev/packages/dimx_flutter_sdk) | `flutter pub add dimx_flutter_sdk` at an exact version |

Each directory has its own README with build and run steps. All of them need a
real phone: the SDKs use ARCore and ARKit, which the emulators and the
simulator do not provide.

## Versions

The samples are pinned to one SDK release, the version in [`version`](version),
and every sample's dependency line names it. A tag `v<version>` on this
repository marks the samples as validated against that release: the
DimensionX Release Center builds every sample against each SDK release
candidate before the release is approved, then moves the pins and tags the
result. To try a sample against another SDK version, change its dependency
line.

The full documentation is at <https://docs.dimx.world>.
