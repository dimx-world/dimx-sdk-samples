import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { initializeDimxSdk, showARScreen, showWebScreen } from '@dimx/react-native-sdk';

// docs:begin urls
// A public DimensionX experience: the dimension and one of its locations.
const DEMO_AR_URL = 'https://go.dimx.world/?dim=3358080808&loc=2134961551&live=1&force=1';
const DEMO_WEB_URL = 'https://go.dimx.world/?dim=3358080808';
const WEB_VERSION_URL = 'https://app.dimx.world/version';
const DEFAULT_APP_URL = 'https://go.dimx.world';
// docs:end

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <SampleScreen />
    </SafeAreaProvider>
  );
}

function SampleScreen() {
  const insets = useSafeAreaInsets();
  const [platformVersion] = useState(`${Platform.OS} ${String(Platform.Version)}`);
  const [isSdkInitialized, setIsSdkInitialized] = useState(false);
  const initPromiseRef = useRef<Promise<void> | null>(null);

  // docs:begin init
  // The SDK is initialised once; every screen waits for it. On Android the
  // appScreenActivity is where the SDK returns to when its own screens close.
  const ensureDimxSdkInitialized = async () => {
    if (isSdkInitialized) {
      return;
    }
    if (!initPromiseRef.current) {
      initPromiseRef.current = initializeDimxSdk({
        qrCodeEnabled: true,
        sharePhotoEnabled: true,
        shareVideoEnabled: false,
        webVersionUrl: WEB_VERSION_URL,
        defaultAppUrl: DEFAULT_APP_URL,
        appScreenActivity: 'world.dimx.sampleapp.rn.MainActivity',
      })
        .then(() => {
          setIsSdkInitialized(true);
        })
        .catch(error => {
          initPromiseRef.current = null;
          throw error;
        });
    }
    await initPromiseRef.current;
  };
  // docs:end

  useEffect(() => {
    let isMounted = true;
    ensureDimxSdkInitialized().catch(error => {
      if (isMounted) {
        Alert.alert('Dimx init failed', String(error));
      }
    });
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // docs:begin screens
  const handleShowAR = async () => {
    try {
      await ensureDimxSdkInitialized();
      await showARScreen(DEMO_AR_URL);
    } catch (error) {
      Alert.alert('AR failed', String(error));
    }
  };

  const handleShowWeb = async () => {
    try {
      await ensureDimxSdkInitialized();
      await showWebScreen(DEMO_WEB_URL);
    } catch (error) {
      Alert.alert('Web failed', String(error));
    }
  };
  // docs:end

  return (
    <View style={styles.screen}>
      <View style={[styles.appBar, { paddingTop: insets.top }]}>
        <Text style={styles.appBarTitle}>DimensionX RN Sample</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.platformText}>{`Running on: ${platformVersion}`}</Text>
        <View style={styles.spacer} />
        <TouchableOpacity style={styles.button} onPress={handleShowAR} activeOpacity={0.82}>
          <Text style={styles.buttonLabel}>Show AR screen</Text>
        </TouchableOpacity>
        <View style={styles.spacer} />
        <TouchableOpacity style={styles.button} onPress={handleShowWeb} activeOpacity={0.82}>
          <Text style={styles.buttonLabel}>Show web screen</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  appBar: {
    backgroundColor: '#2196f3',
    paddingHorizontal: 16,
    paddingBottom: 16,
    elevation: 4,
  },
  appBarTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '500',
    paddingTop: 16,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  platformText: {
    color: '#000000',
    fontSize: 14,
  },
  spacer: {
    height: 24,
  },
  button: {
    backgroundColor: '#2196f3',
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 10,
    elevation: 2,
  },
  buttonLabel: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
});
