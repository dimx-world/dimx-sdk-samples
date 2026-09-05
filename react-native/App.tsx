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
import { initializeDimxSdk, showARScreen } from '@dimx/react-native-sdk';

const DEMO_AR_URL = 'https://go.dimx.world/?dim=3358080808&loc=2134961551&live=1&force=1';
const WEB_VERSION_URL = 'https://app.dimx.world/version';
const DEFAULT_APP_URL = 'https://go.dimx.world';

export default function App() {
  const [platformVersion] = useState(`${Platform.OS} ${String(Platform.Version)}`);
  const [isSdkInitialized, setIsSdkInitialized] = useState(false);
  const initPromiseRef = useRef<Promise<void> | null>(null);

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
        appScreenActivity: 'com.dimxexample.MainActivity',
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

  useEffect(() => {
    let isMounted = true;

    const initDimxSdk = async () => {
      try {
        await ensureDimxSdkInitialized();
      } catch (error) {
        if (isMounted) {
          Alert.alert('Dimx init failed', String(error));
        }
      }
    };

    initDimxSdk();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleShowAR = async () => {
    try {
      await ensureDimxSdkInitialized();
      await showARScreen(DEMO_AR_URL);
    } catch (error) {
      Alert.alert('AR failed', String(error));
    }
  };

  return (
    <View style={styles.screen}>
      <StatusBar hidden />
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>Plugin example app</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.platformText}>{`Running on: ${platformVersion}\n`}</Text>
        <View style={styles.spacer} />
        <TouchableOpacity style={styles.button} onPress={handleShowAR} activeOpacity={0.82}>
          <Text style={styles.buttonLabel}>Show AR view</Text>
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
    height: 56,
    backgroundColor: '#2196f3',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 44 : 0, // Account for status bar area on iOS
    elevation: 4,
    shadowColor: '#000000',
    shadowOpacity: 0.24,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  appBarTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '500',
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
    height: 32,
  },
  button: {
    backgroundColor: '#2196f3',
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 10,
    elevation: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  buttonLabel: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
});
