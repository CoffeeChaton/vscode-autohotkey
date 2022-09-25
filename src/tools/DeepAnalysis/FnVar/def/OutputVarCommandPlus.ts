/* eslint-disable max-len */
/* eslint-disable no-magic-numbers */
/* cSpell:disable */
import * as vscode from 'vscode';
import type { TValMetaIn } from '../../../../AhkSymbol/CAhkFunc';
import { FindExprDelim } from '../../../zFromCpp/FindExprDelim';
import type { TGetFnDefNeed } from '../TFnVarDef';
import { wrapFnValDef } from './wrapFnValDef';

type TScanData = {
    name: string;
    lPos: number;
};

function spiltCommandAll(lStr: string): TScanData[] {
    const lStrLen = lStr.length;

    const AllCut: TScanData[] = [];
    let make = -1;
    do {
        const oldMake = make + 1;
        make = FindExprDelim(lStr, ',', make + 1);
        const partStr: string = lStr.slice(oldMake, make);
        const name: string = partStr.trim();

        AllCut.push({
            name,
            lPos: oldMake + partStr.indexOf(name),
        });
    } while (make !== lStrLen);

    return AllCut;
}

function getNeedPartScan(needArr: TNeedArray, AllCut: TScanData[]): TScanData[] {
    const needPartScan: TScanData[] = [];

    for (const make of needArr) {
        const ScanData: TScanData | undefined = AllCut[make] as TScanData | undefined;
        if (ScanData === undefined) break;
        if (!(/^\w+/u).test(ScanData.name)) continue; // TODO diag This!!
        needPartScan.push(ScanData);
    }

    return needPartScan;
}

type TNeedArray = number[];
function spiltCommand(arg: TGetFnDefNeed, needArr: TNeedArray): void {
    const {
        lStr,
        line,
        paramMap,
        GValMap,
        valMap,
        lineComment,
    } = arg;

    const AllCut: TScanData[] = spiltCommandAll(lStr);
    const needPartScan: TScanData[] = getNeedPartScan(needArr, AllCut);

    for (const { name, lPos } of needPartScan) {
        const UpName: string = name.toUpperCase();
        if (paramMap.has(UpName) || GValMap.has(UpName)) continue;

        const value: TValMetaIn = wrapFnValDef({
            RawNameNew: name,
            valMap,
            defRange: new vscode.Range(new vscode.Position(line, lPos), new vscode.Position(line, lPos + name.length)),
            lineComment,
        });

        valMap.set(UpName, value);
    }
}

type TFn = (arg: TGetFnDefNeed, needArr: TNeedArray) => void;

// {_T("FileGetShortcut"), 1, 8, 8 H, NULL} // Filespec, OutTarget, OutDir, OutArg, OutDescrip, OutIcon, OutIconIndex, OutShowState.

const OutputVarCommandMap: ReadonlyMap<string, [TFn, TNeedArray] | undefined> = new Map([
    ['FILEGETSHORTCUT', [spiltCommand, [2, 3, 4, 5, 6, 7, 8]]], // FileGetShortcut, LinkFile , OutTarget, OutDir, OutArgs, OutDescription, OutIcon, OutIconNum, OutRunState
    ['IMAGESEARCH', [spiltCommand, [1, 2]]], // ImageSearch, OutputVarX, OutputVarY
    ['MOUSEGETPOS', [spiltCommand, [1, 2, 3, 4]]], // MouseGetPos , OutputVarX, OutputVarY, OutputVarWin, OutputVarControl
    ['PIXELSEARCH', [spiltCommand, [1, 2]]], // PixelSearch, OutputVarX, OutputVarY
    ['RUN', [spiltCommand, [4]]], // Run, Target , WorkingDir, Options, OutputVarPID
    ['RUNWAIT', [spiltCommand, [4]]], // RunWait, Target , WorkingDir, Options, OutputVarPID
    ['SPLITPATH', [spiltCommand, [2, 3, 4, 5, 6]]], // SplitPath, InputVar , OutFileName, OutDir, OutExtension, OutNameNoExt, OutDrive
]);

/**
 * OutputVar
 *
 * - FileGetShortcut, LinkFile , OutTarget, OutDir, OutArgs, OutDescription, OutIcon, OutIconNum, OutRunState
 * - ImageSearch, OutputVarX, OutputVarY
 * - MouseGetPos , OutputVarX, OutputVarY, OutputVarWin, OutputVarControl
 * - PixelSearch, OutputVarX, OutputVarY
 * - Run, Target , WorkingDir, Options, OutputVarPID
 * - RunWait, Target , WorkingDir, Options, OutputVarPID
 * - SplitPath, InputVar , OutFileName, OutDir, OutExtension, OutNameNoExt, OutDrive
 */
export function OutputVarCommandPlus(arg: TGetFnDefNeed, fistWordUp: string): null {
    const match: [TFn, TNeedArray] | undefined = OutputVarCommandMap.get(fistWordUp);
    if (match === undefined) return null;
    //
    const [fn, needArr] = match;
    fn(arg, needArr);
    return null;
}
