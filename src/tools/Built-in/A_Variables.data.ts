/* eslint-disable max-lines */

type TElement = {
    body: `A_${string}`,
    group: 'Date' | 'GUI' | 'Hotkeys' | 'Loop' | 'Misc.' | 'OS' | 'Script' | 'Setting' | 'Spec' | 'User Idle Time',
    uri: `https://www.autohotkey.com/docs/${string}`,
    doc?: string, // TODO add doc
};

/**
 * after initialization clear
 */
export const AVariablesList: TElement[] = [
    {
        body: 'A_AhkPath',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#AhkPath',
        group: 'Script',
    },
    {
        body: 'A_AhkVersion',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#prop',
        group: 'Script',
    },
    {
        body: 'A_AppData',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#os',
        group: 'OS',
    },
    {
        body: 'A_AppDataCommon',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#os',
        group: 'OS',
    },
    {
        body: 'A_Args',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#prop',
        group: 'Script',
    },
    {
        body: 'A_AutoTrim',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        group: 'Setting',
    },
    {
        body: 'A_BatchLines',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        group: 'Setting',
    },
    {
        body: 'A_NumBatchLines',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#BatchLines',
        group: 'Setting',
        doc: 'The current value as set by SetBatchLines. Examples: 200 or 10ms (depending on format).',
    },
    {
        body: 'A_CaretX',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#misc',
        group: 'Misc.',
    },
    {
        body: 'A_CaretY',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#misc',
        group: 'Misc.',
    },
    {
        body: 'A_Clipboard',
        uri: 'https://www.autohotkey.com/docs/misc/Clipboard.htm',
        group: 'Misc.',
    },
    {
        body: 'A_ComSpec',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#os',
        group: 'OS',
    },
    {
        body: 'A_ComputerName',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#os',
        group: 'OS',
    },
    {
        body: 'A_ControlDelay',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        group: 'Setting',
    },
    {
        body: 'A_CoordModeCaret',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        group: 'Setting',
    },
    {
        body: 'A_CoordModeMenu',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        group: 'Setting',
    },
    {
        body: 'A_CoordModeMouse',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        group: 'Setting',
    },
    {
        body: 'A_CoordModePixel',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        group: 'Setting',
    },
    {
        body: 'A_CoordModeToolTip',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        group: 'Setting',
    },
    {
        body: 'A_Cursor',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#misc',
        group: 'Misc.',
    },
    {
        body: 'A_DD',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#date',
        group: 'Date',
    },
    {
        body: 'A_MDay',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#date',
        group: 'Date',
    },
    {
        body: 'A_DDD',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#date',
        group: 'Date',
    },
    {
        body: 'A_DDDD',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#date',
        group: 'Date',
    },
    {
        body: 'A_DefaultGui',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#gui',
        group: 'GUI',
    },
    {
        body: 'A_DefaultListView',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#gui',
        group: 'GUI',
    },
    {
        body: 'A_DefaultMouseSpeed',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        group: 'Setting',
    },
    {
        body: 'A_DefaultTreeView',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#gui',
        group: 'GUI',
    },
    {
        body: 'A_Desktop',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#os',
        group: 'OS',
    },
    {
        body: 'A_DesktopCommon',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#os',
        group: 'OS',
    },
    {
        body: 'A_DetectHiddenText',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        group: 'Setting',
    },
    {
        body: 'A_DetectHiddenWindows',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        group: 'Setting',
    },
    {
        body: 'A_EndChar',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#h',
        group: 'Hotkeys',
    },
    {
        body: 'A_EventInfo',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#gui',
        group: 'GUI',
    },
    {
        body: 'A_ExitReason',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#prop',
        group: 'Script',
    },
    {
        body: 'A_FileEncoding',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        group: 'Setting',
    },
    {
        body: 'A_FormatFloat',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        group: 'Setting',
    },
    {
        body: 'A_FormatInteger',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        group: 'Setting',
    },
    {
        body: 'A_Gui',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#gui',
        group: 'GUI',
    },
    {
        body: 'A_GuiControl',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#gui',
        group: 'GUI',
    },
    {
        body: 'A_GuiControlEvent',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#gui',
        group: 'GUI',
    },
    {
        body: 'A_GuiEvent',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#gui',
        group: 'GUI',
    },
    {
        body: 'A_GuiHeight',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#gui',
        group: 'GUI',
    },
    {
        body: 'A_GuiWidth',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#gui',
        group: 'GUI',
    },
    {
        body: 'A_GuiX',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#gui',
        group: 'GUI',
    },
    {
        body: 'A_GuiY',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#gui',
        group: 'GUI',
    },
    {
        body: 'A_Hour',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#date',
        group: 'Date',
    },
    {
        body: 'A_IPAddress1',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#os',
        group: 'OS',
    },
    {
        body: 'A_IPAddress2',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#os',
        group: 'OS',
    },
    {
        body: 'A_IPAddress3',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#os',
        group: 'OS',
    },
    {
        body: 'A_IPAddress4',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#os',
        group: 'OS',
    },
    {
        body: 'A_IconFile',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        group: 'Setting',
    },
    {
        body: 'A_IconHidden',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        group: 'Setting',
    },
    {
        body: 'A_IconNumber',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        group: 'Setting',
    },
    {
        body: 'A_IconTip',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        group: 'Setting',
    },
    {
        body: 'A_Index',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#loop',
        group: 'Loop',
    },
    {
        body: 'A_Is64bitOS',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#os',
        group: 'OS',
    },
    {
        body: 'A_IsAdmin',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#os',
        group: 'OS',
    },
    {
        body: 'A_IsCompiled',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#prop',
        group: 'Script',
    },
    {
        body: 'A_IsCritical',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        group: 'Setting',
    },
    {
        body: 'A_IsPaused',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        group: 'Setting',
    },
    {
        body: 'A_IsSuspended',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        group: 'Setting',
    },
    {
        body: 'A_IsUnicode',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#prop',
        group: 'Script',
    },
    {
        body: 'A_KeyDelay',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        group: 'Setting',
    },
    {
        body: 'A_KeyDelayPlay',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        group: 'Setting',
    },
    {
        body: 'A_KeyDuration',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        group: 'Setting',
    },
    {
        body: 'A_KeyDurationPlay',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        group: 'Setting',
    },
    {
        body: 'A_Language',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#os',
        group: 'OS',
    },
    {
        body: 'A_LastError',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#misc',
        group: 'Misc.',
    },
    {
        body: 'A_LineFile',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#prop',
        group: 'Script',
    },
    {
        body: 'A_LineNumber',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#prop',
        group: 'Script',
    },
    {
        body: 'A_ListLines',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        group: 'Setting',
    },
    {
        body: 'A_LoopField',
        uri: 'https://www.autohotkey.com/docs/commands/LoopParse.htm',
        group: 'Loop',
    },
    {
        body: 'A_LoopFileAttrib',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#loop',
        group: 'Loop',
    },
    {
        body: 'A_LoopFileDir',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#loop',
        group: 'Loop',
    },
    {
        body: 'A_LoopFileExt',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#loop',
        group: 'Loop',
    },
    {
        body: 'A_LoopFileFullPath',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#loop',
        group: 'Loop',
    },
    {
        body: 'A_LoopFileLongPath',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#loop',
        group: 'Loop',
    },
    {
        body: 'A_LoopFileName',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#loop',
        group: 'Loop',
    },
    {
        body: 'A_LoopFilePath',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#loop',
        group: 'Loop',
    },
    {
        body: 'A_LoopFileShortName',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#loop',
        group: 'Loop',
    },
    {
        body: 'A_LoopFileShortPath',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#loop',
        group: 'Loop',
    },
    {
        body: 'A_LoopFileSize',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#loop',
        group: 'Loop',
    },
    {
        body: 'A_LoopFileSizeKB',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#loop',
        group: 'Loop',
    },
    {
        body: 'A_LoopFileSizeMB',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#loop',
        group: 'Loop',
    },
    {
        body: 'A_LoopFileTimeAccessed',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#loop',
        group: 'Loop',
    },
    {
        body: 'A_LoopFileTimeCreated',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#loop',
        group: 'Loop',
    },
    {
        body: 'A_LoopFileTimeModified',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#loop',
        group: 'Loop',
    },
    {
        body: 'A_LoopReadLine',
        uri: 'https://www.autohotkey.com/docs/commands/LoopReadFile.htm',
        group: 'Loop',
    },
    {
        body: 'A_LoopRegKey',
        uri: 'https://www.autohotkey.com/docs/commands/LoopReg.htm#Remarks',
        group: 'Loop',
    },
    {
        body: 'A_LoopRegName',
        uri: 'https://www.autohotkey.com/docs/commands/LoopReg.htm#Remarks',
        group: 'Loop',
    },
    {
        body: 'A_LoopRegSubKey',
        uri: 'https://www.autohotkey.com/docs/commands/LoopReg.htm#Remarks',
        group: 'Loop',
    },
    {
        body: 'A_LoopRegTimeModified',
        uri: 'https://www.autohotkey.com/docs/commands/LoopReg.htm#Remarks',
        group: 'Loop',
    },
    {
        body: 'A_LoopRegType',
        uri: 'https://www.autohotkey.com/docs/commands/LoopReg.htm#Remarks',
        group: 'Loop',
    },
    {
        body: 'A_MM',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#date',
        group: 'Date',
    },
    {
        body: 'A_Mon',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#date',
        group: 'Date',
    },
    {
        body: 'A_MMM',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#date',
        group: 'Date',
    },
    {
        body: 'A_MMMM',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#date',
        group: 'Date',
    },
    {
        body: 'A_MSec',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#date',
        group: 'Date',
    },
    {
        body: 'A_Min',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#date',
        group: 'Date',
    },
    {
        body: 'A_MouseDelay',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        group: 'Setting',
    },
    {
        body: 'A_MouseDelayPlay',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        group: 'Setting',
    },
    {
        body: 'A_MyDocuments',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#os',
        group: 'OS',
    },
    {
        body: 'A_Now',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#date',
        group: 'Date',
    },
    {
        body: 'A_NowUTC',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#date',
        group: 'Date',
    },
    {
        body: 'A_OSType',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#os',
        group: 'OS',
    },
    {
        body: 'A_OSVersion',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#os',
        group: 'OS',
    },
    {
        body: 'A_PriorHotkey',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#h',
        group: 'Hotkeys',
    },
    {
        body: 'A_PriorKey',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#h',
        group: 'Hotkeys',
    },
    {
        body: 'A_ProgramFiles',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#os',
        group: 'OS',
    },
    {
        body: 'A_Programs',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#os',
        group: 'OS',
    },
    {
        body: 'A_ProgramsCommon',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#os',
        group: 'OS',
    },
    {
        body: 'A_PtrSize',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#os',
        group: 'OS',
    },
    {
        body: 'A_RegView',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        group: 'Setting',
    },
    {
        body: 'A_ScreenDPI',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#os',
        group: 'OS',
    },
    {
        body: 'A_ScreenHeight',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#os',
        group: 'OS',
    },
    {
        body: 'A_ScreenWidth',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#os',
        group: 'OS',
    },
    {
        body: 'A_ScriptDir',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#prop',
        group: 'Script',
    },
    {
        body: 'A_ScriptFullPath',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#prop',
        group: 'Script',
    },
    {
        body: 'A_ScriptHwnd',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#prop',
        group: 'Script',
    },
    {
        body: 'A_ScriptName',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#prop',
        group: 'Script',
    },
    {
        body: 'A_Sec',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#date',
        group: 'Date',
    },
    {
        body: 'A_SendLevel',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        group: 'Setting',
    },
    {
        body: 'A_SendMode',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        group: 'Setting',
    },
    {
        body: 'A_Space',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#Special_Characters',
        group: 'Spec',
    },
    {
        body: 'A_StartMenu',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#os',
        group: 'OS',
    },
    {
        body: 'A_StartMenuCommon',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#os',
        group: 'OS',
    },
    {
        body: 'A_Startup',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#os',
        group: 'OS',
    },
    {
        body: 'A_StartupCommon',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#os',
        group: 'OS',
    },
    {
        body: 'A_StoreCapsLockMode',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        group: 'Setting',
    },
    {
        body: 'A_StringCaseSense',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        group: 'Setting',
    },
    {
        body: 'A_Tab',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#Special_Characters',
        group: 'Spec',
    },
    {
        body: 'A_Temp',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#os',
        group: 'OS',
    },
    {
        body: 'A_ThisFunc',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#prop',
        group: 'Script',
    },
    {
        body: 'A_ThisHotkey',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#h',
        group: 'Hotkeys',
    },
    {
        body: 'A_ThisLabel',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#prop',
        group: 'Script',
    },
    {
        body: 'A_ThisMenu',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#h',
        group: 'Hotkeys',
    },
    {
        body: 'A_ThisMenuItem',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#h',
        group: 'Hotkeys',
    },
    {
        body: 'A_ThisMenuItemPos',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#h',
        group: 'Hotkeys',
    },
    {
        body: 'A_TickCount',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#date',
        group: 'Date',
    },
    {
        body: 'A_TimeIdle',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#User_Idle_Time',
        group: 'User Idle Time',
    },
    {
        body: 'A_TimeIdleKeyboard',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#User_Idle_Time',
        group: 'User Idle Time',
    },
    {
        body: 'A_TimeIdleMouse',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#User_Idle_Time',
        group: 'User Idle Time',
    },
    {
        body: 'A_TimeIdlePhysical',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#User_Idle_Time',
        group: 'User Idle Time',
    },
    {
        body: 'A_TimeSincePriorHotkey',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#h',
        group: 'Hotkeys',
    },
    {
        body: 'A_TimeSinceThisHotkey',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#h',
        group: 'Hotkeys',
    },
    {
        body: 'A_TitleMatchMode',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        group: 'Setting',
    },
    {
        body: 'A_TitleMatchModeSpeed',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        group: 'Setting',
    },
    {
        body: 'A_UserName',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#os',
        group: 'OS',
    },
    {
        body: 'A_WDay',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#date',
        group: 'Date',
    },
    {
        body: 'A_WinDelay',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#settings',
        group: 'Setting',
    },
    {
        body: 'A_WinDir',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#os',
        group: 'OS',
    },
    {
        body: 'A_WorkingDir',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#prop',
        group: 'Script',
    },
    {
        body: 'A_InitialWorkingDir',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#InitialWorkingDir',
        group: 'Script',
    },
    {
        body: 'A_YDay',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#date',
        group: 'Date',
    },
    {
        body: 'A_YWeek',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#date',
        group: 'Date',
    },
    {
        body: 'A_YYYY',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#YYYY',
        group: 'Date',
        doc: 'Current 4-digit year (e.g. 2004). Synonymous with `A_Year`.',
    },
    {
        body: 'A_Year',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#YYYY',
        group: 'Date',
        doc: 'Current 4-digit year (e.g. 2004). Synonymous with `A_YYYY`.',
    },
];
