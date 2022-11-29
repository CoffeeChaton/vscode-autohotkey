import type { CAhkClass } from '../../AhkSymbol/CAhkClass';
import type { TAstRoot } from '../../AhkSymbol/TAhkSymbolIn';
import { CMemo } from '../CMemo';
import { getFileAllClass } from './getFileAllClassList';

type TClassMap = ReadonlyMap<string, CAhkClass>;

const FileAllClassMemo = new CMemo<TAstRoot, TClassMap>((ASTRoot: TAstRoot) => {
    type TMapMake = [string, CAhkClass];
    const result: TClassMap = new Map<string, CAhkClass>(
        getFileAllClass(ASTRoot)
            .map((ahkFunc: CAhkClass): TMapMake => [ahkFunc.upName, ahkFunc]),
    );
    return result;
});

export function getFileAllClassMap(ASTRoot: TAstRoot): TClassMap {
    return FileAllClassMemo.up(ASTRoot);
}
