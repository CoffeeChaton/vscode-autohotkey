import { Detecter, TAhkFileData } from '../../core/Detecter';
import { CAhkFuncSymbol, EMode } from '../../globalEnum';
import { kindCheck } from '../../provider/Def/kindCheck';

export function getDAWithName(wordUP: string, mode: EMode): null | CAhkFuncSymbol {
    const fsPaths: string[] = Detecter.getDocMapFile();

    for (const fsPath of fsPaths) {
        const AhkFileData: undefined | TAhkFileData = Detecter.getDocMap(fsPath);
        if (AhkFileData === undefined) continue;

        const { AhkSymbolList } = AhkFileData;
        for (const DA of AhkSymbolList) {
            if (
                kindCheck(mode, DA.kind)
                && DA instanceof CAhkFuncSymbol
                && DA.upName === wordUP
            ) {
                return DA;
            }
        }
    }
    return null;
}
