'use strict';
const fs = require('fs');
const esbuild = require('esbuild');
const copyStaticFiles = require('esbuild-copy-static-files');

const rawData = fs.readFileSync('./esbuildTarget.json');
const esbuildTarget = JSON.parse(rawData).A;

const minify = process.argv.includes('--minify');

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
        '.cpuprofile',
        '.cspell',
        '.editorconfig',
        '.eslintcache',
        '.eslintrc.json',
        '.gitattributes',
        '.gitignore',
        '.heapprofile',
        '.heapsnapshot',
        '.VSCodeCounter',
        '.vsix',
        'cspell.json',
        'dprint.json',
        'esbuild.config.js',
        'esbuildTarget.json',
        'icon.svg',
        'pnpm-lock.yaml',
        'TODO.md',
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

esbuild
    .build({
        // define:DEBUG=false
        // entryNames: '[dir]/neko',
        // keepNames: true,
        // mainFields: ['module', 'main'],
        // splitting: true,
        // tsconfig
        // watch: false,
        bundle: true,
        entryPoints: ['./src/extension.ts'],
        external: ['vscode'], // not bundle 'vscode'
        format: 'cjs',
        logLevel: 'info',
        minify, //
        outdir: 'dict',
        platform: 'node',
        sourcemap: true,
        target: ['es2021', 'node16.13'],
        treeShaking: true,
        plugins: [
            copyStaticFiles({
                src: './',
                dest: esbuildTarget, // 'C:/Users/<useName>/.vscode/extensions/cz00',
                filter,
                preserveTimestamps: true,
            }),
        ],
    })
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
