export default {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testMatch: ['<rootDir>/src/tests/unit/**/*.test.ts', '<rootDir>/src/tests/unit/**/*.test.tsx'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          target: 'es2020',
          lib: ['dom', 'es2020'],
          jsx: 'react-jsx',
          esModuleInterop: true,
          allowJs: true,
          types: ['jest'],
        },
      },
    ],
  },
};
