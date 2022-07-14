import { CAhkCase, CAhkDefault, CAhkSwitch } from '../AhkSymbol/CAhkSwitch';
import { getCaseName, getSwitchName } from '../provider/SymbolProvider/getSwitchCaseName';
import { getRange } from '../tools/range/getRange';
import { getRangeCaseBlock } from '../tools/range/getRangeCaseBlock';
import { getRangeOfLine } from '../tools/range/getRangeOfLine';
import { getChildren, TFuncInput } from './getChildren';
import { ParserLine } from './ParserTools/ParserLine';

export const ParserBlock = {
    getCaseBlock(FuncInput: TFuncInput): null | CAhkCase {
        const { lStr, fistWordUp } = FuncInput;

        if (fistWordUp !== 'CASE') return null;
        if (!lStr.includes(':')) return null;

        const {
            RangeEndLine,
            defStack,
            line,
            DocStrMap,
            document,
            GValMap,
            textRaw,
        } = FuncInput;

        const name: string | null = getCaseName(DocStrMap[line].textRaw, lStr);
        if (name === null) return null;

        const range = getRangeCaseBlock(DocStrMap, line, line, RangeEndLine, lStr);
        const ch = getChildren<CAhkCase>(
            [ParserBlock.getSwitchBlock, ParserLine],
            {
                DocStrMap,
                RangeStartLine: range.start.line + 1,
                RangeEndLine: range.end.line,
                defStack,
                document,
                GValMap,
            },
        );

        return new CAhkCase({
            name,
            range,
            selectionRange: getRangeOfLine(line, lStr, textRaw.length),
            uri: document.uri,
            ch,
        });
    },

    getDefaultBlock(FuncInput: TFuncInput): null | CAhkDefault {
        const { lStr, fistWordUp } = FuncInput;

        if (fistWordUp !== 'DEFAULT') return null;
        if (!(/^default\b\s*:/iu).test(lStr.trim())) return null;

        const {
            RangeEndLine,
            defStack,
            line,
            DocStrMap,
            document,
            GValMap,
            textRaw,
        } = FuncInput;

        const range = getRangeCaseBlock(DocStrMap, line, line, RangeEndLine, lStr);
        const ch = getChildren<CAhkDefault>(
            [ParserBlock.getSwitchBlock, ParserLine],
            {
                DocStrMap,
                RangeStartLine: range.start.line + 1,
                RangeEndLine: range.end.line,
                defStack,
                document,
                GValMap,
            },
        );

        return new CAhkDefault({
            range,
            selectionRange: getRangeOfLine(line, lStr, textRaw.length),
            uri: document.uri,
            ch,
        });
    },

    getSwitchBlock(FuncInput: TFuncInput): null | CAhkSwitch {
        if (FuncInput.fistWordUp !== 'SWITCH') return null;

        const {
            DocStrMap,
            line,
            RangeEndLine,
            defStack,
            lStr,
            document,
            GValMap,
            textRaw,
        } = FuncInput;

        const range = getRange(DocStrMap, line, line, RangeEndLine);

        const ch = getChildren<CAhkSwitch>(
            [ParserBlock.getCaseBlock, ParserBlock.getDefaultBlock],
            {
                DocStrMap,
                RangeStartLine: range.start.line + 1,
                RangeEndLine: range.end.line,
                defStack,
                document,
                GValMap,
            },
        );

        return new CAhkSwitch({
            name: `Switch ${getSwitchName(lStr)}`,
            range,
            selectionRange: getRangeOfLine(line, lStr, textRaw.length),
            uri: document.uri,
            ch,
        });
    },
} as const;
