/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

// The bridge is a native module: mocked here so the app renders without a phone.
jest.mock('@dimx/react-native-sdk', () => ({
  initializeDimxSdk: jest.fn(() => Promise.resolve()),
  showARScreen: jest.fn(() => Promise.resolve()),
  showWebScreen: jest.fn(() => Promise.resolve()),
}));

import App from '../App';

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
