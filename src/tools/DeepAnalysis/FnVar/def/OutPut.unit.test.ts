/* cSpell:disable */
import { OutputCommandBaseMap } from './OutputBaseMap';
import { OutputCommandPlusMap } from './OutputPlusMap';

/**
 * source of https://github.com/Lexikos/Scintillua-ahk/blob/master/ahk1.lua
 */
const outBase = {
    ControlGet: 'OSSSSSSS',
    ControlGetFocus: 'OSSSS',
    ControlGetText: 'OSSSSS',
    DriveGet: 'OSS',
    DriveSpaceFree: 'OS',
    EnvAdd: 'OES',
    EnvDiv: 'OE',
    EnvGet: 'OS',
    EnvMult: 'OE',
    EnvSub: 'OES',
    FileGetAttrib: 'OS',
    FileGetSize: 'OSS',
    FileGetTime: 'OSS',
    FileGetVersion: 'OS',
    FileRead: 'OS',
    FileReadLine: 'OSE',
    FileSelectFile: 'OSSSS',
    FileSelectFolder: 'OSES',
    FormatTime: 'OSS',
    GetKeyState: 'OSS',
    GuiControlGet: 'OSSS',
    IniRead: 'OSSSS',
    Input: 'OSSS',
    InputBox: 'OSSSEEEESES',
    PixelGetColor: 'OEES',
    Random: 'OEE',
    RegRead: 'OSSS',
    SetEnv: 'OS',
    SoundGet: 'OSSE',
    SoundGetWaveVolume: 'OE',
    StatusBarGetText: 'OESSSS',
    StringGetPos: 'OISSE',
    StringLeft: 'OIE',
    StringLen: 'OI',
    StringLower: 'OIS',
    StringMid: 'OIEES',
    StringReplace: 'OISSS',
    StringRight: 'OIE',
    StringTrimLeft: 'OIE',
    StringTrimRight: 'OIE',
    StringUpper: 'OIS',
    SysGet: 'OSSS',
    Transform: 'OSSS',
    WinGet: 'OSSSSS',
    WinGetActiveTitle: 'O',
    WinGetClass: 'OSSSS',
    WinGetText: 'OSSSS',
    WinGetTitle: 'OSSSS',
} as const;

/**
 * source of https://github.com/Lexikos/Scintillua-ahk/blob/master/ahk1.lua
 */
const outPlus = {
    ControlGetPos: 'OOOOSSSSS',
    FileGetShortcut: 'SOOOOOOO',
    ImageSearch: 'OOEEEES',
    MouseGetPos: 'OOOOE',
    PixelSearch: 'OOEEEEEES',
    Run: 'SSSO',
    RunWait: 'SSSO',
    SplitPath: 'IOOOOO',
    WinGetActiveStats: 'OOOOO',
    WinGetPos: 'OOOOSSSS',
} as const;

function O2Arr(defStr: string): number[] {
    const arr: number[] = [];

    for (const [i, s] of [...defStr].entries()) {
        if (s === 'O') {
            arr.push(i + 1);
        }
    }
    return arr;
}

describe('check outList Command cover', () => {
    it('exp: OutPut Base', (): void => {
        expect.hasAssertions();

        const errList: [string, string][] = [];
        for (const onigMsg of Object.entries(outBase)) {
            const [key, _value] = onigMsg;
            const defOffset: number | undefined = OutputCommandBaseMap.get(key.toUpperCase());
            if (defOffset === undefined) {
                errList.push(onigMsg);
                continue;
            }
        }

        if (errList.length > 0) {
            console.error('🚀 ~ OutPut Base ~ errList', errList);
        }

        expect(errList.length === 0).toBeTruthy();
    });

    it('exp: OutPut Plus', (): void => {
        expect.hasAssertions();

        const errList: string[] = [];
        for (const [key, defStr] of Object.entries(outPlus)) {
            const defList: number[] | undefined = OutputCommandPlusMap.get(key.toUpperCase());
            if (defList === undefined) {
                errList.push(key);
                continue;
            }

            const arr: number[] = O2Arr(defStr);

            expect(arr).toStrictEqual(defList);
        }

        if (errList.length > 0) {
            console.error('🚀 ~ OutPut Plus ~ errList', errList);
        }

        expect(errList.length === 0).toBeTruthy();
    });
});
