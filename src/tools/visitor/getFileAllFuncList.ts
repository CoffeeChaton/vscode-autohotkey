import { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import type { TAstRoot } from '../../AhkSymbol/TAhkSymbolIn';

const wmFn = new WeakMap<TAstRoot, readonly CAhkFunc[]>();

export function getFileAllFunc(AstRoot: TAstRoot): readonly CAhkFunc[] {
    const cache: readonly CAhkFunc[] | undefined = wmFn.get(AstRoot);
    if (cache !== undefined) return cache;

    const result: CAhkFunc[] = [];
    for (const DA of AstRoot) {
        if (DA instanceof CAhkFunc) {
            result.push(DA);
        }
    }

    wmFn.set(AstRoot, result);

    return result;
}
