const esbuild = require('esbuild');
const copyStaticFiles = require('esbuild-copy-static-files')

const config = {
    entryPoints: ['./src/extension.ts', './src/debugEntrance.ts'],
    bundle: true,
    outdir: 'dict',
    external: ['vscode'],
    format: 'cjs',
    platform: 'node',
    sourcemap: false,
    watch: false,
    logLevel: 'info',
    // define:DEBUG=false
    plugins: [
        copyStaticFiles({
            src: './',
            dest: 'C:/Users/=====/.vscode/extensions/===',
            filter: (src, dest) => {
                if (src.endsWith('node_modules')) {
                    return false;
                }
                return true;
            },
            preserveTimestamps: true
        })
    ],
};
esbuild.build(config);
