/* eslint-disable max-lines */
/* eslint-disable no-template-curly-in-string */
/* eslint-disable max-len */
/* cSpell:disable */
import * as vscode from 'vscode';

export const CommandList = [
    'AUTOTRIM',
    'BLOCKINPUT',
    'CLASS',
    'CLICK',
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
    'EXITAPP',
    'FILECOPY',
    'FILECOPYDIR',
    'FILECREATEDIR',
    'FILECREATESHORTCUT',
    'FILEDELETE',
    'FILEENCODING',
    'FILEGETATTRIB',
    'FILEGETSHORTCUT',
    'FILEGETSIZE',
    'FILEGETTIME',
    'FILEGETVERSION',
    'FILEINSTALL',
    'FILEMOVE',
    'FILEMOVEDIR',
    'FILEREAD',
    'FILEREADLINE',
    'FILERECYCLE',
    'FILERECYCLEEMPTY',
    'FILEREMOVEDIR',
    'FILESELECTFILE',
    'FILESELECTFOLDER',
    'FILESETATTRIB',
    'FILESETTIME',
    'FOR',
    'FORMATTIME',
    'GETKEYSTATE',
    'GLOBAL',
    'GROUPACTIVATE',
    'GROUPADD',
    'GROUPCLOSE',
    'GROUPDEACTIVATE',
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
    'LISTHOTKEYS',
    'LISTLINES',
    'LISTVARS',
    'LOCAL',
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
    'SETFORMAT',
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
    'SLEEP',
    'SORT',
    'SOUNDBEEP',
    'SOUNDGET',
    'SOUNDGETWAVEVOLUME',
    'SOUNDPLAY',
    'SOUNDSET',
    'SOUNDSETWAVEVOLUME',
    'SPLITPATH',
    'STATIC',
    'STATUSBARGETTEXT',
    'STATUSBARWAIT',
    'STRINGCASESENSE',
    'STRINGGETPOS',
    'STRINGLEFT',
    'STRINGLEN',
    'STRINGLOWER',
    'STRINGMID',
    'STRINGREPLACE',
    'STRINGRIGHT',
    'STRINGTRIMLEFT',
    'STRINGTRIMRIGHT',
    'STRINGUPPER',
    'SUSPEND',
    'SYSGET',
    'THREAD',
    'TOOLTIP',
    'TRANSFORM',
    'TRAYTIP',
    'URLDOWNLOADTOFILE',
    'WINACTIVATE',
    'WINACTIVATEBOTTOM',
    'WINCLOSE',
    'WINGET',
    'WINGETACTIVESTATS',
    'WINGETACTIVETITLE',
    'WINGETCLASS',
    'WINGETPOS',
    'WINGETTEXT',
    'WINGETTITLE',
    'WINHIDE',
    'WINKILL',
    'WINMAXIMIZE',
    'WINMENUSELECTITEM',
    'WINMINIMIZE',
    'WINMINIMIZEALL',
    'WINMINIMIZEALLUNDO',
    'WINMOVE',
    'WINRESTORE',
    'WINSET',
    'WINSETTITLE',
    'WINSHOW',
    'WINWAIT',
    'WINWAITACTIVE',
    'WINWAITCLOSE',
    'WINWAITNOTACTIVE',
] as const;

type TCommandKeyList = typeof CommandList[number];

