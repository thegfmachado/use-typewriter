module.exports = {
  preset: 'ts-jest',
  transformIgnorePatterns: ['/dist/'],
  testEnvironment: 'jest-environment-jsdom', // Use the installed environment explicitly
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest', // Use ts-jest to handle .ts and .tsx files
  },
  globals: {
    'ts-jest': {
      useESM: true, // Enable ESM support in ts-jest
    },
  },
  moduleNameMapper: {
    '^react$': 'react', // This is useful if you're mapping React
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx', '.jsx'], // Remove .js here
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'], // Match .ts, .tsx, .js, and .jsx files
};
