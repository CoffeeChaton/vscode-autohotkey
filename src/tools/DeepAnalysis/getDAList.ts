import { CAhkClass } from '../../AhkSymbol/CAhkClass';
import { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import type { TAhkSymbolList, TAstRoot } from '../../AhkSymbol/TAhkSymbolIn';
import { getFileAllClass } from '../visitor/getFileAllClassList';
import { getFileAllFunc } from '../visitor/getFileAllFuncList';

function getDAList(AST: Readonly<TAhkSymbolList>, result: CAhkFunc[]): void {
    for (const DA of AST) {
        if (DA instanceof CAhkFunc) {
            result.push(DA);
        } else if (DA instanceof CAhkClass) {
            getDAList(DA.children, result);
        }
    }
}

const wm = new WeakMap<TAstRoot, readonly CAhkFunc[]>();

export function getDAListTop(AstRoot: TAstRoot): readonly CAhkFunc[] {
    const cache: readonly CAhkFunc[] | undefined = wm.get(AstRoot);
    if (cache !== undefined) return cache;

    const result: CAhkFunc[] = [...getFileAllFunc(AstRoot)];
    for (const DA of getFileAllClass(AstRoot)) {
        getDAList(DA.children, result);
    }

    wm.set(AstRoot, result);

    return result;
}