type TCommandElement = {
    keyRawName: string;
    body: string;
    doc: string;
    // FIXME: use DeepReadonly
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
        body: 'AutoTrim, ${1|On,Off|}',
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
        body: 'BlockInput, ${1|On,Off,Send,Mouse,SendAndMouse,Default,MouseMove,MouseMoveOff|}',
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
    CLASS: {
        keyRawName: 'Class',
        body: 'class',
        doc: 'At its root, a "class" is a set or category of things having some property or attribute in common. Since a [base](https://www.autohotkey.com/docs/Objects.htm#Custom_Objects) or [prototype](https://www.autohotkey.com/docs/Objects.htm#Custom_Prototypes) object defines properties and behaviour for set of objects, it can also be called a _class_ object. For convenience, base objects can be defined using the "class" keyword as shown below:',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/Objects.htm#Custom_Classes',
        exp: [
            'class ClassName extends BaseClassName',
            '{',
            '    InstanceVar := Expression',
            '    static ClassVar := Expression',
            '',
            '    class NestedClass',
            '    {',
            '        ...',
            '    }',
            '',
            '    Method()',
            '    {',
            '        ...',
            '    }',
            '',
            '    Property[]  ; Brackets are optional',
            '    {',
            '        get {',
            '            return ...',
            '        }',
            '        set {',
            '            return ... := value',
            '        }',
            '    }',
            '}',
        ],
    },
    CLICK: {
        keyRawName: 'Click',
        body: 'Click , Options',
        doc: 'Clicks a mouse button at the specified coordinates. It can also hold down a mouse button, turn the mouse wheel, or move the mouse.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/Click.htm',
        exp: [
            ';exp1 Clicks the left mouse button at a specific position.',
            'Click, 100 200',
            '',
            ';exp2 Moves the mouse cursor to a specific position without clicking.',
            'Click, 100 200 0',
            '',
            ';exp3 Clicks the right mouse button at a specific position.',
            ' Click, 100 200 Right',
            '',
            ';exp Performs a double-click at the mouse cursor\'s current position.',
            'Click, 2',
            '',
            ';exp Presses down the left mouse button and holds it.',
            'Click, Down',
            '',
            ';exp Releases the right mouse button.',
            'Click, Up Right',
            '',
        ],
    },
    CLIPWAIT: {
        keyRawName: 'ClipWait',
        body: 'ClipWait, ${1:Timeout}, ${2|False,True|}',
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
    CONTROL: {
        keyRawName: 'Control',
        body:
            'Control, ${1|Check,Uncheck,Enable,Disable,Show,Hide,Style,ExStyle,ShowDropDown,HideDropDown,TabLeft,TabRight,Add,Delete,Choose,ChooseString,EditPaste|}',
        doc: 'Makes a variety of changes to a control.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/Control.htm',
        exp: [
            'Control, SubCommand , [Value, Control, WinTitle, WinText, ExcludeTitle, ExcludeText]',
            ';  SubCommand',
            ';        Check: Turns on (checks) a radio button or checkbox.',
            ';        Uncheck: Turns off a radio button or checkbox.',
            ';        Enable: Enables a control if it was previously disabled.',
            ';        Disable: Disables or "grays out" a control.',
            ';        Show: Shows a control if it was previously hidden.',
            ';        Hide: Hides a control.',
            ';        Style: Changes the style of a control.',
            ';        ExStyle: Changes the extended style of a control.',
            ';        ShowDropDown: Shows the drop-down list of a ComboBox control.',
            ';        HideDropDown: Hides the drop-down list of a ComboBox control.',
            ';        TabLeft: Moves left by one or more tabs in a SysTabControl32.',
            ';        TabRight: Moves right by one or more tabs in a SysTabControl32.',
            ';        Add: Adds the specified string as a new entry at the bottom of a ListBox, ComboBox (and possibly other types).',
            ';        Delete: Deletes the specified entry number from a ListBox or ComboBox.',
            ';        Choose: Sets the selection in a ListBox or ComboBox to be the specified entry number.',
            ';        ChooseString: Sets the selection in a ListBox or ComboBox to be the first entry whose leading part matches the specified string.',
            ';        EditPaste: Pastes the specified string at the caret in an Edit control.',
            ';        ',
        ],
    },
    CONTROLCLICK: {
        keyRawName: 'ControlClick',
        body: 'ControlClick, ',
        doc: 'Sends a mouse button or mouse wheel event to a control.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/ControlClick.htm',
        exp: [
            'ControlClick , [Control-or-Pos, WinTitle, WinText, WhichButton, ClickCount, Options, ExcludeTitle, ExcludeText]',
        ],
    },
    CONTROLFOCUS: {
        keyRawName: 'ControlFocus',
        body: 'ControlFocus, ',
        doc: 'Sets input focus to a given control on a window.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/ControlFocus.htm',
        exp: [
            'ControlFocus , [Control, WinTitle, WinText, ExcludeTitle, ExcludeText]',
        ],
    },
    CONTROLGET: {
        keyRawName: 'ControlGet',
        body:
            'ControlGet, ${1:OutputVar}, ${2|List,Checked,Enabled,Visible,Tab,FindString,Choice,LineCount,CurrentLine,CurrentCol,Line,Selected,Style,ExStyle,Hwnd|}, [${3:Value}, ${4:Control}, ${5:WinTitle}, ${6:WinText}, ${7:ExcludeTitle}, ${8:ExcludeText}]',
        doc: 'Retrieves various types of information about a control.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/ControlGet.htm',
        exp: [
            'ControlGet, OutputVar, SubCommand , [Value, Control, WinTitle, WinText, ExcludeTitle, ExcludeText]',
            ';SubCommand',
            ';    List: Retrieves a list of items from a ListView, ListBox, ComboBox, or DropDownList.',
            ';    Checked: Retrieves 1 if the checkbox or radio button is checked or 0 if not.',
            ';    Enabled: Retrieves 1 if the control is enabled, or 0 if disabled.',
            ';    Visible: Retrieves 1 if the control is visible, or 0 if hidden.',
            ';    Tab: Retrieves the tab number of a SysTabControl32 control.',
            ';    FindString: Retrieves the entry number of a ListBox or ComboBox that is an exact match for the string.',
            ';    Choice: Retrieves the name of the currently selected entry in a ListBox or ComboBox.',
            ';    LineCount: Retrieves the number of lines in an Edit control.',
            ';    CurrentLine: Retrieves the line number in an Edit control where the caret resides.',
            ';    CurrentCol: Retrieves the column number in an Edit control where the caret resides.',
            ';    Line: Retrieves the text of the specified line number in an Edit control.',
            ';    Selected: Retrieves the selected text in an Edit control.',
            ';    Style: Retrieves an 8-digit hexadecimal number representing the style of the control.',
            ';    ExStyle: Retrieves an 8-digit hexadecimal number representing the extended style of the control.',
            ';    Hwnd [v1.1.04+]: Retrieves the window handle (HWND) of the control.',
        ],
    },
    CONTROLGETFOCUS: {
        keyRawName: 'ControlGetFocus',
        body: 'ControlGetFocus, ${1:OutputVar}',
        doc: 'Retrieves which control of the target window has input focus, if any.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/ControlGetFocus.htm',
        exp: [
            'ControlGetFocus, OutputVar , [WinTitle, WinText, ExcludeTitle, ExcludeText]',
            ';exp:',
            'ControlGetFocus, OutputVar, % "Untitled - Notepad"',
            'if ErrorLevel',
            '    MsgBox, % "The target window doesn\'t exist or none of its controls has input focus."',
            'else',
            '    MsgBox, % "Control with focus = " OutputVar',
        ],
    },
    CONTROLGETPOS: {
        keyRawName: 'ControlGetPos',
        body:
            'ControlGetPos, [{1:X}, ${2:Y}, ${3:Width}, ${4:Height}, ${5:Control}, ${6:WinTitle}, ${7:WinText}, ${8:ExcludeTitle}]',
        doc: 'Retrieves the position and size of a control.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/ControlGetPos.htm',
        exp: [
            'ControlGetPos , [X, Y, Width, Height, Control, WinTitle, WinText, ExcludeTitle, ExcludeText]',
            '',
            ';exp: Continuously updates and displays the name and position of the control currently under the mouse cursor.',
            '',
            'Loop',
            '{',
            '    Sleep, 100',
            '    MouseGetPos, , , WhichWindow, WhichControl',
            '    ControlGetPos, x, y, w, h, %WhichControl%, ahk_id %WhichWindow%',
            '    ToolTip, % WhichControl "`nX: " X "`tY: " Y "`nW: " W "`tH:" H',
            '}',
        ],
    },
    CONTROLGETTEXT: {
        keyRawName: 'ControlGetText',
        body:
            'ControlGetText, ${1:OutputVar} [, ${2:Control}, ${3:WinTitle}, ${4:WinText}, ${5:ExcludeTitle}, ${6:ExcludeText]}',
        doc: 'Retrieves text from a control.\n\n* Note: To retrieve text from a ListView, ListBox, or ComboBox, use ControlGet List instead.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/ControlGetText.htm',
        exp: [
            'ControlGetText, OutputVar [, Control, WinTitle, WinText, ExcludeTitle, ExcludeText]',
            '',
            ';exp 1 Retrieves the current text from Notepad\'s edit control and stores it in OutputVar.',
            '',
            '~F11::fn_test()',
            '',
            'fn_test() {',
            '    SetTitleMatchMode, 2',
            '    SetTitleMatchMode, Fast',
            '    ControlGetText, OutputVar, % "Edit1", % ".txt"',
            '    MsgBox % OutputVar',
            '}',
        ],
    },
    CONTROLMOVE: {
        keyRawName: 'ControlMove',
        body:
            'ControlMove, ${1:Control}, ${2:X}, ${3:Y}, ${4:Width}, ${5:Height} [, ${6:WinTitle}, ${7:WinText}, ${8:ExcludeTitle}]',
        doc: 'Moves or resizes a control.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/ControlGetText.htm',
        exp: [
            'ControlMove, Control, X, Y, Width, Height [, WinTitle, WinText, ExcludeTitle, ExcludeText]',
            '',
            ';exp',
            'fn_1 := Func("fn_ControlMoveTimer")^$',
            'SetTimer, %fn_1%',
            'InputBox, OutputVar, % "My Input Box"',
            'return',
            '',
            'fn_ControlMoveTimer() {',
            '    if not WinExist("My Input Box")',
            '        return',
            '    ; Otherwise the above set the "last found" window for us:',
            '    WinActivate',
            '    ControlMove, OK, 10, , 200 ; Move the OK button to the left and increase its width.',
            '}',
            '',
        ],
    },
    CONTROLSEND: {
        keyRawName: 'ControlSend',
        body:
            'ControlSend, [${1:Control}, ${2:Keys}, ${3:WinTitle}, ${4:WinText}, ${5:ExcludeTitle}, ${6:ExcludeText]}',
        doc: 'Sends simulated keystrokes to a window or control.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/ControlSend.htm',
        exp: [
            'ControlSend [, Control, Keys, WinTitle, WinText, ExcludeTitle, ExcludeText]',
        ],
    },
    CONTROLSENDRAW: {
        keyRawName: 'ControlSendRaw',
        body:
            'ControlSendRaw, [${1:Control}, ${2:Keys}, ${3:WinTitle}, ${4:WinText}, ${5:ExcludeTitle}, ${6:ExcludeText]}',
        doc: 'Sends simulated keystrokes to a window or control.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/ControlSend.htm',
        exp: [
            'ControlSendRaw [, Control, Keys, WinTitle, WinText, ExcludeTitle, ExcludeText]',
        ],
    },
    CONTROLSETTEXT: {
        keyRawName: 'ControlSetText',
        body:
            'ControlSetText, [${1:Control}, ${2:NewText }, ${3:WinTitle}, ${4:WinText}, ${5:ExcludeTitle}, ${6:ExcludeText}]',
        doc: 'Changes the text of a control.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/ControlSetText.htm',
        exp: [
            'ControlSetText [, Control, NewText, WinTitle, WinText, ExcludeTitle, ExcludeText]',
        ],
    },
    COORDMODE: {
        keyRawName: 'CoordMode',
        body: 'CoordMode, ${1:ToolTip|Pixel|Mouse} [, ${2:Screen|Relative}]',
        doc: 'Sets coordinate mode for various commands to be relative to either the active window or the screen.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/CoordMode.htm',
        exp: [
            'CoordMode, TargetType [, RelativeTo]',
            'CoordMode, ToolTip, Screen',
            'CoordMode, ToolTip',
        ],
    },
    CRITICAL: {
        keyRawName: 'Critical',
        body: 'Critical, ${1|Off,On|}',
        doc: 'Prevents the current thread from being interrupted by other threads, or enables it to be interrupted.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/CoordMode.htm',
        exp: [
            'CoordMode, TargetType [, RelativeTo]',
            ';          TargetType',
            ';                 -> On (defaults)',
            ';                 -> Off',
            'CoordMode, ToolTip, Screen',
            'CoordMode, ToolTip',
        ],
    },
    DETECTHIDDENTEXT: {
        keyRawName: 'DetectHiddenText',
        body: 'DetectHiddenText, ${1:On|Off}',
        doc: 'Determines whether invisible text in a window is "seen" for the purpose of finding the window. This affects commands, built-in functions and control flow statements such as WinExist() and WinActivate.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/DetectHiddenText.htm',
        exp: [
            'DetectHiddenText, OnOff',
            ';                -> On (defaults), Hidden text will be detected.',
            ';                -> Off, Hidden text is not detected.',
        ],
    },
    DETECTHIDDENWINDOWS: {
        keyRawName: 'DetectHiddenWindows',
        body: 'DetectHiddenWindows, ${1:On|Off}',
        doc: 'Determines whether invisible windows are "seen" by the script.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/DetectHiddenWindows.htm',
        exp: [
            'DetectHiddenWindows, OnOff',
            ';                     On: Hidden windows are detected.',
            ';          (default) Off: Hidden windows are not detected, except by the WinShow command.',
        ],
    },
    DRIVE: {
        keyRawName: 'Drive',
        body: 'Drive, ${1|Label,Lock,Unlock,Eject|} [, ${2:Drive}, ${3:Value}]',
        doc: 'Ejects/retracts the tray in a CD or DVD drive, or sets a drive\'s volume label.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/Drive.htm',
        exp: [
            'Drive, SubCommand , Value1, Value2',
            ';      SubCommand',
            ';          Label: Renames the volume label of a drive.',
            ';          Lock: Prevents a drive\'s eject feature from working.',
            ';          Unlock: Restores a drive\'s eject feature.',
            ';          Eject: Ejects or retracts the tray of a CD or DVD drive.',
        ],
    },
    DRIVEGET: {
        keyRawName: 'DriveGet',
        body:
            'DriveGet, ${1:OutputVar}, ${2|List,Capacity,FileSystem,Label,Serial,Type,Status,StatusCD|} [, ${3:Value}]',
        doc: [
            'Retrieves various types of information about the computer\'s drive(s).',
            '*SubCommand*',
            '* List:        Retrieves a string of letters, one character for each drive letter in the system.',
            '* Capacity:    Retrieves the total capacity of the specified path in megabytes.',
            '* FileSystem:  Retrieves the type of the specified drive\'s file system.',
            '* Label:       Retrieves the volume label of the specified drive.',
            '* Serial:      Retrieves the volume serial number of the specified drive.',
            '* Type:        Retrieves the drive type of the specified path.',
            '* Status:      Retrieves the status of the specified path.',
            '* StatusCD:    Retrieves the media status of a CD or DVD drive.',
        ].join('\n'),
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/DriveGet.htm',
        exp: [
            'DriveGet, OutputVar, SubCommand [, Value]',
            '',
            ';exp Allows the user to select a drive in order to analyze it.',
            '',
            'FileSelectFolder, folder,, 3, Pick a drive to analyze:',
            'if not folder',
            '    return',
            'DriveGet, list, List',
            'DriveGet, cap, Capacity, %folder%',
            'DriveSpaceFree, free, %folder%',
            'DriveGet, fs, FileSystem, %folder%',
            'DriveGet, label, Label, %folder%',
            'DriveGet, serial, Serial, %folder%',
            'DriveGet, type, Type, %folder%',
            'DriveGet, status, Status, %folder%',
            'MsgBox All Drives: %list%`nSelected Drive: %folder%`nDrive Type: %type%`nStatus: %status%`nCapacity: %cap% M`nFree Space: %free% M`nFilesystem: %fs%`nVolume Label: %label%`nSerial Number: %serial%',
        ],
    },
    DRIVESPACEFREE: {
        keyRawName: 'DriveSpaceFree',
        body: 'DriveSpaceFree, ${1:OutputVar_MBSize}, ${2:C:\\}',
        doc: 'Retrieves the free disk space of a drive, in Megabytes.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/DriveSpaceFree.htm',
        exp: [
            'DriveSpaceFree, OutputVar, Path',
            '; OutputVar size is Megabytes.',
            '',
            'DriveSpaceFree, FreeSpace, C:\\',
            'MsgBox % FreeSpace//1024 ; MB -> GB',
        ],
    },
    ENVADD: {
        keyRawName: 'EnvAdd',
        body: 'EnvAdd, ${1:Var}, ${2:Value} [, ${3:TimeUnits]}',
        doc: 'Sets a [variable](https://www.autohotkey.com/docs/Variables.htm) to the sum of itself plus the given value (can also add or subtract time from a [date-time](https://www.autohotkey.com/docs/commands/FileSetTime.htm#YYYYMMDD) value). Synonymous with: `Var += Value`.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/EnvAdd.htm',
        exp: [
            'EnvAdd, Var, Value , TimeUnits',
            'Var += Value , TimeUnits',
            'Var++',
            ';-----',
            '; exp 1',
            'var1 := ""  ; Make it blank so that the below will use the current timestamp instead.',
            'var1 += 31, days',
            'MsgBox, % var1  ; The answer will be the date 31 days from now.',
        ],
    },
    ENVGET: {
        keyRawName: 'EnvGet',
        body: 'EnvGet, ${1:OutputVar}, ${2:EnvVarName}',
        doc: [
            'Retrieves an environment variable.',
            '# [Parameters](https://www.autohotkey.com/docs/commands/EnvGet.htm#Parameters)',
            '* OutputVar : ',
            '  The name of the variable in which to store the string.',
            '* EnvVarName :',
            '  The name of the [environment variable](https://www.autohotkey.com/docs/Concepts.htm#environment-variables) to retrieve.',
            '  Exp : `Path` or `TEMP`or `TMP`',
        ].join('\n'),
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/EnvGet.htm',
        exp: [
            'EnvGet, OutputVar, % A_Is64bitOS ? "ProgramW6432" : "ProgramFiles"',
            'MsgBox, % "Program files are in: " OutputVar',
        ],
    },
    ENVSET: {
        keyRawName: 'EnvSet',
        body: 'EnvSet, ${1:EnvVar}, ${2:Value}',
        doc: [
            'Writes a value to a [variable](https://www.autohotkey.com/docs/Variables.htm) contained in the environment.',
            '## Parameters',
            '* EnvVar : ',
            '  Name of the [environment variable](https://www.autohotkey.com/docs/Concepts.htm#environment-variables) to use, e.g. "COMSPEC" or "PATH".',
            '* Value :',
            '  Value to set the [environment variable](https://www.autohotkey.com/docs/Concepts.htm#environment-variables) to.',
        ].join('\n'),
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/EnvSet.htm',
        exp: [
            'EnvSet, AutGUI, Some text to put in the variable.',
        ],
    },
    ENVSUB: {
        keyRawName: 'EnvSub',
        body: 'EnvSub, ${1:Var}, ${2:Value}, ${3|Seconds,Minutes,Hours,Days|}',
        doc: [
            'Sets a [variable](https://www.autohotkey.com/docs/Variables.htm) to itself minus the given value (can also compare [date-time](https://www.autohotkey.com/docs/commands/FileSetTime.htm#YYYYMMDD) values). Synonymous with: `Var -= Value`.',
            '## [Parameters](https://www.autohotkey.com/docs/commands/EnvSub.htm#Parameters)',
            '* Var : ',
            '  The name of the [variable](https://www.autohotkey.com/docs/Variables.htm) upon which to operate.',
            '* Value :',
            '  Any integer, floating point number, or [expression](https://www.autohotkey.com/docs/Variables.htm#Expressions).',
            '* TimeUnits \n',
            '> `Seconds`, `Minutes`, `Hours`, `Days`\n',
        ].join('\n'),
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/EnvSub.htm',
        exp: [
            'var1 := 20050126',
            'var2 := 20040126',
            'EnvSub, var1, %var2%, Days',
            'MsgBox, %var1%  ; The answer will be 366 since 2004 is a leap year.',
        ],
    },
    EXIT: {
        keyRawName: 'Exit',
        body: 'Exit [, ${1:ExitCode}]',
        doc: [
            'Exits the [current thread](https://www.autohotkey.com/docs/misc/Threads.htm) or (if the script is not [persistent](https://www.autohotkey.com/docs/commands/_Persistent.htm)) the entire script.',
            '* ExitCode',
            '',
            '> An integer between -2147483648 and 2147483647 (can be an [expression](https://www.autohotkey.com/docs/Variables.htm#Expressions)) that is returned to its caller when the script exits. This code is accessible to any program that spawned the script, such as another script (via RunWait) or a batch (.bat) file. If omitted, _ExitCode_ defaults to zero. Zero is traditionally used to indicate success.',
        ].join('\n'),
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/Exit.htm',
        exp: [
            '#z::',
            '    Gosub, Sub2',
            '    MsgBox, % "This MsgBox will never happen because of the EXIT."',
            'Return',
            '',
            'Sub2:',
            'Exit  ; Terminate this subroutine as well as the calling subroutine.',
        ],
    },
    EXITAPP: {
        keyRawName: 'ExitApp',
        body: 'ExitApp [, ${1:ExitCode}]',
        doc: [
            'Terminates the script.',
            '* ExitCode',
            '1. An integer between -2147483648 and 2147483647',
            '2. If omitted, _ExitCode_ defaults to zero.',
            '3. Zero is traditionally used to indicate success.',
            '\n\n',
        ].join('\n'),
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/ExitApp.htm',
        exp: [
            'ExitApp [, ExitCode]',
            '',
            ';exp Press a hotkey to terminate the script.',
            '#x::ExitApp  ; Win+X',
        ],
    },
    FILECOPY: {
        keyRawName: 'FileCopy',
        body: 'FileCopy, ${1:Source}, ${2:Dest} [, ${3|0,1|}]',
        doc: [
            'Copies one or more files.',
            '* Overwrite',
            '* If omitted or 0 (false), the command does not overwrite existing files.',
            '* If this parameter is 1 (true), the command overwrites existing files.',
            '',
        ].join('\n'),
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/FileCopy.htm',
        exp: [
            'FileCopy, SourcePattern, DestPattern [, Overwrite]',
            '',
            ';exp1 Makes a copy but keep the original file name.',
            'FileCopy, C:\\My Documents\\List1.txt, D:\\Main Backup\\',
        ],
    },
    FILECOPYDIR: {
        keyRawName: 'FileCopyDir',
        body: 'FileCopyDir, ${1:Source}, ${2:Dest} [, ${3|0,1|}]',
        doc: [
            'Copies a folder along with all its sub-folders and files (similar to xcopy).',
            '* **Overwrite**',
            '* This parameter determines whether to overwrite files if they already exist. If omitted, it defaults to 0 (false). Specify one of the following values:',
            '* 0 (false): Do not overwrite existing files. The operation will fail and have no effect if _Dest_ already exists as a file or directory.',
            '* 1 (true): Overwrite existing files. However, any files or subfolders inside _Dest_ that do not have a counterpart in _Source_ will not be deleted.',
            '* This parameter can be an [expression](https://www.autohotkey.com/docs/Variables.htm#Expressions), even one that evalutes to true or false (since true and false are stored internally as 1 and 0).',
            '',
        ].join('\n'),
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/FileCopyDir.htm',
        exp: [
            'FileCopyDir, Source, Dest [, Overwrite]',
            '',
            ';exp1 Copies a directory to a new location.',
            'FileCopyDir, % "C:\\My Folder", % "C:\\Copy of My Folder"',
        ],
    },
    FILECREATEDIR: {
        keyRawName: 'FileCreateDir',
        body: 'FileCreateDir, ${1:Path}',
        doc: 'Creates a folder.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/FileCreateDir.htm',
        exp: [
            'FileCreateDir, DirName',
            '',
            ';exp1 Creates a new directory, including its parent directories if necessary.',
            'FileCreateDir, % "C:\\Test1\\My Images\\Folder2"',
        ],
    },
    FILECREATESHORTCUT: {
        keyRawName: 'FileCreateShortcut',
        body:
            'FileCreateShortcut, ${1:Target}, ${2:C:\\My Shortcut.lnk } [, ${3:WorkingDir}, ${4:Args}, ${5:Description}, ${6:IconFile}, ${7:ShortcutKey}, ${8:IconNumber}, ${9|1,3,7|}',
        doc: 'Creates a shortcut (.lnk) file.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/FileCreateShortcut.htm',
        exp: [
            'FileCreateShortcut, Target, LinkFile [, WorkingDir, Args, Description, IconFile, ShortcutKey, IconNumber, RunState]',
            '',
            ';exp1 The letter "i" in the last parameter makes the shortcut key be Ctrl+Alt+I.',
            'FileCreateShortcut, Notepad.exe, %A_Desktop%\\My Shortcut.lnk, C:\\, "%A_ScriptFullPath%", My Description, C:\\My Icon.ico, i',
        ],
    },
    FILEDELETE: {
        keyRawName: 'FileDelete',
        body: 'FileDelete, ${1:FilePattern}',
        doc: 'Deletes one or more files.',
        // FIXME
    },
    FILEENCODING: {
        keyRawName: 'FileEncoding',
        body: 'FileEncoding, [${1:Encoding}]',
        doc: 'Sets the default encoding for FileRead, FileReadLine, Loop Read, FileAppend, and FileOpen().',
    },
    FILEGETATTRIB: {
        keyRawName: 'FileGetAttrib',
        body: 'FileGetAttrib, ${1:OutputVar} , [${2:Filename}]',
        doc: 'Reports whether a file or folder is read-only, hidden, etc.',
        recommended: false,
        link: 'https://www.autohotkey.com/docs/commands/FileGetAttrib.htm',
        exp: [
            'FileGetAttrib, OutputVar , Filename',
            ';exp',
            'FileGetAttrib, OutputVar, % "C:\\New Folder"',
        ],
    },
    FILEGETSHORTCUT: {
        keyRawName: 'FileGetShortcut',
        body:
            'FileGetShortcut, ${1:LinkFile [}, ${2:OutTarget}, ${3:OutDir}, ${4:OutArgs}, ${5:Outdoc}, ${6:OutIcon}, ${7:OutIconNum}, ${8:OutRunState]}',
        doc: 'Retrieves information about a shortcut (.lnk) file, such as its target file.',
    },
    FILEGETSIZE: {
        keyRawName: 'FileGetSize',
        body: 'FileGetSize, ${1:OutputVar [}, ${2:Filename}, ${3:Units]}',
        doc: 'Retrieves the size of a file.',
    },
    FILEGETTIME: {
        keyRawName: 'FileGetTime',
        body: 'FileGetTime, ${1:OutputVar [}, ${2:Filename}, ${3:WhichTime (M}, ${4:C}, ${5:or A -- default is M)]}',
        doc: 'Retrieves the datetime stamp of a file or folder.',
    },
    FILEGETVERSION: {
        keyRawName: 'FileGetVersion',
        body: 'FileGetVersion, ${1:OutputVar [}, ${2:Filename]}',
        doc: 'Retrieves the version of a file.',
    },
    FILEINSTALL: {
        keyRawName: 'FileInstall',
        body: 'FileInstall, ${1:Source}, ${2:Dest [}, ${3:Flag (1 = overwrite)]}',
        doc: 'Includes the specified file inside the compiled version of the script.',
    },
    FILEMOVE: {
        keyRawName: 'FileMove',
        body: 'FileMove, ${1:Source}, ${2:Dest [}, ${3:Flag (1 = overwrite)]}',
        doc: 'Moves or renames one or more files.',
    },
    FILEMOVEDIR: {
        keyRawName: 'FileMoveDir',
        body: 'FileMoveDir, ${1:Source}, ${2:Dest [}, ${3:Flag (2 = overwrite)]}',
        doc: 'Moves a folder along with all its sub-folders and files. It can also rename a folder.',
    },
    FILEREAD: {
        keyRawName: 'FileRead',
        body: 'FileRead, ${1:OutputVar}, ${2:Filename}',
        doc: 'Reads a file\'s contents into a [variable](https://www.autohotkey.com/docs/Variables.htm).',
        recommended: true,
        exp: [
            'FileRead, OutputVar, % "C:\\My Documents\\My File.txt"',
        ],
    },
    FILEREADLINE: {
        keyRawName: 'FileReadLine',
        body: 'FileReadLine, ${1:OutputVar}, ${2:Filename}, ${3:LineNum}',
        doc: 'Reads the specified line from a file and stores the text in a variable.',
    },
    FILERECYCLE: {
        keyRawName: 'FileRecycle',
        body: 'FileRecycle, ${1:FilePattern}',
        doc: 'Sends a file or directory to the recycle bin if possible, or permanently deletes it.',
    },
    FILERECYCLEEMPTY: {
        keyRawName: 'FileRecycleEmpty',
        body: 'FileRecycleEmpty, ${1:[ C:\\]}',
        doc: 'Empties the recycle bin.',
    },
    FILEREMOVEDIR: {
        keyRawName: 'FileRemoveDir',
        body: 'FileRemoveDir, ${1:Path [}, ${2:Recurse? (1 = yes)]}',
        doc: 'Deletes a folder.',
    },
    FILESELECTFILE: {
        keyRawName: 'FileSelectFile',
        body:
            'FileSelectFile, ${1:OutputVar [}, ${2:Options}, ${3:RootDir[\\DefaultFilename]}, ${4:Prompt}, ${5:Filter]}',
        doc: 'Displays a standard dialog that allows the user to open or save file(s).',
    },
    FILESELECTFOLDER: {
        keyRawName: 'FileSelectFolder',
        body: 'FileSelectFolder, ${1:OutputVar [}, ${2:*StartingFolder}, ${3:Options}, ${4:Prompt]}',
        doc: 'Displays a standard dialog that allows the user to select a folder.',
    },
    FILESETATTRIB: {
        keyRawName: 'FileSetAttrib',
        body: 'FileSetAttrib, ${1:Attributes(+-^RASHNOT) [}, ${2:FilePattern}, ${3:OperateOnFolders?}, ${4:Recurse?]}',
        doc: 'Changes the attributes of one or more files or folders. Wildcards are supported.',
    },
    FILESETTIME: {
        keyRawName: 'FileSetTime',
        body:
            'FileSetTime, ${1:[ YYYYMMDDHH24MISS}, ${2:FilePattern}, ${3:WhichTime (M|C|A)}, ${4:OperateOnFolders?}, ${5:Recurse?]}',
        doc: 'Changes the datetime stamp of one or more files or folders. Wildcards are supported.',
    },
    FOR: {
        keyRawName: 'For',
        body: 'For ${1:Key} , [${2:Value}] in Expression',
        doc: 'Repeats a series of commands once for each key-value pair in an object.',
    },
    FORMATTIME: {
        keyRawName: 'FormatTime',
        body: 'FormatTime, ${1:OutputVar [}, ${2:YYYYMMDDHH24MISS}, ${3:Format]}',
        doc: 'Transforms a YYYYMMDDHH24MISS timestamp into the specified date/time format.',
    },
    GETKEYSTATE: {
        keyRawName: 'GETKEYSTATE',
        body: '',
        doc: '**Deprecated:** This command is not recommended for use in new scripts. Use the [GetKeyState](https://www.autohotkey.com/docs/commands/GetKeyState.htm#function) function instead.',
        recommended: false,
        link: 'https://www.autohotkey.com/docs/commands/GetKeyState.htm#command',
        exp: [
            'GetKeyState, OutputVar, KeyName , Mode',
            ' ',
            'KeyIsDown := GetKeyState(KeyName , Mode)',
        ],
    },
    GLOBAL: {
        keyRawName: 'global',
        body: 'global',
        doc: 'To refer to an existing global variable inside a function (or create a new one), declare the variable as global prior to using it.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/Functions.htm#Global',
        exp: [
            'global LogFileName  ; This global variable was previously given a value somewhere outside this function.',
        ],
    },
    GROUPACTIVATE: {
        keyRawName: 'GroupActivate',
        body: 'GroupActivate, ${1:GroupName [}, ${2:R]}',
        doc: 'Activates the next window in a window group that was defined with GroupAdd.',
    },
    GROUPADD: {
        keyRawName: 'GroupAdd',
        body:
            'GroupAdd, ${1:GroupName}, ${2:WinTitle [}, ${3:WinText}, ${4:Label}, ${5:ExcludeTitle}, ${6:ExcludeText]}',
        doc: 'Adds a window specification to a window group, creating the group if necessary.',
    },
    GROUPCLOSE: {
        keyRawName: 'GroupClose',
        body: 'GroupClose, ${1:GroupName [}, ${2:A|R]}',
        doc: 'Closes the active window if it was just activated by GroupActivate or GroupDeactivate. It then activates the next window in the series. It can also close all windows in a group.',
    },
    GROUPDEACTIVATE: {
        keyRawName: 'GroupDeactivate',
        body: 'GroupDeactivate, ${1:GroupName [}, ${2:R]}',
        doc: 'Similar to GroupActivate except activates the next window not in the group.',
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
    LISTHOTKEYS: {
        keyRawName: 'ListHotkeys',
        body: 'ListHotkeys',
        doc: 'Displays the hotkeys in use by the current script, whether their subroutines are currently running, and whether or not they use the [keyboard](https://www.autohotkey.com/docs/commands/_InstallKeybdHook.htm) or [mouse](https://www.autohotkey.com/docs/commands/_InstallMouseHook.htm) hook.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/ListHotkeys.htm',
        exp: ['ListHotkeys'],
    },
    LISTLINES: {
        keyRawName: 'ListLines',
        body: 'ListLines, ${1:[ On|Off]}',
        doc: 'Displays the script lines most recently executed.',
    },
    LISTVARS: {
        keyRawName: 'ListVars',
        body: 'ListVars',
        doc: 'Displays the script\'s [variables](https://www.autohotkey.com/docs/Variables.htm): their names and current contents.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/ListVars.htm',
        exp: ['ListVars'],
    },
    LOCAL: {
        keyRawName: 'Local',
        body: 'Local, ${1:VariableName}',
        doc: 'Local variables are specific to a single function and are visible only inside that function. Consequently, a local variable may have the same name as a global variable and both will have separate contents. Separate functions may also safely use the same variable names.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/Functions.htm#Local',
        exp: [
            'Local variables are specific to a single function and are visible only inside that function. Consequently, a local variable may have the same name as a global variable and both will have separate contents. Separate functions may also safely use the same variable names.',
            '',
            'All local variables which are not [static](https://www.autohotkey.com/docs/Functions.htm#static) are automatically freed (made empty) when the function returns.',
            '',
            'Built-in variables such as [Clipboard](https://www.autohotkey.com/docs/misc/Clipboard.htm), [ErrorLevel](https://www.autohotkey.com/docs/misc/ErrorLevel.htm), and [A\\_TimeIdle](https://www.autohotkey.com/docs/Variables.htm#TimeIdle) are never local (they can be accessed from anywhere), and cannot be redeclared.',
            '',
            'Functions are **assume-local** by default. Variables accessed or created inside an assume-local function are local by default, with the following exceptions:',
            '',
            '- [Super-global](https://www.autohotkey.com/docs/Functions.htm#SuperGlobal) variables, including [classes](https://www.autohotkey.com/docs/Objects.htm#Custom_Classes).',
            '- A [dynamic variable reference](https://www.autohotkey.com/docs/Functions.htm#DynVar) may resolve to an existing global variable if no local variable exists by that name.',
            '- [Commands that create pseudo-arrays](https://www.autohotkey.com/docs/Functions.htm#PseudoArrays) may create all elements as global even if only the first element is declared.',
            '',
            'The default may also be overridden as shown below (by declaring the variable or by changing the mode of the function).',
            '',
            '**Force-local mode** [\\[v1.1.27+\\]](https://www.autohotkey.com/docs/AHKL_ChangeLog.htm#v1.1.27.00 "Applies to AutoHotkey v1.1.27 and later"): If the function\'s first line is the word "local", all variable references (even dynamic ones) are assumed to be local unless they are declared as global _inside_ the function. Unlike the default mode, force-local mode has the following behavior:',
            '',
            '- Super-global variables (including classes) cannot be accessed without declaring them inside the function.',
            '- Dynamic variable references follow the same rules as non-dynamic ones. Only global variables which are declared inside the function can be accessed.',
            '- StringSplit and other commands which create pseudo-arrays follow the same rules as non-dynamic variable references (avoiding a common source of confusion).',
            '- The _LocalSameAsGlobal_ [warning](https://www.autohotkey.com/docs/commands/_Warn.htm) is never raised for variables within a force-local function.',
        ],
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
    SETFORMAT: {
        keyRawName: 'SetFormat',
        body: 'SetFormat, NumberType, Format',
        doc: '**Deprecated:** This command is not recommended for use in new scripts. Use the [Format](https://www.autohotkey.com/docs/commands/Format.htm) function instead.',
        recommended: false,
        link: 'https://www.autohotkey.com/docs/commands/SetFormat.htm',
        exp: ['SetFormat, NumberType, Format'],
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
    SLEEP: {
        keyRawName: 'Sleep',
        body: 'Sleep, ${1:Delay}',
        doc: 'Waits the specified amount of time before continuing.',
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
    STATIC: {
        keyRawName: 'Static',
        body: 'Static LoggedLines := 0',
        doc: 'Static variables are always implicitly local, but differ from locals because their values are remembered between calls.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/Functions.htm#static',
        exp: [
            'LogToFile(TextToLog)',
            '{',
            '    static LoggedLines := 0',
            '    LoggedLines += 1  ; Maintain a tally locally (its value is remembered between calls).',
            '    global LogFileName',
            '    FileAppend, %LoggedLines%: %TextToLog%`n, %LogFileName%',
            '}',
        ],
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
    STRINGGETPOS: {
        keyRawName: 'StringGetPos',
        body: 'StringGetPos, OutputVar, InputVar, SearchText , Occurrence, Offset',
        doc: 'Retrieves the position of the specified substring within a string.\n\n**Deprecated:** This command is not recommended for use in new scripts. Use the [InStr](https://www.autohotkey.com/docs/commands/InStr.htm) function instead.',
        recommended: false,
        link: 'https://www.autohotkey.com/docs/commands/StringGetPos.htm',
        exp: ['StringGetPos, OutputVar, InputVar, SearchText [, Occurrence, Offset]'],
    },
    STRINGLEFT: {
        keyRawName: 'StringLeft',
        body: 'StringLeft, OutputVar, InputVar, Count',
        doc: 'Retrieves a number of characters from the left or right-hand side of a string.\n\n**Deprecated:** These commands are not recommended for use in new scripts. Use the [SubStr](https://www.autohotkey.com/docs/commands/SubStr.htm) function instead.',
        recommended: false,
        link: 'https://www.autohotkey.com/docs/commands/StringLeft.htm',
        exp: ['StringLeft, OutputVar, InputVar, Count'],
    },
    STRINGLEN: {
        keyRawName: 'StringLen',
        body: 'StringLen, OutputVar, InputVar',
        doc: 'Retrieves the count of how many characters are in a string.\n\n**Deprecated:** This command is not recommended for use in new scripts. Use the [StrLen](https://www.autohotkey.com/docs/commands/StrLen.htm) function instead.',
        recommended: false,
        link: 'https://www.autohotkey.com/docs/commands/StringLen.htm',
        exp: ['StringLen, OutputVar, InputVar'],
    },
    STRINGLOWER: {
        keyRawName: 'StringLower',
        body: 'StringLower, ${1:OutputVar}, ${2:InputVar} [, T]',
        doc: 'Converts a string to lowercase or uppercase.',
        recommended: false,
        link: 'https://www.autohotkey.com/docs/commands/StringLower.htm',
        exp: ['StringLower, OutputVar, InputVar , T'],
    },
    STRINGMID: {
        keyRawName: 'StringMid',
        body: 'StringMid, OutputVar, InputVar, StartChar [, Count, L]',
        doc: 'Retrieves one or more characters from the specified position in a string.\n\n**Deprecated:** This command is not recommended for use in new scripts. Use the [SubStr](https://www.autohotkey.com/docs/commands/SubStr.htm) function instead.',
        recommended: false,
        link: 'https://www.autohotkey.com/docs/commands/StringMid.htm',
        exp: ['StringMid, OutputVar, InputVar, StartChar , Count, L'],
    },
    STRINGREPLACE: {
        keyRawName: 'StringReplace',
        body: 'StringReplace, OutputVar, InputVar, SearchText , ReplaceText, ReplaceAll',
        doc: 'Replaces the specified substring with a new string.\n\n**Deprecated:** This command is not recommended for use in new scripts. Use the [StrReplace](https://www.autohotkey.com/docs/commands/StrReplace.htm) function instead.',
        recommended: false,
        link: 'https://www.autohotkey.com/docs/commands/StringReplace.htm',
        exp: ['StringReplace, OutputVar, InputVar, SearchText , ReplaceText, ReplaceAll'],
    },
    STRINGRIGHT: {
        keyRawName: 'StringRight',
        body: 'StringRight, OutputVar, InputVar, Count',
        doc: 'Retrieves a number of characters from the left or right-hand side of a string.\n\n**Deprecated:** These commands are not recommended for use in new scripts. Use the [SubStr](https://www.autohotkey.com/docs/commands/SubStr.htm) function instead.',
        recommended: false,
        link: 'https://www.autohotkey.com/docs/commands/StringLeft.htm',
        exp: ['StringRight, OutputVar, InputVar, Count'],
    },
    STRINGTRIMLEFT: {
        keyRawName: 'StringTrimLeft',
        body: 'StringTrimLeft, OutputVar, InputVar, Count',
        doc: 'Removes a number of characters from the left or right-hand side of a string.\n\n**Deprecated:** These commands are not recommended for use in new scripts. Use the [SubStr](https://www.autohotkey.com/docs/commands/SubStr.htm) function instead.',
        recommended: false,
        link: 'https://www.autohotkey.com/docs/commands/StringTrimLeft.htm',
        exp: ['StringTrimLeft, OutputVar, InputVar, Count'],
    },
    STRINGTRIMRIGHT: {
        keyRawName: 'StringTrimRight',
        body: 'StringTrimRight, OutputVar, InputVar, Count',
        doc: 'Removes a number of characters from the left or right-hand side of a string.\n\n**Deprecated:** These commands are not recommended for use in new scripts. Use the [SubStr](https://www.autohotkey.com/docs/commands/SubStr.htm) function instead.',
        recommended: false,
        link: 'https://www.autohotkey.com/docs/commands/StringTrimLeft.htm',
        exp: ['StringTrimRight, OutputVar, InputVar, Count'],
    },
    STRINGUPPER: {
        keyRawName: 'StringUpper',
        body: 'StringUpper, OutputVar, InputVar [, T]',
        doc: 'Converts a string to lowercase or uppercase.\n\nCommand -> func https://www.autohotkey.com/docs/Language.htm#commands-vs-functions',
        recommended: false,
        link: 'https://www.autohotkey.com/docs/commands/StringLower.htm',
        exp: ['StringUpper, OutputVar, InputVar , T'],
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
        body: 'ToolTip, ${1:[ Text}, ${2:X}, ${3:Y}, ${4:1_to_20]}',
        doc: 'Creates an always-on-top window anywhere on the screen.',
    },
    TRANSFORM: {
        keyRawName: 'TRANSFORM',
        body: 'Transform, OutputVar, SubCommand, Value1 [, Value2]',
        doc: 'Performs miscellaneous math functions, bitwise operations, and tasks such as ASCII/Unicode conversion.\n\n**Deprecated:** This command is not recommended for use in new scripts. For details on what you can use instead, see the sub-command sections below.',
        recommended: false,
        link: 'https://www.autohotkey.com/docs/commands/Transform.htm',
        exp: ['Transform, OutputVar, SubCommand, Value1 [, Value2]'],
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

    WINACTIVATE: {
        keyRawName: 'WinActivate',
        body: 'WinActivate, ${1:[ WinTitle}, ${2:WinText}, ${3:ExcludeTitle}, ${4:ExcludeText]}',
        doc: 'Activates the specified window.',
    },
    WINACTIVATEBOTTOM: {
        keyRawName: 'WinActivateBottom',
        body: 'WinActivateBottom, ${1:[ WinTitle}, ${2:WinText}, ${3:ExcludeTitle}, ${4:ExcludeText]}',
        doc: 'Same as WinActivate except that it activates the bottommost matching window rather than the topmost.',
    },
    WINCLOSE: {
        keyRawName: 'WinClose',
        body: 'WinClose, ${1:[ WinTitle}, ${2:WinText}, ${3:SecondsToWait}, ${4:ExcludeTitle}, ${5:ExcludeText]}',
        doc: 'Closes the specified window.',
    },
    WINGET: {
        keyRawName: 'WinGet',
        body: 'WinGet, ${1:OutputVar [}, ${2:Cmd}, ${3:WinTitle}, ${4:WinText}, ${5:ExcludeTitle}, ${6:ExcludeText]}',
        doc: 'Retrieves the specified window\'s unique ID, process ID, process name, or a list of its controls. It can also retrieve a list of all windows matching the specified criteria.',
    },
    WINGETACTIVESTATS: {
        keyRawName: 'WinGetActiveStats',
        body: 'WinGetActiveStats, ${1:Title}, ${2:Width}, ${3:Height}, ${4:X}, ${5:Y}',
        doc: 'Combines the functions of WinGetActiveTitle and WinGetPos into one command.',
    },
    WINGETACTIVETITLE: {
        keyRawName: 'WinGetActiveTitle',
        body: 'WinGetActiveTitle, ${1:OutputVar}',
        doc: 'Retrieves the title of the active window.',
    },
    WINGETCLASS: {
        keyRawName: 'WinGetClass',
        body: 'WinGetClass, ${1:OutputVar [}, ${2:WinTitle}, ${3:WinText}, ${4:ExcludeTitle}, ${5:ExcludeText]}',
        doc: 'Retrieves the specified window\'s class name.',
    },
    WINGETPOS: {
        keyRawName: 'WinGetPos',
        body:
            'WinGetPos, ${1:[X}, ${2:Y}, ${3:Width}, ${4:Height}, ${5:WinTitle}, ${6:WinText}, ${7:ExcludeTitle}, ${8:ExcludeText]}',
        doc: 'Retrieves the position and size of the specified window.',
    },
    WINGETTEXT: {
        keyRawName: 'WinGetText',
        body: 'WinGetText, ${1:OutputVar [}, ${2:WinTitle}, ${3:WinText}, ${4:ExcludeTitle}, ${5:ExcludeText]}',
        doc: 'Retrieves the text from the specified window.',
    },
    WINGETTITLE: {
        keyRawName: 'WinGetTitle',
        body: 'WinGetTitle, ${1:OutputVar [}, ${2:WinTitle}, ${3:WinText}, ${4:ExcludeTitle}, ${5:ExcludeText]}',
        doc: 'Retrieves the title of the specified window.',
    },
    WINHIDE: {
        keyRawName: 'WinHide',
        body: 'WinHide,${1:[ WinTitle}, ${2:WinText}, ${3:ExcludeTitle}, ${4:ExcludeText]}',
        doc: 'Hides the specified window.',
    },
    WINKILL: {
        keyRawName: 'WinKill',
        body: 'WinKill,${1:[ WinTitle}, ${2:WinText}, ${3:SecondsToWait}, ${4:ExcludeTitle}, ${5:ExcludeText]}',
        doc: 'Forces the specified window to close.',
    },
    WINMAXIMIZE: {
        keyRawName: 'WinMaximize',
        body: 'WinMaximize, ${1:[ WinTitle}, ${2:WinText}, ${3:ExcludeTitle}, ${4:ExcludeText]}',
        doc: 'Enlarges the specified window to its maximum size.',
    },
    WINMENUSELECTITEM: {
        keyRawName: 'WinMenuSelectItem',
        body:
            'WinMenuSelectItem, ${1:WinTitle}, ${2:WinText}, ${3:Menu [}, ${4:SubMenu1}, ${5:SubMenu2}, ${6:SubMenu3}, ${7:SubMenu4}, ${8:SubMenu5}, ${9:SubMenu6}, ${10:ExcludeTitle}',
        doc: 'Invokes a menu item from the menu bar of the specified window.',
    },
    WINMINIMIZE: {
        keyRawName: 'WinMinimize',
        body: 'WinMinimize, ${1:[ WinTitle}, ${2:WinText}, ${3:ExcludeTitle}, ${4:ExcludeText]}',
        doc: 'Collapses the specified window into a button on the task bar.',
    },
    WINMINIMIZEALL: {
        keyRawName: 'WinMinimizeAll',
        body: 'WinMinimizeAll',
        doc: 'Minimizes all windows.',
    },
    WINMINIMIZEALLUNDO: {
        keyRawName: 'WinMinimizeAllUndo',
        body: 'WinMinimizeAllUndo',
        doc: 'Unminimizes all windows.',
    },
    WINMOVE: {
        keyRawName: 'WinMove',
        body:
            'WinMove, ${1:WinTitle}, ${2:WinText}, ${3:X}, ${4:Y}, ${5:[Width}, ${6:Height}, ${7:ExcludeTitle}, ${8:ExcludeText]}',
        doc: 'Changes the position and/or size of the specified window.',
    },
    WINRESTORE: {
        keyRawName: 'WinRestore',
        body: 'WinRestore, ${1:[ WinTitle}, ${2:WinText}, ${3:ExcludeTitle}, ${4:ExcludeText]}',
        doc: 'Unminimizes or unmaximizes the specified window if it is minimized or maximized.',
    },
    WINSET: {
        keyRawName: 'WinSet',
        body:
            'WinSet, ${1:AlwaysOnTop|Trans}, ${2:On|Off|Toggle|Value(0-255) [}, ${3:WinTitle}, ${4:WinText}, ${5:ExcludeTitle}, ${6:ExcludeText]}',
        doc: 'Makes a variety of changes to the specified window, such as "always on top" and transparency.',
    },
    WINSETTITLE: {
        keyRawName: 'WinSetTitle',
        body: 'WinSetTitle, ${1:WinTitle}, ${2:WinText}, ${3:NewTitle [}, ${4:ExcludeTitle}, ${5:ExcludeText]}',
        doc: 'Changes the title of the specified window.',
    },
    WINSHOW: {
        keyRawName: 'WinShow',
        body: 'WinShow, ${1:[ WinTitle}, ${2:WinText}, ${3:ExcludeTitle}, ${4:ExcludeText]}',
        doc: 'Unhides the specified window.',
    },
    WINWAIT: {
        keyRawName: 'WinWait',
        body: 'WinWait, ${1:WinTitle}, ${2:WinText}, ${3:Seconds [}, ${4:ExcludeTitle}, ${5:ExcludeText]}',
        doc: 'Waits until the specified window exists.',
    },
    WINWAITACTIVE: {
        keyRawName: 'WinWaitActive',
        body: 'WinWaitActive, ${1:[ WinTitle}, ${2:WinText}, ${3:Seconds}, ${4:ExcludeTitle}, ${5:ExcludeText]}',
        doc: 'Waits until the specified window is active.',
    },
    WINWAITCLOSE: {
        keyRawName: 'WinWaitClose',
        body: 'WinWaitClose, ${1:WinTitle}, ${2:WinText}, ${3:Seconds [}, ${4:ExcludeTitle}, ${5:ExcludeText]}',
        doc: 'Waits until the specified window does not exist.',
    },
    WINWAITNOTACTIVE: {
        keyRawName: 'WinWaitNotActive',
        body: 'WinWaitNotActive, ${1:[ WinTitle}, ${2:WinText}, ${3:Seconds}, ${4:ExcludeTitle}, ${5:ExcludeText]}',
        doc: 'Waits until the specified window is not active.',
    },
};

function commandElement2Md(DirectivesElement: TCommandElement): vscode.MarkdownString {
    const {
        keyRawName,
        body,
        doc,
        link,
        exp,
    } = DirectivesElement;
    const md: vscode.MarkdownString = new vscode.MarkdownString('', true)
        .appendMarkdown('Command')
        .appendCodeblock(keyRawName, 'ahk')
        .appendCodeblock(body, 'ahk')
        .appendMarkdown(doc)
        .appendMarkdown('\n')
        .appendMarkdown(`[(Read Doc)](${link ?? 'https://www.autohotkey.com/docs/commands/index.htm'})`) // FIXME
        .appendMarkdown('\n\n***')
        .appendMarkdown('\n\n*exp:*');
    // .appendCodeblock(exp.join('\n'));
    if ((exp !== undefined) && exp.length > 0) {
        md.appendCodeblock(exp.join('\n'), 'ahk');
    }
    md.supportHtml = true;
    return md;
}

export const CommandMDMap: ReadonlyMap<string, vscode.MarkdownString> = new Map(
    [...Object.entries(LineCommand)]
        .map(([ukName, BiFunc]: [string, TCommandElement]) => [ukName, commandElement2Md(BiFunc)]),
);

const snippetCommand: readonly vscode.CompletionItem[] = ((): vscode.CompletionItem[] => {
    const tempList: vscode.CompletionItem[] = [];
    for (const [k, v] of Object.entries(LineCommand)) {
        const { keyRawName, body, recommended } = v;
        const label: vscode.CompletionItemLabel = {
            label: keyRawName,
            description: 'Command',
        };
        const item: vscode.CompletionItem = new vscode.CompletionItem(label);
        item.kind = vscode.CompletionItemKind.Field; // icon of https://code.visualstudio.com/docs/editor/intellisense#_types-of-completions
        item.insertText = new vscode.SnippetString(body);

        item.detail = 'Command of AHK (neko-help)'; // description
        item.documentation = CommandMDMap.get(k) ?? commandElement2Md(v);

        if (recommended !== undefined && recommended === false) {
            item.tags = [vscode.CompletionItemTag.Deprecated];
        }

        tempList.push(item);
    }
    return tempList;
})();

export function getSnippetCommand(PartStr: string): readonly vscode.CompletionItem[] {
    return PartStr.startsWith('A_')
        ? []
        : snippetCommand;
}

export function getHoverCommand(
    fistWordUp: string,
    position: vscode.Position,
    lStr: string,
): vscode.MarkdownString | undefined {
    if (fistWordUp === '') return undefined;

    const { character } = position;
    const posS = lStr.length - lStr.trimStart().length;
    if (character < posS) return undefined;

    const posE = posS + fistWordUp.length;
    if (character > posE) return undefined;

    return CommandMDMap.get(fistWordUp);
}

export function getHoverCommand2(wordUp: string): vscode.MarkdownString | undefined {
    return CommandMDMap.get(wordUp);
}
