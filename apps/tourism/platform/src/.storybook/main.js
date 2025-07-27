const path = require('path');
module.exports = {
  stories: ['../stories/**/*.stories.mdx', '../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: '@storybook/react',
  core: {
    builder: 'webpack5',
  },
  webpackFinal: (config) => {
    config.resolve.modules.push(path.resolve(__dirname, '..'), 'node_modules');
    config.resolve.roots = [path.resolve(__dirname, '../public')];
    config.module.rules.push({
      test: /\.scss$/,
      use: ['style-loader', 'css-loader'],
    });
    return config;
  },
};
