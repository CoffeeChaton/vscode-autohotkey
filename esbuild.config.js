'use strict';

const esbuild = require('esbuild');
const minify = process.argv.includes('--minify');

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
        outdir: 'dist',
        platform: 'node',
        sourcemap: true,
        target: ['es2021', 'node16.13'],
        treeShaking: true,
    })
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
