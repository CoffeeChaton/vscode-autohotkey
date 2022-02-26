/*
    import * as fs from 'fs';
    import * as path from 'path';
    import * as vscode from 'vscode';
    import { loadWASM } from 'vscode-oniguruma';

    const REPO_ROOT = path.join(vscode.env.appRoot, 'node_modules.asar', 'vscode-oniguruma', 'release', 'onig.wasm');

    const wasm: ArrayBufferLike = fs.readFileSync(REPO_ROOT).buffer;

    export const loadPromise = loadWASM({ instantiator: async (imports) => WebAssembly.instantiate(wasm, imports) });

    const scan = new OnigScanner(['^\\s*(\\w+)\\(']);

    const s = new OnigString(DocStrMap[defLine].textRaw);
    const s = new OnigString(textFix;

    const ed = scan.findNextMatchSync(s, 0);

    // All regex
    const {start, end, length} = ed.captureIndices[0];

    // First () --> I need
    const {start, end, length} = ed.captureIndices[1];

*/
