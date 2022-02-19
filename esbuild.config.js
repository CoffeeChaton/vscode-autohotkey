const esbuild = require('esbuild');
const copyStaticFiles = require('esbuild-copy-static-files');

const filter = (src, _dest) => {
    const folder = [
        '.config',
        '.git',
        '.history',
        '.idea',
        '.vscode',
        'coverage',
        'image',
        'node_modules',
        'out',
        'src',
    ];
    const file = [
        '.cpuprofile',
        '.editorconfig',
        '.eslintcache',
        '.eslintrc.json',
        '.gitignore',
        'dprint.json',
        'esbuild.config.js',
        'jest.config.js',
        'pnpm-lock.yaml',
        'tsconfig.json',
        'rslintrc.toml',
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
    // define:DEBUG=false
    plugins: [
        copyStaticFiles({
            src: './',
            dest: 'C:/Users/antec0217/.vscode/extensions/cz00',
            filter,
            preserveTimestamps: true,
        }),
    ],
};
esbuild.build(config);
