/** @type {import('jest').Config} */
module.exports = {
  clearMocks: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.test.{ts,tsx}',
    '!src/test/**',
    '!src/main.tsx',
    '!src/**/*.types.ts',
  ],
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/src/**/*.test.{ts,tsx}'],
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  transform: {
    '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        module: {
          type: 'es6',
        },
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: true,
          },
          transform: {
            react: {
              runtime: 'automatic',
            },
          },
        },
      },
    ],
  },
  moduleNameMapper: {
    '\\.css$': '<rootDir>/src/test/mocks/styleMock.ts',
    '\\.md(?:\\?raw)?$': '<rootDir>/src/test/mocks/markdownMock.ts',
    '^react-markdown$': '<rootDir>/src/test/mocks/reactMarkdownMock.tsx',
  },
}
