const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..');

const config = {
  watchFolders: [workspaceRoot],
  resolver: {
    extraNodeModules: {
      '@dimx/react-native-sdk': workspaceRoot,
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(projectRoot), config);
