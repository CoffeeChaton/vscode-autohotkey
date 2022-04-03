import { Detecter, TAhkFileData } from '../core/Detecter';
import { EMode, TSymAndFsPath } from '../globalEnum';
import { kindCheck } from '../provider/Def/kindCheck';

export function tryGetSymbol(wordUP: string, mode: EMode): null | TSymAndFsPath {
    const fsPaths: string[] = Detecter.getDocMapFile();
    for (const fsPath of fsPaths) {
        const AhkFileData: undefined | TAhkFileData = Detecter.getDocMap(fsPath);
        if (AhkFileData === undefined) continue;
        for (const AhkSymbol of AhkFileData.AhkSymbolList) {
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
