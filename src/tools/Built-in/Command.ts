/* eslint-disable max-lines */
/* eslint-disable no-template-curly-in-string */
/* eslint-disable max-len */
/* cSpell:disable */
import * as vscode from 'vscode';

export const CommandList = [
    'AUTOTRIM',
    'BLOCKINPUT',
    'CLIPWAIT',
    'CONTROL',
    'CONTROLCLICK',
    'CONTROLFOCUS',
    'CONTROLGET',
    'CONTROLGETFOCUS',
    'CONTROLGETPOS',
    'CONTROLGETTEXT',
    'CONTROLMOVE',
    'CONTROLSEND',
    'CONTROLSENDRAW',
    'CONTROLSETTEXT',
    'COORDMODE',
    'CRITICAL',
    'DETECTHIDDENTEXT',
    'DETECTHIDDENWINDOWS',
    'DRIVE',
    'DRIVEGET',
    'DRIVESPACEFREE',
    'ENVADD',
    'ENVGET',
    'ENVSET',
    'ENVSUB',
    'EXIT',
    'FORMATTIME',
    'GROUPACTIVATE',
    'GUI',
    'GUICONTROL',
    'GUICONTROLGET',
    'HOTKEY',
    'IFMSGBOX',
    'IMAGESEARCH',
    'INIDELETE',
    'INIREAD',
    'INIWRITE',
    'INPUT',
    'INPUTBOX',
    'KEYHISTORY',
    'KEYWAIT',
    'LISTLINES',
    'MENU',
    'MOUSECLICK',
    'MOUSECLICKDRAG',
    'MOUSEGETPOS',
    'MOUSEMOVE',
    'MSGBOX',
    'OUTPUTDEBUG',
    'PIXELGETCOLOR',
    'PIXELSEARCH',
    'POSTMESSAGE',
    'PROCESS',
    'RANDOM',
    'REGDELETE',
    'REGREAD',
    'REGWRITE',
    'RUN',
    'RUNAS',
    'RUNWAIT',
    'SEND',
    'SENDEVENT',
    'SENDINPUT',
    'SENDLEVEL',
    'SENDMESSAGE',
    'SENDMODE',
    'SENDPLAY',
    'SENDRAW',
    'SETBATCHLINES',
    'SETCAPSLOCKSTATE',
    'SETCONTROLDELAY',
    'SETDEFAULTMOUSESPEED',
    'SETKEYDELAY',
    'SETMOUSEDELAY',
    'SETNUMLOCKSTATE',
    'SETREGVIEW',
    'SETSCROLLLOCKSTATE',
    'SETSTORECAPSLOCKMODE',
    'SETTIMER',
    'SETTITLEMATCHMODE',
    'SETWINDELAY',
    'SETWORKINGDIR',
    'SHUTDOWN',
    'SORT',
    'SOUNDBEEP',
    'SOUNDGET',
    'SOUNDGETWAVEVOLUME',
    'SOUNDPLAY',
    'SOUNDSET',
    'SOUNDSETWAVEVOLUME',
    'SPLITPATH',
    'STATUSBARGETTEXT',
    'STATUSBARWAIT',
    'STRINGCASESENSE',
    'SUSPEND',
    'SYSGET',
    'THREAD',
    'TOOLTIP',
    'TRAYTIP',
    'URLDOWNLOADTOFILE',
] as const;

type TCommandKeyList = typeof CommandList[number];
type TCommandElement = { // FIXME: use DeepReadonly
    keyRawName: string;
    body: string;
    doc: string;

    recommended?: boolean;
    link?: string;
    exp?: string[];
};
type TLineCommand = {
    [k in TCommandKeyList]: TCommandElement;
};

