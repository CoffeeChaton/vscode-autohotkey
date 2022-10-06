/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

module.exports = {
    rootDir: './src',
    verbose: false,
    bail: true,
    clearMocks: true,
    coverageDirectory: 'coverage',
    // preset: 'ts-jest',
    testEnvironment: 'node',
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.ts$',
    transform: {
        '^.+\\.(t|j)sx?$': '@swc/jest',
    },
};
