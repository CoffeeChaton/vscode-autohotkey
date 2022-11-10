/* eslint-disable no-magic-numbers */

/**
 * @param cmd string -> upCaseString
 * @return number[] of outPutList
 *
 * ```ahk
 * ControlGetPos , OutX, OutY, OutWidth, OutHeight, Control, WinTitle, WinText, ExcludeTitle, ExcludeText
 * FileGetShortcut, LinkFile , OutTarget, OutDir, OutArgs, OutDescription, OutIcon, OutIconNum, OutRunState
 * ImageSearch, OutputVarX, OutputVarY
 * MouseGetPos , OutputVarX, OutputVarY, OutputVarWin, OutputVarControl
 * PixelSearch, OutputVarX, OutputVarY
 * Run, Target , WorkingDir, Options, OutputVarPID
 * RunWait, Target , WorkingDir, Options, OutputVarPID
 * SplitPath, InputVar , OutFileName, OutDir, OutExtension, OutNameNoExt, OutDrive
 * WinGetActiveStats, OutTitle, OutWidth, OutHeight, OutX, OutY
 * WinGetPos , OutX, OutY, OutWidth, OutHeight, WinTitle, WinText, ExcludeTitle, ExcludeText
 * ```
 *
 * ref:
 * ```c++
 * {_T("FileGetShortcut"), 1, 8, 8 H, NULL} // Filespec, OutTarget, OutDir, OutArg, OutDescription, OutIcon, OutIconIndex, OutShowState.
 * ```
 */
export const OutputCommandPlusMap: ReadonlyMap<string, number[]> = new Map([
    ['CONTROLGETPOS', [1, 2, 3, 4]], // ControlGetPos , OutX, OutY, OutWidth, OutHeight
    // eslint-disable-next-line max-len
    ['FILEGETSHORTCUT', [2, 3, 4, 5, 6, 7, 8]], // FileGetShortcut, LinkFile , OutTarget, OutDir, OutArgs, OutDescription, OutIcon, OutIconNum, OutRunState
    ['IMAGESEARCH', [1, 2]], // ImageSearch, OutputVarX, OutputVarY
    ['MOUSEGETPOS', [1, 2, 3, 4]], // MouseGetPos , OutputVarX, OutputVarY, OutputVarWin, OutputVarControl
    ['PIXELSEARCH', [1, 2]], // PixelSearch, OutputVarX, OutputVarY
    ['RUN', [4]], // Run, Target , WorkingDir, Options, OutputVarPID
    ['RUNWAIT', [4]], // RunWait, Target , WorkingDir, Options, OutputVarPID
    ['SPLITPATH', [2, 3, 4, 5, 6]], // SplitPath, InputVar , OutFileName, OutDir, OutExtension, OutNameNoExt, OutDrive
    ['WINGETACTIVESTATS', [1, 2, 3, 4, 5]], // WinGetActiveStats, OutTitle, OutWidth, OutHeight, OutX, OutY
    ['WINGETPOS', [1, 2, 3, 4]], // WinGetPos , OutX, OutY, OutWidth, OutHeight
]);
