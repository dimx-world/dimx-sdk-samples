// This file exists so the app target links the Swift runtime.
//
// react-native-sdk pulls the Dimx iOS SDK in as a Swift package, and its
// dependency graph (DimxCore, DimxARCore, ARCore's Firebase libraries) contains
// Swift objects that reference the Swift back-deployment compatibility
// libraries. Xcode only adds those to the link line for targets that contain
// Swift source, so an all-Objective-C app target fails with
// "Undefined symbols: __swift_FORCE_LOAD_$_swiftCompatibility50".
//
// Deleting this file breaks the iOS build.

import Foundation
