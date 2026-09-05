/**
 * @format
 */

import 'react-native';
import React from 'react';

// Note: import explicitly to use the types shipped with jest.
import {it, jest} from '@jest/globals';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

jest.mock('@dimx/react-native-sdk', () => ({
  initializeDimxSdk: jest.fn(() => Promise.resolve()),
  showARScreen: jest.fn(() => Promise.resolve()),
}));

import App from '../App';

it('renders correctly', async () => {
  await renderer.act(async () => {
    renderer.create(<App />);
    await Promise.resolve();
  });
});
