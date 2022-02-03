const esbuild = require('esbuild');
const copyStaticFiles = require('esbuild-copy-static-files')

const filter = (src, dest) => {
    const filterRuler = ['node_modules', 'coverage', 'out', 'src', '.history', '.idea', '.git'];
    for (const ed of filterRuler) {
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
    external: ['vscode', "@vscode/debugprotocol",], // not bundle 'vscode'
    format: 'cjs',
    platform: 'node',
    sourcemap: false,
    watch: false,
    logLevel: 'info',
    // define:DEBUG=false
    plugins: [
        copyStaticFiles({
            src: './',
            dest: 'C:/Users/====/.vscode/extensions/====',
            filter,
            preserveTimestamps: true
        })
    ],
};
esbuild.build(config);
