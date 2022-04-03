import { TGValMap } from '../globalEnum';

// key : vscode.Uri.fsPath,
// val : Map<
//          key: TValUpName
//          val : TVal
//          >
export const globalValMap = new Map<string, TGValMap>();

type TFsPath = string;

export function getGlobalValDef(valUpName: string): null | TFsPath {
    for (const [fsPath, GValMap] of globalValMap) {
        if (GValMap.has(valUpName)) return fsPath;
    }
    return null;
}
