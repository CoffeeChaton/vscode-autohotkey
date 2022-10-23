/* eslint-disable no-magic-numbers */
/* cSpell:disable */
import type { TGetFnDefNeed } from '../TFnVarDef';
import { getValMeta } from './getValMeta';
import type { TScanData } from './spiltCommandAll';
import { spiltCommandAll } from './spiltCommandAll';

function pickCommand(needArr: number[], AllCut: TScanData[]): TScanData[] {
    const needPartScan: TScanData[] = [];

    for (const make of needArr) {
        const ScanData: TScanData | undefined = AllCut[make] as TScanData | undefined; // some arg is optional
        if (ScanData === undefined) break;
        if (!(/^\w+/u).test(ScanData.RawNameNew)) continue; // TODO diag This!! Output usually not need %
        needPartScan.push(ScanData);
    }

    return needPartScan;
}

// {_T("FileGetShortcut"), 1, 8, 8 H, NULL} // Filespec, OutTarget, OutDir, OutArg, OutDescrip, OutIcon, OutIconIndex, OutShowState.

const OutputVarCommandMap: ReadonlyMap<string, number[]> = new Map([
    // FileGetShortcut, LinkFile , OutTarget, OutDir, OutArgs, OutDescription, OutIcon, OutIconNum, OutRunState
    ['FILEGETSHORTCUT', [2, 3, 4, 5, 6, 7, 8]],
    ['IMAGESEARCH', [1, 2]], // ImageSearch, OutputVarX, OutputVarY
    ['MOUSEGETPOS', [1, 2, 3, 4]], // MouseGetPos , OutputVarX, OutputVarY, OutputVarWin, OutputVarControl
    ['PIXELSEARCH', [1, 2]], // PixelSearch, OutputVarX, OutputVarY
    ['RUN', [4]], // Run, Target , WorkingDir, Options, OutputVarPID
    ['RUNWAIT', [4]], // RunWait, Target , WorkingDir, Options, OutputVarPID
    ['SPLITPATH', [2, 3, 4, 5, 6]], // SplitPath, InputVar , OutFileName, OutDir, OutExtension, OutNameNoExt, OutDrive
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
export function OutputVarCommandPlus(arg: TGetFnDefNeed, fistWordUp: string, fistWordUpCol: number): null {
    const needArr: number[] | undefined = OutputVarCommandMap.get(fistWordUp);
    if (needArr === undefined) return null;

    const {
        lStr,
        line,
        paramMap,
        GValMap,
        valMap,
        lineComment,
        fnMode,
    } = arg;

    const strF: string = lStr
        .slice(fistWordUpCol + fistWordUp.length)
        .replace(/^\s*,?/u, `${fistWordUp},`)
        .padStart(lStr.length, ' ');

    for (const { RawNameNew, lPos } of pickCommand(needArr, spiltCommandAll(strF))) {
        const UpName: string = RawNameNew.toUpperCase();
        if (paramMap.has(UpName) || GValMap.has(UpName)) continue;

        valMap.set(
            UpName,
            getValMeta({
                line,
                character: lPos,
                RawName: RawNameNew,
                valMap,
                lineComment,
                fnMode,
            }),
        );
    }

    return null;
}

// not plan to support
// GuiControl ,, ControlID , value https://www.autohotkey.com/docs/commands/GuiControl.htm#Blank

// OK
// FileGetShortcut, LinkFile , OutTarget, OutDir, OutArgs, OutDescription, OutIcon, OutIconNum, OutRunState
// ImageSearch, OutputVarX, OutputVarY
// MouseGetPos , OutputVarX, OutputVarY, OutputVarWin, OutputVarControl
// PixelSearch, OutputVarX, OutputVarY
// Run, Target , WorkingDir, Options, OutputVarPID
// RunWait, Target , WorkingDir, Options, OutputVarPID
// SplitPath, InputVar , OutFileName, OutDir, OutExtension, OutNameNoExt, OutDrive
