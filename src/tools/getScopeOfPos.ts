import * as vscode from 'vscode';
import { Detecter } from '../core/Detecter';
import { MyDocSymbol, MyDocSymbolArr } from '../globalEnum';

type TStackNameSymbol = {
    name: string,
    ahkSymbol: MyDocSymbol,
};
type TStackPro = {
    stack: TStackNameSymbol[], isEnd: boolean, deep: number,
};
function dfs(fh: MyDocSymbolArr, position: vscode.Position, StackPro: TStackPro): TStackPro {
    const { stack, isEnd, deep } = StackPro;
    for (const s of fh) {
        if (s.range.contains(position)) {
            // console.log('s.name', s.name);
            stack.push({
                name: s.name,
                ahkSymbol: s,
            });
            const d = dfs(s.children, position, {
                stack,
                isEnd,
                deep: deep + 1,
            });

            // if (d.isEnd) {
            //     console.log('s.name End', s.name);
            // }
            return d;
        }
    }
    return {
        stack,
        isEnd: true,
        deep,
    };
}
export function getStack(document: vscode.TextDocument, position: vscode.Position): TStackPro | null {
    const ahkSymbolS = Detecter.getDocMap(document.uri.fsPath);
    if (ahkSymbolS === undefined) return null;
    const stackPro = dfs(ahkSymbolS, position, {
        stack: [],
        isEnd: false,
        deep: 0,
    });
    // stackPro.stack.forEach((e) => {
    //     console.log('e.ahkSymbol.name', e.ahkSymbol.name);
    //     console.log('e.ahkSymbol', e.ahkSymbol);
    //     console.log('e.ahkSymbol.range', e.ahkSymbol.range);
    // });

    // console.log('stackPro.deep', stackPro.deep);
    return stackPro;
}
export function getScopeOfPos(document: vscode.TextDocument, position: vscode.Position): vscode.Range | null {
    const stackPro = getStack(document, position);
    if (stackPro === null) return null;

    const stack = stackPro.stack;
    if (stack.length === 0) return null;
    if (stack[0].ahkSymbol.kind === vscode.SymbolKind.Function) {
        return stackPro.stack[0].ahkSymbol.range;
    }

    let mayBeRange: vscode.Range | null = null;
    for (const { ahkSymbol } of stack) {
        if (ahkSymbol.kind === vscode.SymbolKind.Class || ahkSymbol.kind === vscode.SymbolKind.Method) {
            mayBeRange = ahkSymbol.range;
        } else {
            return mayBeRange;
        }
    }
    return mayBeRange;
}
