/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
    verbose: true,
    roots: ['<rootDir>'],
    coverageDirectory: 'coverage',
    coverageReporters: ['json', 'lcov', 'text', 'clover', 'cobertura'],
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
        },
    },
    clearMocks: true,
    collectCoverage: true,
    coverageProvider: 'v8',
    testMatch: ['**/__tests__/**/*.+(ts|tsx|js)'],
};
