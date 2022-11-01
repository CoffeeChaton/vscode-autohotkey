import { CAhkClass } from '../../AhkSymbol/CAhkClass';
import { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import type { TAhkSymbolList, TAstRoot } from '../../AhkSymbol/TAhkSymbolIn';

function getDAList(AST: Readonly<TAhkSymbolList>, result: CAhkFunc[]): void {
    for (const DA of AST) {
        if (DA instanceof CAhkFunc) {
            result.push(DA);
        } else if (DA instanceof CAhkClass) {
            getDAList(DA.children, result);
        }
    }
}

const wm = new WeakMap<TAstRoot, CAhkFunc[]>();

export function getDAListTop(ASTRoot: TAstRoot): CAhkFunc[] {
    const cache: CAhkFunc[] | undefined = wm.get(ASTRoot);
    if (cache !== undefined) return cache;

    const result: CAhkFunc[] = [];
    for (const DA of ASTRoot) {
        if (DA instanceof CAhkFunc) {
            result.push(DA);
        } else if (DA instanceof CAhkClass) {
            getDAList(DA.children, result);
        }
    }

    wm.set(ASTRoot, result);

    return result;
}
