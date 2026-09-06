#!/usr/bin/env node
/**
 * Runs a command with the Android SDK and a JDK wired into the environment, so
 * the npm scripts work on any machine without hardcoded paths.
 *
 * Resolution order for the SDK: ANDROID_HOME, ANDROID_SDK_ROOT,
 * android/local.properties, then the platform's default install location.
 * The JDK falls back to the one bundled with Android Studio when neither
 * JAVA_HOME nor a `java` on PATH is available.
 *
 *   node scripts/with-android-env.js react-native run-android
 *   node scripts/with-android-env.js adb devices
 *
 * The pseudo-command `gradlew` runs the Gradle wrapper for the current platform
 * from the android/ directory:
 *
 *   node scripts/with-android-env.js gradlew :app:assembleDebug
 */
const {spawnSync} = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const EXAMPLE_DIR = path.resolve(__dirname, '..');
const IS_WINDOWS = process.platform === 'win32';
const PATH_KEY =
  Object.keys(process.env).find(key => key.toUpperCase() === 'PATH') || 'PATH';

function firstExistingDir(candidates) {
  return candidates.find(dir => dir && fs.existsSync(dir));
}

function sdkDirFromLocalProperties() {
  const file = path.join(EXAMPLE_DIR, 'android', 'local.properties');
  if (!fs.existsSync(file)) {
    return undefined;
  }
  const match = fs.readFileSync(file, 'utf8').match(/^\s*sdk\.dir\s*=\s*(.+)$/m);
  // local.properties escapes backslashes and colons, e.g. C\:\\Users\\me\\...
  return match ? match[1].trim().replace(/\\(.)/g, '$1') : undefined;
}

function defaultSdkDirs() {
  const home = os.homedir();
  if (IS_WINDOWS) {
    const localAppData =
      process.env.LOCALAPPDATA || path.join(home, 'AppData', 'Local');
    return [path.join(localAppData, 'Android', 'Sdk')];
  }
  if (process.platform === 'darwin') {
    return [path.join(home, 'Library', 'Android', 'sdk')];
  }
  return [path.join(home, 'Android', 'Sdk'), path.join(home, 'android-sdk')];
}

function resolveSdkDir() {
  return firstExistingDir([
    process.env.ANDROID_HOME,
    process.env.ANDROID_SDK_ROOT,
    sdkDirFromLocalProperties(),
    ...defaultSdkDirs(),
  ]);
}

function hasJavaOnPath() {
  const probe = spawnSync(IS_WINDOWS ? 'java.exe' : 'java', ['-version'], {
    stdio: 'ignore',
    shell: IS_WINDOWS,
  });
  return probe.status === 0;
}

function androidStudioJdkDirs() {
  const home = os.homedir();
  if (IS_WINDOWS) {
    const programFiles = process.env.ProgramFiles || 'C:\\Program Files';
    return [path.join(programFiles, 'Android', 'Android Studio', 'jbr')];
  }
  if (process.platform === 'darwin') {
    return [
      '/Applications/Android Studio.app/Contents/jbr/Contents/Home',
      path.join(
        home,
        'Applications/Android Studio.app/Contents/jbr/Contents/Home',
      ),
    ];
  }
  return [
    '/opt/android-studio/jbr',
    path.join(home, 'android-studio', 'jbr'),
    path.join(home, '.local', 'share', 'JetBrains', 'Toolbox', 'apps'),
  ];
}

function resolveJavaHome() {
  if (process.env.JAVA_HOME && fs.existsSync(process.env.JAVA_HOME)) {
    return process.env.JAVA_HOME;
  }
  if (hasJavaOnPath()) {
    return undefined; // already usable, leave the environment alone
  }
  return firstExistingDir(androidStudioJdkDirs());
}

const [command, ...args] = process.argv.slice(2);
if (!command) {
  console.error('usage: node scripts/with-android-env.js <command> [args...]');
  process.exit(2);
}

const sdkDir = resolveSdkDir();
if (!sdkDir) {
  console.error(
    'Android SDK not found. Set ANDROID_HOME, or add sdk.dir to ' +
      'example/android/local.properties.',
  );
  process.exit(1);
}

const env = {...process.env, ANDROID_HOME: sdkDir, ANDROID_SDK_ROOT: sdkDir};

const javaHome = resolveJavaHome();
if (javaHome) {
  env.JAVA_HOME = javaHome;
}

const ANDROID_DIR = path.join(EXAMPLE_DIR, 'android');

const extraPathDirs = [
  path.join(sdkDir, 'platform-tools'),
  path.join(sdkDir, 'emulator'),
  path.join(sdkDir, 'cmdline-tools', 'latest', 'bin'),
  javaHome && path.join(javaHome, 'bin'),
  path.join(EXAMPLE_DIR, 'node_modules', '.bin'),
  // The React Native CLI runs a bare `gradlew.bat` from the android directory,
  // and cmd.exe looks there only while NoDefaultCurrentDirectoryInExePath is
  // unset - on a hardened Windows desk the wrapper has to be on the PATH.
  ANDROID_DIR,
].filter(dir => dir && fs.existsSync(dir));

env[PATH_KEY] = [...extraPathDirs, process.env[PATH_KEY] || ''].join(
  path.delimiter,
);

const isGradle = command === 'gradlew' || command === 'gradle';

const result = spawnSync(
  isGradle
    ? path.join(ANDROID_DIR, IS_WINDOWS ? 'gradlew.bat' : 'gradlew')
    : command,
  args,
  {
    stdio: 'inherit',
    env,
    cwd: isGradle ? ANDROID_DIR : EXAMPLE_DIR,
    shell: IS_WINDOWS, // resolves .cmd shims such as react-native and adb
  },
);

if (result.error) {
  console.error(`Failed to run "${command}": ${result.error.message}`);
  process.exit(1);
}

process.exit(result.status === null ? 1 : result.status);
