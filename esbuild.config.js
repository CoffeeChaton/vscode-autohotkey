
// esbuild-base
// const esbuildConfig = () => require('esbuild').buildSync({
//     entryPoints: ['./src/extension.ts'],
//     bundle: true,
//     outfile: 'out/main.js',
//     external: ['vscode'],
//     format: 'cjs',
//     platform:'node',
// });


const esbuild = require('esbuild');

const config = {
    entryPoints: ['./src/extension.ts','./src/debugEntrance.ts'],
    bundle: true,
    outdir: 'out',
    external: ['vscode'],
    format: 'cjs',
    platform: 'node',
    sourcemap: false    
};
esbuild.build(config)
    .then(() => {  process.stdout.write('OK')})
