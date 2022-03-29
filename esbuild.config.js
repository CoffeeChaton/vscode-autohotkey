'use strict';
const fs = require('fs');
const esbuild = require('esbuild');
const copyStaticFiles = require('esbuild-copy-static-files');

const rawData = fs.readFileSync('./esbuildTarget.json');
const esbuildTarget = JSON.parse(rawData).A;

const filter = (src, _dest) => {
    const folder = [
        '.config',
        '.git',
        '.history',
        '.idea',
        '.vscode',
        'coverage',
        'image', // vscode plugin readme.md need https:// img now.
        'jest.config.js',
        'node_modules',
        'out',
        'src',
    ];
    const file = [
        '.VSCodeCounter',
        '.cpuprofile',
        '.cspell',
        '.editorconfig',
        '.eslintcache',
        '.eslintrc.json',
        '.gitattributes',
        '.gitignore',
        '.heapsnapshot',
        'cspell.json',
        'dprint.json',
        'esbuild.config.js',
        'esbuildTarget.json',
        'pnpm-lock.yaml',
        'rslintrc.toml',
        'tsconfig.json',
    ];
    const List = [...folder, ...file];
    for (const ed of List) {
        if (src.endsWith(ed)) {
            return false;
        }
    }

    return true;
};

const config = {
    entryPoints: ['./src/extension.ts', './src/debugEntrance.ts'],
    bundle: true,
    outdir: 'dict',
    external: ['vscode', '@vscode/debugprotocol'], // not bundle 'vscode'
    format: 'cjs',
    platform: 'node',
    sourcemap: true,
    watch: false,
    logLevel: 'info',
    // minify: true, //
    treeShaking: true,
    // define:DEBUG=false
    plugins: [
        copyStaticFiles({
            src: './',
            dest: esbuildTarget, // 'C:/Users/<useName>/.vscode/extensions/cz00',
            filter,
            preserveTimestamps: true,
        }),
    ],
};
esbuild.build(config);
