const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^module/(.*)$': '<rootDir>/module/$1',
    '^containers/(.*)$': '<rootDir>/containers/$1',
    '^store/(.*)$': '<rootDir>/store/$1',
  },
  transformIgnorePatterns: ['node_modules/(?!(your-module-name)/)'],
};

module.exports = createJestConfig(customJestConfig);
