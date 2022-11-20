import type { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import type { TAstRoot } from '../../AhkSymbol/TAhkSymbolIn';
import { getFileAllFunc } from './getFileAllFuncList';

type TFnMap = ReadonlyMap<string, CAhkFunc>;

const wm = new WeakMap<TAstRoot, TFnMap>();

export function getFileAllFuncMap(ASTRoot: TAstRoot): TFnMap {
    const cache: TFnMap | undefined = wm.get(ASTRoot);
    if (cache !== undefined) return cache;

    type TMapMake = [string, CAhkFunc];
    const result: TFnMap = new Map<string, CAhkFunc>(
        getFileAllFunc(ASTRoot)
            .map((ahkFunc: CAhkFunc): TMapMake => [ahkFunc.upName, ahkFunc]),
    );

    wm.set(ASTRoot, result);

    return result;
}
