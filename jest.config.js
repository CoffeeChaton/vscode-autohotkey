/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

module.exports = {
    rootDir: './src',
    verbose: true,
    bail: true,
    coverageDirectory: 'coverage',
    preset: 'ts-jest',
    testEnvironment: 'node',
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.ts$',
};
