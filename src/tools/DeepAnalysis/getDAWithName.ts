import { Detecter, TAhkFileData } from '../../core/Detecter';
import { EMode } from '../../globalEnum';
import { kindCheck } from '../../provider/Def/kindCheck';
import { TDAMeta } from './TypeFnMeta';

export function getDAWithName(wordUP: string, mode: EMode): null | TDAMeta {
    const fsPaths: string[] = Detecter.getDocMapFile();

    for (const fsPath of fsPaths) {
        const AhkFileData: undefined | TAhkFileData = Detecter.getDocMap(fsPath);
        if (AhkFileData === undefined) continue;

        const { DAList } = AhkFileData;
        for (const DA of DAList) {
            if (
                kindCheck(mode, DA.kind)
                && DA.upName === wordUP
            ) {
                return DA;
            }
        }
    }
    return null;
}
