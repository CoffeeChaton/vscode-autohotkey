/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,10,60,1000] }] */
import { getGlobalValDef } from '../../core/getGlobalValDef';
import {
    EValType,
    TAhkSymbol,
    TGetDefType,
    TGetTypeInput,
    TMapLineType,
    TRunValType2,
    TTokenStream,
} from '../../globalEnum';
import { fnModeToValType } from '../../tools/Func/fnModeToValType';
import { getCommentOfLine } from '../../tools/getCommentOfLine';
import { getLineValDef } from '../../tools/getLineValDef';
import { ahkValDefRegex } from '../../tools/regexTools';
import { ClassWm } from '../../tools/wm';

const wm = new ClassWm<TAhkSymbol, TMapLineType>(10 * 60 * 1000, 'getTypeList', 60);

function getTypeList({
    DocStrMap,
    regex,
    ahkSymbol,
}: TGetTypeInput): TMapLineType {
    const oldMap = wm.getWm(ahkSymbol);
    if (oldMap) return oldMap;

    const TypeList: ([RegExp, TRunValType2])[] = [
        [/^\s*local\s/iu, EValType.local],
        [/^\s*global\s/iu, EValType.global],
        [/^\s*Static\s/iu, EValType.Static],
    ];

    let Offset = 0;
    const v = new Map() as TMapLineType;
    for (const { lStr } of DocStrMap) {
        if (lStr.search(regex) > -1) {
            for (const [reg, mode] of TypeList) {
                if (reg.test(lStr)) {
                    v.set(Offset, mode);
                    break;
                }
            }
            if ((/^\s*,/u).test(lStr)) {
                const lastVal = v.get(Offset - 1);
                if (lastVal) v.set(Offset, lastVal);
            }
        }
        Offset++;
    }
    return wm.setWm(ahkSymbol, v);
}

function hasAssignment(DocStrMap: TTokenStream, word: string): [boolean, string[]] {
    const AssignmentReg = ahkValDefRegex(word);
    let tf = false;
    const commentList: string[] = [];
    for (const { lStr, textRaw } of DocStrMap) {
        if (AssignmentReg.test(lStr)) {
            tf = true;
            const c = getCommentOfLine({ lStr, textRaw });
            if (c) commentList.push(c);
        }
    }
    return [tf, commentList];
}

export function getDefType({
    fnMode,
    DocStrMap,
    regex,
    ahkSymbol,
    word,
}: TGetDefType): [TRunValType2, string[]] | null {
    const typeList = getTypeList({ DocStrMap, regex, ahkSymbol });
    for (const [Offset, mode] of typeList) {
        const { lStr } = DocStrMap[Offset];
        const { textRaw } = DocStrMap[Offset];
        if (regex.test(getLineValDef(lStr).join(', '))) {
            const commentList = getCommentOfLine({ lStr, textRaw }) ?? '';
            return [mode, [commentList]];
        }
    }

    const isGlobal = getGlobalValDef(regex);
    if (isGlobal) return [EValType.global, [isGlobal.fsPath]];

    const [isVal, commentList] = hasAssignment(DocStrMap, word);
    if (!isVal) return null;

    const valType = fnModeToValType(fnMode);
    return [valType, commentList];
}
