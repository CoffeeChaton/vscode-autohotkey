/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/naming-convention */

import * as vscode from 'vscode';

type TA_MD_Map = ReadonlyMap<string, vscode.MarkdownString>;
type TA_snippet_list = readonly vscode.CompletionItem[];

const [A_VariablesMDMap, snippetStartWihA] = ((): [TA_MD_Map, TA_snippet_list] => {
    type TA_Element = {
        body: string;
        group: 'Date' | 'GUI' | 'Hotkeys' | 'Loop' | 'Misc.' | 'OS' | 'Script' | 'Setting' | 'Spec' | 'User Idle Time';
        uri: `https://www.autohotkey.com/docs/${string}`;
        // TODO add exp / doc ? https://www.autohotkey.com/docs/Variables.htm#BuiltIn
    };

    type TA_Variables = {
        [k in string]: TA_Element;
    };

    const A_Variables: TA_Variables = {
        A_AhkPath: {
            body: 'A_AhkPath',
            group: 'Script',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#AhkPath', // TODO let uri -> pos
        },
        A_AhkVersion: {
            body: 'A_AhkVersion',
            group: 'Script',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#prop',
        },
        A_AppData: {
            body: 'A_AppData',
            group: 'OS',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#os',
        },
        A_AppDataCommon: {
            body: 'A_AppDataCommon',
            group: 'OS',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#os',
        },
        A_Args: {
            body: 'A_Args',
            group: 'Script',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#prop',
        },
        A_AutoTrim: {
            body: 'A_AutoTrim',
            group: 'Setting',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        },
        A_BatchLines: {
            body: 'A_BatchLines',
            group: 'Setting',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        },
        A_CaretX: {
            body: 'A_CaretX',
            group: 'Misc.',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#misc',
        },
        A_CaretY: {
            body: 'A_CaretY',
            group: 'Misc.',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#misc',
        },
        A_ComSpec: {
            body: 'A_ComSpec',
            group: 'OS',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#os',
        },
        A_ComputerName: {
            body: 'A_ComputerName',
            group: 'OS',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#os',
        },
        A_ControlDelay: {
            body: 'A_ControlDelay',
            group: 'Setting',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        },
        A_CoordModeCaret: {
            body: 'A_CoordModeCaret',
            group: 'Setting',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        },
        A_CoordModeMenu: {
            body: 'A_CoordModeMenu',
            group: 'Setting',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        },
        A_CoordModeMouse: {
            body: 'A_CoordModeMouse',
            group: 'Setting',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        },
        A_CoordModePixel: {
            body: 'A_CoordModePixel',
            group: 'Setting',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        },
        A_CoordModeToolTip: {
            body: 'A_CoordModeToolTip',
            group: 'Setting',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        },
        A_Cursor: {
            body: 'A_Cursor',
            group: 'Misc.',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#misc',
        },
        A_DD: {
            body: 'A_DD',
            group: 'Date',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#date',
        },
        A_DDD: {
            body: 'A_DDD',
            group: 'Date',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#date',
        },
        A_DDDD: {
            body: 'A_DDDD',
            group: 'Date',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#date',
        },
        A_DefaultGui: {
            body: 'A_DefaultGui',
            group: 'GUI',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#gui',
        },
        A_DefaultListView: {
            body: 'A_DefaultListView',
            group: 'GUI',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#gui',
        },
        A_DefaultMouseSpeed: {
            body: 'A_DefaultMouseSpeed',
            group: 'Setting',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        },
        A_DefaultTreeView: {
            body: 'A_DefaultTreeView',
            group: 'GUI',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#gui',
        },
        A_Desktop: {
            body: 'A_Desktop',
            group: 'OS',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#os',
        },
        A_DesktopCommon: {
            body: 'A_DesktopCommon',
            group: 'OS',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#os',
        },
        A_DetectHiddenText: {
            body: 'A_DetectHiddenText',
            group: 'Setting',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        },
        A_DetectHiddenWindows: {
            body: 'A_DetectHiddenWindows',
            group: 'Setting',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        },
        A_EndChar: {
            body: 'A_EndChar',
            group: 'Hotkeys',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#h',
        },
        A_EventInfo: {
            body: 'A_EventInfo',
            group: 'GUI',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#gui',
        },
        A_ExitReason: {
            body: 'A_ExitReason',
            group: 'Script',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#prop',
        },
        A_FileEncoding: {
            body: 'A_FileEncoding',
            group: 'Setting',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        },
        A_FormatFloat: {
            body: 'A_FormatFloat',
            group: 'Setting',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        },
        A_FormatInteger: {
            body: 'A_FormatInteger',
            group: 'Setting',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        },
        A_Gui: {
            body: 'A_Gui',
            group: 'GUI',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#gui',
        },
        A_GuiControl: {
            body: 'A_GuiControl',
            group: 'GUI',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#gui',
        },
        A_GuiControlEvent: {
            body: 'A_GuiControlEvent',
            group: 'GUI',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#gui',
        },
        A_GuiEvent: {
            body: 'A_GuiEvent',
            group: 'GUI',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#gui',
        },
        A_GuiHeight: {
            body: 'A_GuiHeight',
            group: 'GUI',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#gui',
        },
        A_GuiWidth: {
            body: 'A_GuiWidth',
            group: 'GUI',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#gui',
        },
        A_GuiX: {
            body: 'A_GuiX',
            group: 'GUI',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#gui',
        },
        A_GuiY: {
            body: 'A_GuiY',
            group: 'GUI',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#gui',
        },
        A_Hour: {
            body: 'A_Hour',
            group: 'Date',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#date',
        },
        A_IPAddress1: {
            body: 'A_IPAddress1',
            group: 'OS',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#os',
        },
        A_IPAddress2: {
            body: 'A_IPAddress2',
            group: 'OS',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#os',
        },
        A_IPAddress3: {
            body: 'A_IPAddress3',
            group: 'OS',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#os',
        },
        A_IPAddress4: {
            body: 'A_IPAddress4',
            group: 'OS',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#os',
        },
        A_IconFile: {
            body: 'A_IconFile',
            group: 'Setting',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        },
        A_IconHidden: {
            body: 'A_IconHidden',
            group: 'Setting',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        },
        A_IconNumber: {
            body: 'A_IconNumber',
            group: 'Setting',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        },
        A_IconTip: {
            body: 'A_IconTip',
            group: 'Setting',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        },
        A_Index: {
            body: 'A_Index',
            group: 'Loop',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#loop',
        },
        A_Is64bitOS: {
            body: 'A_Is64bitOS',
            group: 'OS',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#os',
        },
        A_IsAdmin: {
            body: 'A_IsAdmin',
            group: 'OS',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#os',
        },
        A_IsCompiled: {
            body: 'A_IsCompiled',
            group: 'Script',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#prop',
        },
        A_IsCritical: {
            body: 'A_IsCritical',
            group: 'Setting',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        },
        A_IsPaused: {
            body: 'A_IsPaused',
            group: 'Setting',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        },
        A_IsSuspended: {
            body: 'A_IsSuspended',
            group: 'Setting',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        },
        A_IsUnicode: {
            body: 'A_IsUnicode',
            group: 'Script',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#prop',
        },
        A_KeyDelay: {
            body: 'A_KeyDelay',
            group: 'Setting',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        },
        A_KeyDelayPlay: {
            body: 'A_KeyDelayPlay',
            group: 'Setting',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        },
        A_KeyDuration: {
            body: 'A_KeyDuration',
            group: 'Setting',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        },
        A_KeyDurationPlay: {
            body: 'A_KeyDurationPlay',
            group: 'Setting',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        },
        A_Language: {
            body: 'A_Language',
            group: 'OS',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#os',
        },
        A_LastError: {
            body: 'A_LastError',
            group: 'Misc.',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#misc',
        },
        A_LineFile: {
            body: 'A_LineFile',
            group: 'Script',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#prop',
        },
        A_LineNumber: {
            body: 'A_LineNumber',
            group: 'Script',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#prop',
        },
        A_ListLines: {
            body: 'A_ListLines',
            group: 'Setting',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        },
        A_LoopField: {
            body: 'A_LoopField',
            group: 'Loop',
            uri: 'https://www.autohotkey.com/docs/commands/LoopParse.htm',
        },
        A_LoopFileAttrib: {
            body: 'A_LoopFileAttrib',
            group: 'Loop',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#loop',
        },
        A_LoopFileDir: {
            body: 'A_LoopFileDir',
            group: 'Loop',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#loop',
        },
        A_LoopFileExt: {
            body: 'A_LoopFileExt',
            group: 'Loop',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#loop',
        },
        A_LoopFileFullPath: {
            body: 'A_LoopFileFullPath',
            group: 'Loop',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#loop',
        },
        A_LoopFileLongPath: {
            body: 'A_LoopFileLongPath',
            group: 'Loop',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#loop',
        },
        A_LoopFileName: {
            body: 'A_LoopFileName',
            group: 'Loop',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#loop',
        },
        A_LoopFilePath: {
            body: 'A_LoopFilePath',
            group: 'Loop',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#loop',
        },
        A_LoopFileShortName: {
            body: 'A_LoopFileShortName',
            group: 'Loop',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#loop',
        },
        A_LoopFileShortPath: {
            body: 'A_LoopFileShortPath',
            group: 'Loop',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#loop',
        },
        A_LoopFileSize: {
            body: 'A_LoopFileSize',
            group: 'Loop',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#loop',
        },
        A_LoopFileSizeKB: {
            body: 'A_LoopFileSizeKB',
            group: 'Loop',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#loop',
        },
        A_LoopFileSizeMB: {
            body: 'A_LoopFileSizeMB',
            group: 'Loop',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#loop',
        },
        A_LoopFileTimeAccessed: {
            body: 'A_LoopFileTimeAccessed',
            group: 'Loop',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#loop',
        },
        A_LoopFileTimeCreated: {
            body: 'A_LoopFileTimeCreated',
            group: 'Loop',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#loop',
        },
        A_LoopFileTimeModified: {
            body: 'A_LoopFileTimeModified',
            group: 'Loop',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#loop',
        },
        A_LoopReadLine: {
            body: 'A_LoopReadLine',
            group: 'Loop',
            uri: 'https://www.autohotkey.com/docs/commands/LoopReadFile.htm',
        },
        A_LoopRegKey: {
            body: 'A_LoopRegKey',
            group: 'Loop',
            uri: 'https://www.autohotkey.com/docs/commands/LoopReg.htm#Remarks',
        },
        A_LoopRegName: {
            body: 'A_LoopRegName',
            group: 'Loop',
            uri: 'https://www.autohotkey.com/docs/commands/LoopReg.htm#Remarks',
        },
        A_LoopRegSubKey: {
            body: 'A_LoopRegSubKey',
            group: 'Loop',
            uri: 'https://www.autohotkey.com/docs/commands/LoopReg.htm#Remarks',
        },
        A_LoopRegTimeModified: {
            body: 'A_LoopRegTimeModified',
            group: 'Loop',
            uri: 'https://www.autohotkey.com/docs/commands/LoopReg.htm#Remarks',
        },
        A_LoopRegType: {
            body: 'A_LoopRegType',
            group: 'Loop',
            uri: 'https://www.autohotkey.com/docs/commands/LoopReg.htm#Remarks',
        },
        A_MM: {
            body: 'A_MM',
            group: 'Date',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#date',
        },
        A_MMM: {
            body: 'A_MMM',
            group: 'Date',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#date',
        },
        A_MMMM: {
            body: 'A_MMMM',
            group: 'Date',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#date',
        },
        A_MSec: {
            body: 'A_MSec',
            group: 'Date',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#date',
        },
        A_Min: {
            body: 'A_Min',
            group: 'Date',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#date',
        },
        A_MouseDelay: {
            body: 'A_MouseDelay',
            group: 'Setting',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        },
        A_MouseDelayPlay: {
            body: 'A_MouseDelayPlay',
            group: 'Setting',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        },
        A_MyDocuments: {
            body: 'A_MyDocuments',
            group: 'OS',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#os',
        },
        A_Now: {
            body: 'A_Now',
            group: 'Date',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#date',
        },
        A_NowUTC: {
            body: 'A_NowUTC',
            group: 'Date',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#date',
        },
        A_OSType: {
            body: 'A_OSType',
            group: 'OS',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#os',
        },
        A_OSVersion: {
            body: 'A_OSVersion',
            group: 'OS',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#os',
        },
        A_PriorHotkey: {
            body: 'A_PriorHotkey',
            group: 'Hotkeys',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#h',
        },
        A_PriorKey: {
            body: 'A_PriorKey',
            group: 'Hotkeys',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#h',
        },
        A_ProgramFiles: {
            body: 'A_ProgramFiles',
            group: 'OS',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#os',
        },
        A_Programs: {
            body: 'A_Programs',
            group: 'OS',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#os',
        },
        A_ProgramsCommon: {
            body: 'A_ProgramsCommon',
            group: 'OS',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#os',
        },
        A_PtrSize: {
            body: 'A_PtrSize',
            group: 'OS',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#os',
        },
        A_RegView: {
            body: 'A_RegView',
            group: 'Setting',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        },
        A_ScreenDPI: {
            body: 'A_ScreenDPI',
            group: 'OS',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#os',
        },
        A_ScreenHeight: {
            body: 'A_ScreenHeight',
            group: 'OS',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#os',
        },
        A_ScreenWidth: {
            body: 'A_ScreenWidth',
            group: 'OS',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#os',
        },
        A_ScriptDir: {
            body: 'A_ScriptDir',
            group: 'Script',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#prop',
        },
        A_ScriptFullPath: {
            body: 'A_ScriptFullPath',
            group: 'Script',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#prop',
        },
        A_ScriptHwnd: {
            body: 'A_ScriptHwnd',
            group: 'Script',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#prop',
        },
        A_ScriptName: {
            body: 'A_ScriptName',
            group: 'Script',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#prop',
        },
        A_Sec: {
            body: 'A_Sec',
            group: 'Date',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#date',
        },
        A_SendLevel: {
            body: 'A_SendLevel',
            group: 'Setting',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        },
        A_SendMode: {
            body: 'A_SendMode',
            group: 'Setting',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        },
        A_Space: {
            body: 'A_Space',
            group: 'Spec',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#Special_Characters',
        },
        A_StartMenu: {
            body: 'A_StartMenu',
            group: 'OS',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#os',
        },
        A_StartMenuCommon: {
            body: 'A_StartMenuCommon',
            group: 'OS',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#os',
        },
        A_Startup: {
            body: 'A_Startup',
            group: 'OS',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#os',
        },
        A_StartupCommon: {
            body: 'A_StartupCommon',
            group: 'OS',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#os',
        },
        A_StoreCapsLockMode: {
            body: 'A_StoreCapsLockMode',
            group: 'Setting',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        },
        A_StringCaseSense: {
            body: 'A_StringCaseSense',
            group: 'Setting',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        },
        A_Tab: {
            body: 'A_Tab',
            group: 'Spec',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#Special_Characters',
        },
        A_Temp: {
            body: 'A_Temp',
            group: 'OS',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#os',
        },
        A_ThisFunc: {
            body: 'A_ThisFunc',
            group: 'Script',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#prop',
        },
        A_ThisHotkey: {
            body: 'A_ThisHotkey',
            group: 'Hotkeys',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#h',
        },
        A_ThisLabel: {
            body: 'A_ThisLabel',
            group: 'Script',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#prop',
        },
        A_ThisMenu: {
            body: 'A_ThisMenu',
            group: 'Hotkeys',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#h',
        },
        A_ThisMenuItem: {
            body: 'A_ThisMenuItem',
            group: 'Hotkeys',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#h',
        },
        A_ThisMenuItemPos: {
            body: 'A_ThisMenuItemPos',
            group: 'Hotkeys',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#h',
        },
        A_TickCount: {
            body: 'A_TickCount',
            group: 'Date',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#date',
        },
        A_TimeIdle: {
            body: 'A_TimeIdle',
            group: 'User Idle Time',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#User_Idle_Time',
        },
        A_TimeIdleKeyboard: {
            body: 'A_TimeIdleKeyboard',
            group: 'User Idle Time',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#User_Idle_Time',
        },
        A_TimeIdleMouse: {
            body: 'A_TimeIdleMouse',
            group: 'User Idle Time',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#User_Idle_Time',
        },
        A_TimeIdlePhysical: {
            body: 'A_TimeIdlePhysical',
            group: 'User Idle Time',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#User_Idle_Time',
        },
        A_TimeSincePriorHotkey: {
            body: 'A_TimeSincePriorHotkey',
            group: 'Hotkeys',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#h',
        },
        A_TimeSinceThisHotkey: {
            body: 'A_TimeSinceThisHotkey',
            group: 'Hotkeys',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#h',
        },
        A_TitleMatchMode: {
            body: 'A_TitleMatchMode',
            group: 'Setting',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        },
        A_TitleMatchModeSpeed: {
            body: 'A_TitleMatchModeSpeed',
            group: 'Setting',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        },
        A_UserName: {
            body: 'A_UserName',
            group: 'OS',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#os',
        },
        A_WDay: {
            body: 'A_WDay',
            group: 'Date',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#date',
        },
        A_WinDelay: {
            body: 'A_WinDelay',
            group: 'Setting',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        },
        A_WinDir: {
            body: 'A_WinDir',
            group: 'OS',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#os',
        },
        A_WorkingDir: {
            body: 'A_WorkingDir',
            group: 'Script',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#prop',
        },
        A_YDay: {
            body: 'A_YDay',
            group: 'Date',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#date',
        },
        A_YWeek: {
            body: 'A_YWeek',
            group: 'Date',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#date',
        },
        A_YYYY: {
            body: 'A_YYYY',
            group: 'Date',
            uri: 'https://www.autohotkey.com/docs/Variables.htm#date',
        },
    };

    function A_Variables2Md(Element: TA_Element): vscode.MarkdownString {
        const {
            body,
            uri,
            group,
        } = Element;
        const md: vscode.MarkdownString = new vscode.MarkdownString('', true)
            .appendCodeblock(body, 'ahk')
            .appendMarkdown(group)
            .appendMarkdown('\n\n')
            .appendMarkdown(`[Read Doc](${uri})`);
        md.supportHtml = true;
        return md;
    }

    const map1 = new Map<string, vscode.MarkdownString>();
    const List2: vscode.CompletionItem[] = [];
    //
    for (const [k, v] of Object.entries(A_Variables)) {
        const md: vscode.MarkdownString = A_Variables2Md(v);
        map1.set(k.toUpperCase(), md);
        //
        const item: vscode.CompletionItem = new vscode.CompletionItem({
            label: k, // Left
            description: v.group, // Right
        });
        item.kind = vscode.CompletionItemKind.Variable; // icon of https://code.visualstudio.com/docs/editor/intellisense#_types-of-completions
        item.insertText = k;
        item.detail = 'Built-in Variables (neko-help)';
        item.documentation = md;
        //
        List2.push(item);
    }

    return [map1, List2];
})();

export function getSnippetStartWihA(PartStr: string): readonly vscode.CompletionItem[] {
    return PartStr.startsWith('A')
        ? snippetStartWihA
        : [];
}

export function hoverAVar(wordUp: string): vscode.MarkdownString | undefined {
    return A_VariablesMDMap.get(wordUp);
}