export const LineCommand: TLineCommand = {
    AUTOTRIM: {
        keyRawName: 'AutoTrim',
        body: 'AutoTrim, ${1:|On,Off|}',
        doc: 'Determines whether [traditional assignments](https://www.autohotkey.com/docs/commands/SetEnv.htm "Deprecated. New scripts should use Var := Value instead.") like `Var1 = %Var2%` omit spaces and tabs from the beginning and end of _Var2_.',
        recommended: false,
        link: 'https://www.autohotkey.com/docs/commands/AutoTrim.htm',
        exp: [
            'AutoTrim, OnOff',
            '; (default) On: tabs and spaces at the beginning and end of a Var2 are omitted from Var1 ',
            ';               Var1 = %Var2%',
            ';           Off: Such tabs and spaces are not omitted.',
        ],
    },
    BLOCKINPUT: {
        keyRawName: 'BlockInput',
        body: 'BlockInput, ${1:|On,Off,Send,Mouse,SendAndMouse,Default,MouseMove,MouseMoveOff|}',
        doc: 'Disables or enables the user\'s ability to interact with the computer via keyboard and mouse.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/BlockInput.htm',
        exp: [
            'BlockInput, OnOff',
            ';  On : The user is prevented from interacting with the computer (mouse and keyboard input has no effect).',
            ';  Off: Input is re-enabled.',
            'BlockInput, SendMouse',
            ';  Send',
            ';  Mouse',
            ';  SendAndMouse',
            ';  Default',
            'BlockInput, MouseMove  ; [v1.0.43.11+]',
            ';  MouseMove',
            ';  MouseMoveOff',
        ],
    },
    CLIPWAIT: {
        keyRawName: 'ClipWait',
        body: 'ClipWait, ${1:Timeout}, ${2:False|True]}',
        doc: 'Waits until the [clipboard](https://www.autohotkey.com/docs/misc/Clipboard.htm) contains data.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/ClipWait.htm',
        exp: [
            'ClipWait , Timeout, WaitForAnyData',
            ';  Timeout : If omitted, the command will wait indefinitely.',
            ';            Else wait sec',
            ';  WaitForAnyData : ',
            '',
        ],
    },
    // FIXME:
    CONTROL: {
        keyRawName: 'Control',
        body:
            'Control, ${1:Cmd [}, ${2:Value}, ${3:Control}, ${4:WinTitle}, ${5:WinText}, ${6:ExcludeTitle}, ${7:ExcludeText]}',
        doc: 'Makes a variety of changes to a control.',
    },
    CONTROLCLICK: {
        keyRawName: 'ControlClick',
        body:
            'ControlClick, ${1:[Control-or-Pos}, ${2:WinTitle}, ${3:WinText}, ${4:WhichButton}, ${5:ClickCount}, ${6:Options}, ${7:ExcludeTitle}, ${8:ExcludeText]}',
        doc: 'Sends a mouse button or mouse wheel event to a control.',
    },
    CONTROLFOCUS: {
        keyRawName: 'ControlFocus',
        body: 'ControlFocus, ${1:[ Control}, ${2:WinTitle}, ${3:WinText}, ${4:ExcludeTitle}, ${5:ExcludeText]}',
        doc: 'Sets input focus to a given control on a window.',
    },
    CONTROLGET: {
        keyRawName: 'ControlGet',
        body:
            'ControlGet, ${1:OutputVar}, ${2:Cmd}, ${3:[Value}, ${4:Control}, ${5:WinTitle}, ${6:WinText}, ${7:ExcludeTitle}, ${8:ExcludeText}',
        doc: 'Retrieves various types of information about a control.',
    },
    CONTROLGETFOCUS: {
        keyRawName: 'ControlGetFocus',
        body: 'ControlGetFocus, ${1:OutputVar}, ${2:[WinTitle}, ${3:WinText}, ${4:ExcludeTitle}, ${5:ExcludeText]}',
        doc: 'Retrieves which control of the target window has input focus, if any.',
    },
    CONTROLGETPOS: {
        keyRawName: 'ControlGetPos',
        body:
            'ControlGetPos, ${1:[ X}, ${2:Y}, ${3:Width}, ${4:Height}, ${5:Control}, ${6:WinTitle}, ${7:WinText}, ${8:ExcludeTitle}',
        doc: 'Retrieves the position and size of a control.',
    },
    CONTROLGETTEXT: {
        keyRawName: 'ControlGetText',
        body:
            'ControlGetText, ${1:OutputVar [}, ${2:Control}, ${3:WinTitle}, ${4:WinText}, ${5:ExcludeTitle}, ${6:ExcludeText]}',
        doc: 'Retrieves text from a control.',
    },
    CONTROLMOVE: {
        keyRawName: 'ControlMove',
        body:
            'ControlMove, ${1:Control}, ${2:X}, ${3:Y}, ${4:Width}, ${5:Height [}, ${6:WinTitle}, ${7:WinText}, ${8:ExcludeTitle}',
        doc: 'Moves or resizes a control.',
    },
    CONTROLSEND: {
        keyRawName: 'ControlSend',
        body:
            'ControlSend, ${1:[ Control}, ${2:Keys}, ${3:WinTitle}, ${4:WinText}, ${5:ExcludeTitle}, ${6:ExcludeText]}',
        doc: 'Sends simulated keystrokes to a window or control.',
    },
    CONTROLSENDRAW: {
        keyRawName: 'ControlSendRaw',
        body:
            'ControlSendRaw, ${1:[ Control}, ${2:Keys}, ${3:WinTitle}, ${4:WinText}, ${5:ExcludeTitle}, ${6:ExcludeText]}',
        doc: 'Sends simulated keystrokes to a window or control. ControlSendRaw sends the keystrokes in the Keys parameter without translating {Enter} to Enter, ^c to Control+C, etc.',
    },
    CONTROLSETTEXT: {
        keyRawName: 'ControlSetText',
        body:
            'ControlSetText, ${1:Control}, ${2:NewText [}, ${3:WinTitle}, ${4:WinText}, ${5:ExcludeTitle}, ${6:ExcludeText]}',
        doc: 'Changes the text of a control.',
    },
    COORDMODE: {
        keyRawName: 'CoordMode',
        body: 'CoordMode, ${1:ToolTip|Pixel|Mouse [}, ${2:Screen|Relative]}',
        doc: 'Sets coordinate mode for various commands to be relative to either the active window or the screen.',
    },
    CRITICAL: {
        keyRawName: 'Critical',
        body: 'Critical, ${1|Off,On|}',
        doc: 'Prevents the current thread from being interrupted by other threads, or enables it to be interrupted.',
    },
    DETECTHIDDENTEXT: {
        keyRawName: 'DetectHiddenText',
        body: 'DetectHiddenText, ${1:On|Off}',
        doc: 'Determines whether invisible text in a window is "seen" for the purpose of finding the window. This affects commands such as IfWinExist and WinActivate.',
    },
    DETECTHIDDENWINDOWS: {
        keyRawName: 'DetectHiddenWindows',
        body: 'DetectHiddenWindows, ${1:On|Off}',
        doc: 'Determines whether invisible windows are "seen" by the script.',
    },
    DRIVE: {
        keyRawName: 'Drive',
        body: 'Drive, ${1:Sub-command [}, ${2:Drive}, ${3:Value]}',
        doc: 'Ejects/retracts the tray in a CD or DVD drive, or sets a drive\'s volume label.',
    },
    DRIVEGET: {
        keyRawName: 'DriveGet',
        body: 'DriveGet, ${1:OutputVar}, ${2:Cmd [}, ${3:Value]}',
        doc: 'Retrieves various types of information about the computer\'s drive(s).',
    },
    DRIVESPACEFREE: {
        keyRawName: 'DriveSpaceFree',
        body: 'DriveSpaceFree, ${1:OutputVar}, ${2:C:\\}',
        doc: 'Retrieves the free disk space of a drive, in Megabytes.',
    },
    ENVADD: {
        keyRawName: 'EnvAdd',
        body: 'EnvAdd, ${1:Var}, ${2:Value [}, ${3:TimeUnits]}',
        doc: 'Sets a variable to the sum of itself plus the given value (can also add or subtract time from a date-time value). Synonymous with: var += value.',
    },
    ENVGET: {
        keyRawName: 'EnvGet',
        body: 'EnvGet, ${1:OutputVar}, ${2:EnvVarName}',
        doc: 'Retrieves an environment variable.',
    },
    ENVSET: {
        keyRawName: 'EnvSet',
        body: 'EnvSet, ${1:EnvVar}, ${2:Value}',
        doc: 'Writes a value to a variable contained in the environment.',
    },
    ENVSUB: {
        keyRawName: 'EnvSub',
        body: 'EnvSub, ${1:Var}, ${2:Value [}, ${3:TimeUnits]}',
        doc: 'Sets a variable to itself minus the given value (can also compare date-time values). Synonymous with: Var -= Value.',
    },
    EXIT: {
        keyRawName: 'Exit',
        body: 'Exit, ${1:[ ExitCode]}',
        doc: 'Exits the current thread or (if the script is not persistent and contains no hotkeys) the entire script.',
    },
    FORMATTIME: {
        keyRawName: 'FormatTime',
        body: 'FormatTime, ${1:OutputVar [}, ${2:YYYYMMDDHH24MISS}, ${3:Format]}',
        doc: 'Transforms a YYYYMMDDHH24MISS timestamp into the specified date/time format.',
    },
    GROUPACTIVATE: {
        keyRawName: 'GroupActivate',
        body: 'GroupActivate, ${1:GroupName [}, ${2:R]}',
        doc: 'Activates the next window in a window group that was defined with GroupAdd.',
    },
    GUI: {
        keyRawName: 'Gui',
        body: 'Gui, ${1:sub-command [}, ${2:Param2}, ${3:Param3}, ${4:Param4]}',
        doc: 'Creates and manages windows and controls. Such windows can be used as data entry forms or custom user interfaces.',
    },
    GUICONTROL: {
        keyRawName: 'GuiControl',
        body: 'GuiControl, ${1:Sub-command}, ${2:ControlID [}, ${3:Param3]}',
        doc: 'Makes a variety of changes to a control in a GUI window.',
    },
    GUICONTROLGET: {
        keyRawName: 'GuiControlGet',
        body: 'GuiControlGet, ${1:OutputVar [}, ${2:Sub-command}, ${3:ControlID}, ${4:Param4]}',
        doc: 'Retrieves various types of information about a control in a GUI window.',
    },
    HOTKEY: {
        keyRawName: 'Hotkey',
        body: 'Hotkey, ${1:KeyName [}, ${2:Label}, ${3:Options]}',
        doc: 'Creates, modifies, enables, or disables a hotkey while the script is running.',
    },
    IFMSGBOX: {
        keyRawName: 'IfMsgBox',
        body: 'IfMsgBox, ${1:Yes|No|OK|Cancel|Abort|Ignore|Retry|Timeout}',
        doc: 'Checks which button was pushed by the user during the most recent MsgBox command.',
    },
    IMAGESEARCH: {
        keyRawName: 'ImageSearch',
        body: 'ImageSearch, ${1:OutputVarX}, ${2:OutputVarY}, ${3:X1}, ${4:Y1}, ${5:X2}, ${6:Y2}, ${7:ImageFile}',
        doc: 'Searches a region of the screen for an image.',
    },
    INIDELETE: {
        keyRawName: 'IniDelete',
        body: 'IniDelete, ${1:Filename}, ${2:Section [}, ${3:Key]}',
        doc: 'Deletes a value from a standard format .ini file.',
    },
    INIREAD: {
        keyRawName: 'IniRead',
        body: 'IniRead, ${1:OutputVar}, ${2:Filename}, ${3:Section}, ${4:Key [}, ${5:Default]}',
        doc: 'Reads a value, section or list of section names from a standard format .ini file.',
    },
    INIWRITE: {
        keyRawName: 'IniWrite',
        body: 'IniWrite, ${1:Value}, ${2:Filename}, ${3:Section}, ${4:Key}',
        doc: 'Writes a value or section to a standard format .ini file.',
    },
    INPUT: {
        keyRawName: 'Input',
        body: 'Input, ${1:[ OutputVar}, ${2:Options}, ${3:EndKeys}, ${4:MatchList]}',
        doc: 'Waits for the user to type a string.',
    },
    INPUTBOX: {
        keyRawName: 'InputBox',
        body:
            'InputBox, ${1:OutputVar [}, ${2:Title}, ${3:Prompt}, ${4:HIDE}, ${5:Width}, ${6:Height}, ${7:X}, ${8:Y}, ${9:Font}, ${10:Timeout}',
        doc: 'Displays an input box to ask the user to enter a string.',
    },
    KEYHISTORY: {
        keyRawName: 'KeyHistory',
        body: 'KeyHistory',
        doc: 'Displays script info and a history of the most recent keystrokes and mouse clicks.',
    },
    KEYWAIT: {
        keyRawName: 'KeyWait',
        body: 'KeyWait, ${1:KeyName [}, ${2:Options]}',
        doc: 'Waits for a key or mouse/joystick button to be released or pressed down.',
    },
    LISTLINES: {
        keyRawName: 'ListLines',
        body: 'ListLines, ${1:[ On|Off]}',
        doc: 'Displays the script lines most recently executed.',
    },
    MENU: {
        keyRawName: 'Menu',
        body: 'Menu, ${1:MenuName}, ${2:Cmd [}, ${3:P3}, ${4:P4}, ${5:P5]}',
        doc: 'Creates, deletes, modifies and displays menus and menu items. Changes the tray icon and its tooltip. Controls whether the main window of a compiled script can be opened.',
    },
    MOUSECLICK: {
        keyRawName: 'MouseClick',
        body: 'MouseClick, ${1:WhichButton [}, ${2:X}, ${3:Y}, ${4:ClickCount}, ${5:Speed}, ${6:D|U}, ${7:R]}',
        doc: 'Clicks or holds down a mouse button, or turns the mouse wheel. NOTE: The Click command is generally more flexible and easier to use.',
    },
    MOUSECLICKDRAG: {
        keyRawName: 'MouseClickDrag',
        body: 'MouseClickDrag, ${1:WhichButton}, ${2:X1}, ${3:Y1}, ${4:X2}, ${5:Y2 [}, ${6:Speed}, ${7:R]}',
        doc: 'Clicks and holds the specified mouse button, moves the mouse to the destination coordinates, then releases the button.',
    },
    MOUSEGETPOS: {
        keyRawName: 'MouseGetPos',
        body: 'MouseGetPos, ${1:[ OutputVarX}, ${2:OutputVarY}, ${3:OutputVarWin}, ${4:OutputVarControl}, ${5:1|2|3]}',
        doc: 'Retrieves the current position of the mouse cursor, and optionally which window and control it is hovering over.',
    },
    MOUSEMOVE: {
        keyRawName: 'MouseMove',
        body: 'MouseMove, ${1:X}, ${2:Y [}, ${3:Speed}, ${4:R]}',
        doc: 'Moves the mouse cursor.',
    },
    MSGBOX: {
        keyRawName: 'MsgBox',
        body: 'MsgBox, ${1:[ Options}, ${2:Title}, ${3:Text}, ${4:Timeout]}',
        doc: 'Displays the specified text in a small window containing one or more buttons (such as Yes and No).',
    },
    OUTPUTDEBUG: {
        keyRawName: 'OutputDebug',
        body: 'OutputDebug, ${1:, Text}${2: % }$3',
        doc: 'Sends a string to the debugger (if any) for display.',
    },
    PIXELGETCOLOR: {
        keyRawName: 'PixelGetColor',
        body: 'PixelGetColor, ${1:OutputVar}, ${2:X}, ${3:Y [}, ${4:Alt|Slow|RGB]}',
        doc: 'Retrieves the color of the pixel at the specified x,y coordinates.',
    },
    PIXELSEARCH: {
        keyRawName: 'PixelSearch',
        body:
            'PixelSearch, ${1:OutputVarX}, ${2:OutputVarY}, ${3:X1}, ${4:Y1}, ${5:X2}, ${6:Y2}, ${7:ColorID [}, ${8:Variation}',
        doc: 'Searches a region of the screen for a pixel of the specified color.',
    },
    POSTMESSAGE: {
        keyRawName: 'PostMessage',
        body:
            'PostMessage, ${1:Msg}, ${2:[wParam}, ${3:lParam}, ${4:Control}, ${5:WinTitle}, ${6:WinText}, ${7:ExcludeTitle}, ${8:ExcludeText]}',
        doc: 'Sends a message to a window or control (SendMessage additionally waits for acknowledgement).',
    },
    PROCESS: {
        keyRawName: 'Process',
        body: 'Process, ${1:Cmd}, ${2:PID-or-Name [}, ${3:Param3]}',
        doc: 'Performs one of the following operations on a process: checks if it exists; changes its priority; closes it; waits for it to close.',
    },
    RANDOM: {
        keyRawName: 'Random',
        body: 'Random, ${1:OutputVar [}, ${2:Min}, ${3:Max]}',
        doc: 'Generates a pseudo-random number.',
    },
    REGDELETE: {
        keyRawName: 'RegDelete',
        body: 'RegDelete, ${1:HKLM|HKU|HKCU|HKCR|HKCC}, ${2:SubKey [}, ${3:ValueName]}',
        doc: 'Deletes a subkey or value from the registry.',
    },
    REGREAD: {
        keyRawName: 'RegRead',
        body: 'RegRead, ${1:OutputVar}, ${2:HKLM|HKU|HKCU|HKCR|HKCC}, ${4:ValueName]}',
        doc: 'Reads a value from the registry.',
    },
    REGWRITE: {
        keyRawName: 'RegWrite',
        body:
            'RegWrite, ${1:REG_SZ|REG_EXPAND_SZ|REG_MULTI_SZ|REG_DWORD|REG_BINARY}, ${2:HKLM|HKU|HKCU|HKCR|HKCC}, ${3:SubKey [}, ${4:ValueName}, ${5:Value]}',
        doc: 'Writes a value to the registry.',
    },
    RUN: {
        keyRawName: 'Run',
        body: 'Run, ${1:Target [}, ${2:WorkingDir}, ${3:Max|Min|Hide|UseErrorLevel}, ${4:OutputVarPID]}',
        doc: 'Runs an external program.',
    },
    RUNAS: {
        keyRawName: 'RunAs',
        body: 'RunAs, ${1:[ User}, ${2:Password}, ${3:Domain]}',
        doc: 'Specifies a set of user credentials to use for all subsequent uses of Run and RunWait.',
    },
    RUNWAIT: {
        keyRawName: 'RunWait',
        body: 'RunWait, ${1:Target [}, ${2:WorkingDir}, ${3:Max|Min|Hide|UseErrorLevel}, ${4:OutputVarPID]}',
        doc: 'Unlike Run, RunWait will wait until the program finishes before continuing.',
    },
    SEND: {
        keyRawName: 'Send',
        body: 'Send, ${1:Keys}',
        doc: 'Sends simulated keystrokes and mouse clicks to the active window.',
    },
    SENDEVENT: {
        keyRawName: 'SendEvent',
        body: 'SendEvent, ${1:Keys}',
        doc: 'SendEvent sends keystrokes using the same method as the pre-1.0.43 Send command. The rate at which keystrokes are sent is determined by SetKeyDelay.',
    },
    SENDINPUT: {
        keyRawName: 'SendInput',
        body: 'SendInput, ${1:Keys}',
        doc: 'SendInput and SendPlay use the same syntax as Send but are generally faster and more reliable. In addition, they buffer any physical keyboard or mouse activity during the send, which prevents the user\'s keystrokes from being interspersed with those being sent.',
    },
    SENDLEVEL: {
        keyRawName: 'SendLevel',
        body: 'SendLevel, ${1:Level}',
        doc: 'Controls which artificial keyboard and mouse events are ignored by hotkeys and hotstrings.',
    },
    SENDMESSAGE: {
        keyRawName: 'SendMessage',
        body:
            'SendMessage, ${1:Msg}, ${2:[wParam}, ${3:lParam}, ${4:Control}, ${5:WinTitle}, ${6:WinText}, ${7:ExcludeTitle}, ${8:ExcludeText}, ${9:Timeout]}',
        doc: 'Sends a message to a window or control (SendMessage additionally waits for acknowledgement).',
    },
    SENDMODE: {
        keyRawName: 'SendMode',
        body: 'SendMode, ${1:Event|Play|Input|InputThenPlay}',
        doc: 'Makes Send synonymous with SendInput or SendPlay rather than the default (SendEvent). Also makes Click and MouseMove/Click/Drag use the specified method.',
    },
    SENDPLAY: {
        keyRawName: 'SendPlay',
        body: 'SendPlay, ${1:Keys}',
        doc: 'SendInput and SendPlay use the same syntax as Send but are generally faster and more reliable. In addition, they buffer any physical keyboard or mouse activity during the send, which prevents the user\'s keystrokes from being interspersed with those being sent.',
    },
    SENDRAW: {
        keyRawName: 'SendRaw',
        body: 'SendRaw, ${1:Keys}',
        doc: 'Similar to Send, except that all characters in Keys are interpreted and sent literally. See Raw mode for details.',
    },
    SETBATCHLINES: {
        keyRawName: 'SetBatchLines',
        body: 'SetBatchLines, ${1:-1 | 20ms | LineCount}',
        doc: 'Determines how fast a script will run (affects CPU utilization).',
    },
    SETCAPSLOCKSTATE: {
        keyRawName: 'SetCapsLockState',
        body: 'SetCapsLockState, ${1:On|Off|AlwaysOn|AlwaysOff}',
        doc: 'Sets the state of the CapsLock key. Can also force the key to stay on or off.',
    },
    SETCONTROLDELAY: {
        keyRawName: 'SetControlDelay',
        body: 'SetControlDelay, ${1:Delay}',
        doc: 'Sets the delay that will occur after each control-modifying command.',
    },
    SETDEFAULTMOUSESPEED: {
        keyRawName: 'SetDefaultMouseSpeed',
        body: 'SetDefaultMouseSpeed, ${1:Speed}',
        doc: 'Sets the mouse speed that will be used if unspecified in Click and MouseMove/Click/Drag.',
    },
    SETKEYDELAY: {
        keyRawName: 'SetKeyDelay',
        body: 'SetKeyDelay, ${1:[ Delay}, ${2:PressDuration]}',
        doc: 'Sets the delay that will occur after each keystroke sent by Send and ControlSend.',
    },
    SETMOUSEDELAY: {
        keyRawName: 'SetMouseDelay',
        body: 'SetMouseDelay, ${1:Delay}',
        doc: 'Sets the delay that will occur after each mouse movement or click.',
    },
    SETNUMLOCKSTATE: {
        keyRawName: 'SetNumLockState',
        body: 'SetNumLockState, ${1:On|Off|AlwaysOn|AlwaysOff}',
        doc: 'Sets the state of the NumLock key. Can also force the key to stay on or off.',
    },
    SETREGVIEW: {
        keyRawName: 'SetRegView',
        body: 'SetRegView, ${1:RegView}',
        doc: 'Sets the registry view used by RegRead, RegWrite, RegDelete and registry loops.',
    },
    SETSCROLLLOCKSTATE: {
        keyRawName: 'SetScrollLockState',
        body: 'SetScrollLockState, ${1:On|Off|AlwaysOn|AlwaysOff}',
        doc: 'Sets the state of the ScrollLock key. Can also force the key to stay on or off.',
    },
    SETSTORECAPSLOCKMODE: {
        keyRawName: 'SetStoreCapslockMode',
        body: 'SetStoreCapslockMode, ${1:On|Off}',
        doc: 'Whether to restore the state of CapsLock after a Send.',
    },
    SETTIMER: {
        keyRawName: 'SetTimer',
        body: 'SetTimer, ${1:Label [}, ${2:Period|On|Off]}',
        doc: 'Causes a subroutine to be launched automatically and repeatedly at a specified time interval.',
    },
    SETTITLEMATCHMODE: {
        keyRawName: 'SetTitleMatchMode',
        body: 'SetTitleMatchMode, ${1:Fast|Slow|RegEx|1|2|3}',
        doc: 'Sets the matching behavior of the WinTitle parameter in commands such as WinWait.',
    },
    SETWINDELAY: {
        keyRawName: 'SetWinDelay',
        body: 'SetWinDelay, ${1:Delay}',
        doc: 'Sets the delay that will occur after each windowing command, such as WinActivate.',
    },
    SETWORKINGDIR: {
        keyRawName: 'SetWorkingDir',
        body: 'SetWorkingDir, ${1:DirName}',
        doc: 'Changes the script\'s current working directory.',
    },
    SHUTDOWN: {
        keyRawName: 'Shutdown',
        body: 'Shutdown, ${1:Code}',
        doc: 'Shuts down, restarts, or logs off the system.',
    },
    SORT: {
        keyRawName: 'Sort',
        body: 'Sort, ${1:VarName [}, ${2:Options]}',
        doc: 'Arranges a variable\'s contents in alphabetical, numerical, or random order (optionally removing duplicates).',
    },
    SOUNDBEEP: {
        keyRawName: 'SoundBeep',
        body: 'SoundBeep, ${1:[ Frequency}, ${2:Duration]}',
        doc: 'Emits a tone from the PC speaker.',
    },
    SOUNDGET: {
        keyRawName: 'SoundGet',
        body: 'SoundGet, ${1:OutputVar [}, ${2:ComponentType}, ${3:ControlType}, ${4:DeviceNumber]}',
        doc: 'Retrieves various settings from a sound device (master mute, master volume, etc.)',
    },
    SOUNDGETWAVEVOLUME: {
        keyRawName: 'SoundGetWaveVolume',
        body: 'SoundGetWaveVolume, ${1:OutputVar [}, ${2:DeviceNumber]}',
        doc: 'Retrieves the wave output volume for a sound device.',
    },
    SOUNDPLAY: {
        keyRawName: 'SoundPlay',
        body: 'SoundPlay, ${1:Filename [}, ${2:wait]}',
        doc: 'Plays a sound, video, or other supported file type.',
    },
    SOUNDSET: {
        keyRawName: 'SoundSet',
        body: 'SoundSet, ${1:NewSetting}, ${2:[ComponentType}, ${3:ControlType}, ${4:DeviceNumber]}',
        doc: 'Changes various settings of a sound device (master mute, master volume, etc.)',
    },
    SOUNDSETWAVEVOLUME: {
        keyRawName: 'SoundSetWaveVolume',
        body: 'SoundSetWaveVolume, ${1:Percent [}, ${2:DeviceNumber]}',
        doc: 'Changes the wave output volume for a sound device.',
    },
    SPLITPATH: {
        keyRawName: 'SplitPath',
        body:
            'SplitPath, ${1:InputVar [}, ${2:OutFileName}, ${3:OutDir}, ${4:OutExtension}, ${5:OutNameNoExt}, ${6:OutDrive]}',
        doc: 'Separates a file name or URL into its name, directory, extension, and drive.',
    },
    STATUSBARGETTEXT: {
        keyRawName: 'StatusBarGetText',
        body:
            'StatusBarGetText, ${1:OutputVar [}, ${2:Part#}, ${3:WinTitle}, ${4:WinText}, ${5:ExcludeTitle}, ${6:ExcludeText]}',
        doc: 'Retrieves the text from a standard status bar control.',
    },
    STATUSBARWAIT: {
        keyRawName: 'StatusBarWait',
        body:
            'StatusBarWait, ${1:[BarText}, ${2:Seconds}, ${3:Part#}, ${4:WinTitle}, ${5:WinText}, ${6:Interval}, ${7:ExcludeTitle}, ${8:ExcludeText]}',
        doc: 'Waits until a window\'s status bar contains the specified string.',
    },
    STRINGCASESENSE: {
        keyRawName: 'StringCaseSense',
        body: 'StringCaseSense, ${1:On|Off|Locale}',
        doc: 'Determines whether string comparisons are case sensitive (default is "not case sensitive").',
    },
    SUSPEND: {
        keyRawName: 'Suspend',
        body: 'Suspend, ${1:[ On|Off|Toggle|Permit]}',
        doc: 'Disables or enables all or selected hotkeys and hotstrings.',
    },
    SYSGET: {
        keyRawName: 'SysGet',
        body: 'SysGet, ${1:OutputVar}, ${2:Sub-command [}, ${3:Param3]}',
        doc: 'Retrieves screen resolution, multi-monitor info, dimensions of system objects, and other system properties.',
    },
    THREAD: {
        keyRawName: 'Thread',
        body: 'Thread, ${1:NoTimers|Priority|Interrupt}',
        doc: 'Sets the priority or interruptibility of threads. It can also temporarily disable all timers.',
    },
    TOOLTIP: {
        keyRawName: 'ToolTip',
        body: 'ToolTip, ${1:[ Text}, ${2:X}, ${3:Y}, ${4:WhichToolTip]}',
        doc: 'Creates an always-on-top window anywhere on the screen.',
    },
    TRAYTIP: {
        keyRawName: 'TrayTip',
        body: 'TrayTip, ${1:[ Title}, ${2:Text}, ${3:Seconds}, ${4:Options]}',
        doc: 'Creates a balloon message window near the tray icon. On Windows 10, a toast notification may be shown instead.',
    },
    URLDOWNLOADTOFILE: {
        keyRawName: 'UrlDownloadToFile',
        body: 'UrlDownloadToFile, ${1:URL}, ${2:Filename}',
        doc: 'Downloads a file from the Internet.',
    },
};

export function commandElement2Md(DirectivesElemnt: TCommandElement): vscode.MarkdownString {
    const {
        keyRawName,
        doc,
        link,
        exp,
    } = DirectivesElemnt;
    const md: vscode.MarkdownString = new vscode.MarkdownString('', true)
        .appendMarkdown('Command')
        .appendCodeblock(keyRawName, 'ahk')
        .appendMarkdown(doc)
        .appendMarkdown('\n')
        .appendMarkdown(`[(Read Doc)](${link})`)
        .appendMarkdown('\n\n***')
        .appendMarkdown('\n\n*exp:*');
    // .appendCodeblock(exp.join('\n'));

    md.supportHtml = true;
    return md;
}
// FIXME: command Completion
