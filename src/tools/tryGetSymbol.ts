import { Detecter } from '../core/Detecter';
import { EMode, TAhkSymbolList, TSymAndFsPath } from '../globalEnum';
import { kindCheck } from '../provider/Def/kindCheck';

export function tryGetSymbol(wordUP: string, mode: EMode): null | TSymAndFsPath {
    const fsPaths: string[] = Detecter.getDocMapFile();
    for (const fsPath of fsPaths) {
        const AhkSymbolList: undefined | TAhkSymbolList = Detecter.getDocMap(fsPath)?.AhkSymbolList;
        if (AhkSymbolList === undefined) continue;
        for (const AhkSymbol of AhkSymbolList) {
            if (
                kindCheck(mode, AhkSymbol.kind)
                && AhkSymbol.name.toUpperCase() === wordUP
            ) {
                return { AhkSymbol, fsPath };
            }
        }
    }
    return null;
}
