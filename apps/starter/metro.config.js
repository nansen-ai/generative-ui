const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');
const packagesRoot = path.resolve(monorepoRoot, 'packages');

const config = getDefaultConfig(projectRoot);

// Only watch packages and node_modules, NOT other apps
config.watchFolders = [packagesRoot, path.resolve(monorepoRoot, 'node_modules')];

// Configure resolver to look in both app and monorepo node_modules
config.resolver = {
  ...config.resolver,
  nodeModulesPaths: [
    path.resolve(projectRoot, 'node_modules'),
    path.resolve(monorepoRoot, 'node_modules'),
  ],
  // Exclude other apps from resolution
  blockList: [
    /apps\/debugger\/.*/,
    /apps\/debugger-ios\/.*/,
  ],
};

module.exports = config;
