/* cSpell:disable */
/* eslint-disable max-len */
/* eslint-disable max-lines */
/* eslint-disable no-template-curly-in-string */

import { EDiagCode } from '../../diag';

// TODO: if g_act have ... rm statement

type TCommandKeyList =
    | 'AUTOTRIM'
    | 'BETWEEN'
    | 'BLOCKINPUT'
    | 'CASE'
    | 'CATCH'
    | 'CLASS'
    | 'CLICK'
    | 'CLIPWAIT'
    | 'CONTINUE'
    | 'CONTROL'
    | 'CONTROLCLICK'
    | 'CONTROLFOCUS'
    | 'CONTROLGET'
    | 'CONTROLGETFOCUS'
    | 'CONTROLGETPOS'
    | 'CONTROLGETTEXT'
    | 'CONTROLMOVE'
    | 'CONTROLSEND'
    | 'CONTROLSENDRAW'
    | 'CONTROLSETTEXT'
    | 'COORDMODE'
    | 'CRITICAL'
    | 'DEFAULT'
    | 'DETECTHIDDENTEXT'
    | 'DETECTHIDDENWINDOWS'
    | 'DRIVE'
    | 'DRIVEGET'
    | 'DRIVESPACEFREE'
    | 'EDIT'
    | 'ENVADD'
    | 'ENVDIV'
    | 'ENVGET'
    | 'ENVMULT'
    | 'ENVSET'
    | 'ENVSUB'
    | 'ENVUPDATE'
    | 'EXIT'
    | 'EXITAPP'
    | 'FILEAPPEND'
    | 'FILECOPY'
    | 'FILECOPYDIR'
    | 'FILECREATEDIR'
    | 'FILECREATESHORTCUT'
    | 'FILEDELETE'
    | 'FILEENCODING'
    | 'FILEGETATTRIB'
    | 'FILEGETSHORTCUT'
    | 'FILEGETSIZE'
    | 'FILEGETTIME'
    | 'FILEGETVERSION'
    | 'FILEINSTALL'
    | 'FILEMOVE'
    | 'FILEMOVEDIR'
    | 'FILEREAD'
    | 'FILEREADLINE'
    | 'FILERECYCLE'
    | 'FILERECYCLEEMPTY'
    | 'FILEREMOVEDIR'
    | 'FILESELECTFILE'
    | 'FILESELECTFOLDER'
    | 'FILESETATTRIB'
    | 'FILESETTIME'
    | 'FINALLY'
    | 'FOR'
    | 'FORMATTIME'
    | 'GETKEYSTATE'
    | 'GLOBAL'
    | 'GOSUB'
    | 'GOTO'
    | 'GROUPACTIVATE'
    | 'GROUPADD'
    | 'GROUPCLOSE'
    | 'GROUPDEACTIVATE'
    | 'GUI'
    | 'GUICONTROL'
    | 'GUICONTROLGET'
    | 'HOTKEY'
    | 'IFEQUAL'
    | 'IFEXIST'
    | 'IFGREATER'
    | 'IFGREATEROREQUAL'
    | 'IFINSTRING'
    | 'IFLESS'
    | 'IFLESSOREQUAL'
    | 'IFMSGBOX'
    | 'IFNOTEQUAL'
    | 'IFNOTEXIST'
    | 'IFNOTINSTRING'
    | 'IFWINACTIVE'
    | 'IFWINEXIST'
    | 'IFWINNOTACTIVE'
    | 'IFWINNOTEXIST'
    | 'IMAGESEARCH'
    | 'INIDELETE'
    | 'INIREAD'
    | 'INIWRITE'
    | 'INPUT'
    | 'INPUTBOX'
    | 'KEYHISTORY'
    | 'KEYWAIT'
    | 'LISTHOTKEYS'
    | 'LISTLINES'
    | 'LISTVARS'
    | 'LOCAL'
    | 'LOOP'
    | 'MENU'
    | 'MOUSECLICK'
    | 'MOUSECLICKDRAG'
    | 'MOUSEGETPOS'
    | 'MOUSEMOVE'
    | 'MSGBOX'
    | 'ONEXIT'
    | 'OUTPUTDEBUG'
    | 'PAUSE'
    | 'PIXELGETCOLOR'
    | 'PIXELSEARCH'
    | 'POSTMESSAGE'
    | 'PROCESS'
    | 'PROGRESS'
    | 'RANDOM'
    | 'REGDELETE'
    | 'REGREAD'
    | 'REGWRITE'
    | 'RELOAD'
    | 'RETURN'
    | 'RUN'
    | 'RUNAS'
    | 'RUNWAIT'
    | 'SEND'
    | 'SENDEVENT'
    | 'SENDINPUT'
    | 'SENDLEVEL'
    | 'SENDMESSAGE'
    | 'SENDMODE'
    | 'SENDPLAY'
    | 'SENDRAW'
    | 'SETBATCHLINES'
    | 'SETCAPSLOCKSTATE'
    | 'SETCONTROLDELAY'
    | 'SETDEFAULTMOUSESPEED'
    | 'SETENV'
    | 'SETFORMAT'
    | 'SETKEYDELAY'
    | 'SETMOUSEDELAY'
    | 'SETNUMLOCKSTATE'
    | 'SETREGVIEW'
    | 'SETSCROLLLOCKSTATE'
    | 'SETSTORECAPSLOCKMODE'
    | 'SETTIMER'
    | 'SETTITLEMATCHMODE'
    | 'SETWINDELAY'
    | 'SETWORKINGDIR'
    | 'SHUTDOWN'
    | 'SLEEP'
    | 'SORT'
    | 'SOUNDBEEP'
    | 'SOUNDGET'
    | 'SOUNDGETWAVEVOLUME'
    | 'SOUNDPLAY'
    | 'SOUNDSET'
    | 'SOUNDSETWAVEVOLUME'
    | 'SPLASHIMAGE'
    | 'SPLASHTEXTOFF'
    | 'SPLASHTEXTON'
    | 'SPLITPATH'
    | 'STATIC'
    | 'STATUSBARGETTEXT'
    | 'STATUSBARWAIT'
    | 'STRINGCASESENSE'
    | 'STRINGGETPOS'
    | 'STRINGLEFT'
    | 'STRINGLEN'
    | 'STRINGLOWER'
    | 'STRINGMID'
    | 'STRINGREPLACE'
    | 'STRINGRIGHT'
    | 'STRINGSPLIT'
    | 'STRINGTRIMLEFT'
    | 'STRINGTRIMRIGHT'
    | 'STRINGUPPER'
    | 'SUSPEND'
    | 'SWITCH'
    | 'SYSGET'
    | 'THREAD'
    | 'THROW'
    | 'TOOLTIP'
    | 'TRANSFORM'
    | 'TRAYTIP'
    | 'TRY'
    | 'UNTIL'
    | 'URLDOWNLOADTOFILE'
    | 'WHILE'
    | 'WINACTIVATE'
    | 'WINACTIVATEBOTTOM'
    | 'WINCLOSE'
    | 'WINGET'
    | 'WINGETACTIVESTATS'
    | 'WINGETACTIVETITLE'
    | 'WINGETCLASS'
    | 'WINGETPOS'
    | 'WINGETTEXT'
    | 'WINGETTITLE'
    | 'WINHIDE'
    | 'WINKILL'
    | 'WINMAXIMIZE'
    | 'WINMENUSELECTITEM'
    | 'WINMINIMIZE'
    | 'WINMINIMIZEALL'
    | 'WINMINIMIZEALLUNDO'
    | 'WINMOVE'
    | 'WINRESTORE'
    | 'WINSET'
    | 'WINSETTITLE'
    | 'WINSHOW'
    | 'WINWAIT'
    | 'WINWAITACTIVE'
    | 'WINWAITCLOSE'
    | 'WINWAITNOTACTIVE';

export type TCommandElement = {
    keyRawName: string;
    body: string;
    doc: string;
    // TODO : remove "?"
    recommended?: boolean;
    link?: `https://www.autohotkey.com/docs/${string}`;
    exp?: readonly string[];
    diag?: EDiagCode;
};

type TLineCommand = {
    [k in TCommandKeyList]: Readonly<TCommandElement>;
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
    BETWEEN: {
        keyRawName: 'between',
        body: 'between',
        doc: 'Determines whether [traditional assignments](https://www.autohotkey.com/docs/commands/SetEnv.htm "Deprecated. New scripts should use Var := Value instead.") like `Var1 = %Var2%` omit spaces and tabs from the beginning and end of _Var2_.',
        recommended: false,
        link: 'https://www.autohotkey.com/docs/commands/AutoTrim.htm',
        exp: [
            'if Var between LowerBound and UpperBound',
            'if Var not between LowerBound and UpperBound',
            '; exp',
            'var := 2',
            'if var between 1 and 5',
            '    MsgBox, % var "is in the range 1 to 5, inclusive."',
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
    CASE: {
        keyRawName: 'Case',
        body: 'Case $0:',
        doc: 'Executes one case from a list of mutually exclusive candidates.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/Switch.htm',
        exp: [
            'Switch UserInput {',
            '    Case "btw":   MsgBox % "by the way"',
            '    Case "otoh":  MsgBox % "on the other hand"',
            '    Case "fl":    MsgBox % "Florida" Send, {backspace 3}Florida',
            '    Case "ca":    MsgBox % "California"  Send, {backspace 3}California',
            '    Case "ahk":   Run, % "https://www.autohotkey.com"',
            '    Default :     MsgBox % "default"',
            '}',
        ],
    },
    CATCH: {
        keyRawName: 'Catch',
        body: 'Catch, $0',
        doc: 'Specifies the code to execute if an exception is raised during execution of a [try](https://www.autohotkey.com/docs/commands/Try.htm) statement.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/Catch.htm',
        exp: [
            'Try {',
            '    ...',
            '} Catch e {',
            '    ...',
            '} Finally {',
            '    ...',
            '}',
        ],
    },
    CLASS: {
        keyRawName: 'Class',
        body: 'Class',
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
    CONTINUE: {
        keyRawName: 'Continue',
        body: 'Continue',
        doc: 'Skips the rest of a [loop statement](https://www.autohotkey.com/docs/Language.htm#loop-statement)\'s current iteration and begins a new one.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/Continue.htm',
        exp: [
            'Continue , LoopLabel',
            '',
            'Loop, 10',
            '{',
            '    if (A_Index <= 5)',
            '        continue',
            '    MsgBox %A_Index%',
            '}',
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
        link: 'https://www.autohotkey.com/docs/commands/ControlMove.htm',
        exp: [
            'ControlMove, Control, X, Y, Width, Height [, WinTitle, WinText, ExcludeTitle, ExcludeText]',
            '',
            ';exp',
            'SetTimer, fn_ControlMoveTimer',
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
            'Critical [, OnOffNumeric]',
            ';          TargetType',
            ';                 -> On (defaults)',
            ';                 -> Off',
        ],
    },
    DEFAULT: {
        keyRawName: 'Default',
        body: 'Default : $0',
        doc: 'Executes one case from a list of mutually exclusive candidates.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/Switch.htm',
        exp: [
            'Switch UserInput {',
            '    Case "btw":   MsgBox % "by the way"',
            '    Case "otoh":  MsgBox % "on the other hand"',
            '    Case "fl":    MsgBox % "Florida" Send, {backspace 3}Florida',
            '    Case "ca":    MsgBox % "California"  Send, {backspace 3}California',
            '    Case "ahk":   Run, % "https://www.autohotkey.com"',
            '    Default :     MsgBox % "default"',
            '}',
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
    EDIT: {
        keyRawName: 'Edit',
        body: 'Edit',
        doc: 'Opens the current script for editing in the associated editor.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/Edit.htm',
        exp: [
            'Edit',
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
    ENVDIV: {
        keyRawName: 'EnvDiv',
        body: 'EnvDiv, ${1:Var}, ${2:Value}',
        doc: 'Sets a [variable](https://www.autohotkey.com/docs/Variables.htm) to itself divided by the given value. Synonymous with: `Var /= Value`.',
        recommended: false,
        link: 'https://www.autohotkey.com/docs/commands/EnvDiv.htm',
        exp: [
            'EnvDiv, Var, Value',
            'EnvDiv, MyCount, 2',
            'MyCount /= 2',
        ],
        diag: EDiagCode.code803,
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
    ENVMULT: {
        keyRawName: 'EnvMult',
        body: 'EnvMult, ${1:Var}, ${2:Value}',
        doc: 'Sets a [variable](https://www.autohotkey.com/docs/Variables.htm) to itself times the given value. Synonymous with: `Var *= Value`.',
        recommended: false,
        link: 'https://www.autohotkey.com/docs/commands/EnvMult.htm',
        exp: [
            'EnvMult, Var, Value',
            'EnvMult, MyCount, 2',
            'MyCount *= 2',
        ],
        diag: EDiagCode.code804,
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
            '- Var : The name of the [variable](https://www.autohotkey.com/docs/Variables.htm) upon which to operate.',
            '- Value : Any integer, floating point number, or [expression](https://www.autohotkey.com/docs/Variables.htm#Expressions).',
            '- TimeUnits : `Seconds`, `Minutes`, `Hours`, `Days`',
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
    ENVUPDATE: {
        keyRawName: 'EnvUpdate',
        body: 'EnvUpdate',
        doc: 'Notifies the OS and all running applications that [environment variable(s)](https://www.autohotkey.com/docs/Concepts.htm#environment-variables) have changed.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/EnvUpdate.htm',
        exp: [
            'EnvUpdate',
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
    FILEAPPEND: {
        keyRawName: 'FileAppend',
        body: 'FileAppend [, ${1:Text}, ${2:Filename}, ${3:Encoding}]',
        doc: 'Writes text to the end of a file (first creating the file, if necessary).',
        recommended: false,
        link: 'https://www.autohotkey.com/docs/commands/FileAppend.htm',
        exp: [
            'FileAppend , Text, Filename, Encoding',
            '',
            'Var := "~~ your var~~"',
            'FileAppend,',
            '(',
            'A line of text.',
            'By default, the hard carriage return (Enter) between the previous line and this one will be written to the file.',
            '    This line is indented with a tab; by default, that tab will also be written to the file.',
            'Variable references such as %Var% are expanded by default.',
            '), D:\\My File.txt',
        ],
        diag: EDiagCode.code700,
    },
    FILECOPY: {
        keyRawName: 'FileCopy',
        body: 'FileCopy, ${1:Source}, ${2:Dest} [, ${3|0,1|}]',
        doc: [
            'Copies one or more files.',
            '* Overwrite',
            '* If omitted or 0 (false), the command does not overwrite existing files.',
            '* If this parameter is 1 (true), the command overwrites existing files.',
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
        doc: [
            'Deletes one or more files.',
            '',
            '### FilePattern',
            '1. The name of a single file or a wildcard pattern such as `C:\\Temp\\*.tmp`. _FilePattern_ is assumed to be in [%A\\_WorkingDir%](https://www.autohotkey.com/docs/Variables.htm#WorkingDir) if an absolute path isn\'t specified.',
            '',
            '2. To remove an entire folder, along with all its sub-folders and files, use [FileRemoveDir](https://www.autohotkey.com/docs/commands/FileRemoveDir.htm).',
        ].join('\n'),
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/FileDelete.htm',
        exp: [
            'FileDelete, FilePattern',
            '',
            ';exp1 Deletes all .tmp files in a directory.',
            'FileDelete, C:\\temp files\\*.tmp',
        ],
    },
    FILEENCODING: {
        keyRawName: 'FileEncoding',
        body: 'FileEncoding, [${1|ANSI,UTF-8,UTF-8-RAW,UTF-16,UTF-16-RAW,CPnnn|}]',
        doc: [
            'Sets the default encoding for [FileRead](https://www.autohotkey.com/docs/commands/FileRead.htm), [FileReadLine](https://www.autohotkey.com/docs/commands/FileReadLine.htm), [Loop Read](https://www.autohotkey.com/docs/commands/LoopReadFile.htm), [FileAppend](https://www.autohotkey.com/docs/commands/FileAppend.htm), and [FileOpen()](https://www.autohotkey.com/docs/commands/FileOpen.htm).',
            '',
            '### Encoding',
            'One of the following values : (if omitted, it defaults to the system default ANSI code page, which is also the default setting)',
            '- UTF-8: Unicode UTF-8, equivalent to CP65001.',
            '- UTF-8-RAW: As above, but no byte order mark is written when a new file is created.',
            '- UTF-16: Unicode UTF-16 with little endian byte order, equivalent to CP1200.',
            '- UTF-16-RAW: As above, but no byte order mark is written when a new file is created.',
            '- CP_nnn_: A code page with numeric identifier _nnn_. See [Code Page Identifiers](https://msdn.microsoft.com/en-us/library/dd317756.aspx).',
        ].join('\n'),
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/FileEncoding.htm',
        exp: [
            'FileEncoding [, Encoding]',
            '',
        ],
    },
    FILEGETATTRIB: {
        keyRawName: 'FileGetAttrib',
        body: 'FileGetAttrib, ${1:OutputVar} , [${2:Filename}]',
        doc: [
            'Reports whether a file or folder is read-only, hidden, etc.',
            '1. `Remarks` - The string returned will contain a subset of the letters in the string "RASHNDOCT":',
            '',
            '- R = READONLY',
            '- A = ARCHIVE',
            '- S = SYSTEM',
            '- H = HIDDEN',
            '- N = NORMAL',
            '- D = DIRECTORY',
            '- O = OFFLINE',
            '- C = COMPRESSED',
            '- T = TEMPORARY',
        ].join('\n'),
        recommended: false,
        link: 'https://www.autohotkey.com/docs/commands/FileGetAttrib.htm',
        exp: [
            'FileGetAttrib, OutputVar , Filename',
            ';exp',
            'FileGetAttrib, OutputVar, % "C:\\New Folder"',
            '',
            ';exp2 : To check if a particular attribute is present in the retrieved string, following this example:',
            'FileGetAttrib, Attributes, C:\\My File.txt',
            'if InStr(Attributes, "H")',
            '    MsgBox The file is hidden.',
        ],
        diag: EDiagCode.code700,
    },
    FILEGETSHORTCUT: {
        keyRawName: 'FileGetShortcut',
        body:
            'FileGetShortcut, ${1:LinkFile} [, ${2:OutTarget}, ${3:OutDir}, ${4:OutArgs}, ${5:Outdoc}, ${6:OutIcon}, ${7:OutIconNum}, ${8:OutRunState}]',
        doc: [
            'Retrieves information about a shortcut (.lnk) file, such as its target file.',
            '### [Parameters](https://www.autohotkey.com/docs/commands/FileGetShortcut.htm#Parameters)',
            '',
            '- LinkFile',
            '> Name of the shortcut file to be analyzed, which is assumed to be in [%A\\_WorkingDir%](https://www.autohotkey.com/docs/Variables.htm#WorkingDir) if an absolute path isn\'t specified. Be sure to include the **.lnk** extension.',
            '- OutTarget',
            '> Name of the variable in which to store the shortcut\'s target (not including any arguments it might have). For example: C:\\WINDOWS\\system32\\notepad.exe',
            '- OutDir',
            '> Name of the variable in which to store the shortcut\'s working directory. For example: C:\\My Documents. If environment variables such as %WinDir% are present in the string, one way to resolve them is via [StrReplace()](https://www.autohotkey.com/docs/commands/StrReplace.htm) or [StringReplace](https://www.autohotkey.com/docs/commands/StringReplace.htm "Deprecated. New scripts should use StrReplace() instead."). For example: [StringReplace](https://www.autohotkey.com/docs/commands/StringReplace.htm), OutDir, OutDir, %WinDir%, %[A_WinDir](https://www.autohotkey.com/docs/Variables.htm#WinDir)%.',
            '- OutArgs',
            '> Name of the variable in which to store the shortcut\'s parameters (blank if none).',
            '- OutDescription',
            '> Name of the variable in which to store the shortcut\'s comments (blank if none).',
            '- OutIcon',
            '> Name of the variable in which to store the filename of the shortcut\'s icon (blank if none).',
            '- OutIconNum',
            '> Name of the variable in which to store the shortcut\'s icon number within the icon file (blank if none). This value is most often 1, which means the first icon.',
            '- OutRunState',
            '> Name of the variable in which to store the shortcut\'s initial launch state, which is one of the following digits:',
            '> - 1 = Normal',
            '> - 3 = Maximized',
            '> - 7 = Minimized',
        ].join('\n'),
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/FileGetShortcut.htm',
        exp: [
            'FileGetShortcut, LinkFile [, OutTarget, OutDir, OutArgs, OutDescription, OutIcon, OutIconNum, OutRunState]',
        ],
    },
    FILEGETSIZE: {
        keyRawName: 'FileGetSize',
        body: 'FileGetSize, ${1:OutputVar} [, % "${2:Filename}", ${3|K,M}]',
        doc: 'Retrieves the size of a file.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/FileGetSize.htm',
        exp: [
            'FileGetSize, OutputVar [, Filename, Units]',
            '',
            ';exp',
            'FileGetSize, OutputVar, % "D:\\test.doc"',
        ],
    },
    FILEGETTIME: {
        keyRawName: 'FileGetTime',
        body: 'FileGetTime, ${1:OutputVar} [, % "${2:Filename}", ${3|M,C,A|} ]',
        doc: [
            'Retrieves the datetime stamp of a file or folder.',
            '1. `OutputVar` : YYYYMMDDHH24MISS. The time is your own local time, not UTC/GMT.',
            '2. `Filename` : The name of the target file or folder, which is assumed to be in [%A_WorkingDir%](https://www.autohotkey.com/docs/Variables.htm#WorkingDir) if an absolute path isn\'t specified. If omitted, the current file of the innermost enclosing [File-Loop](https://www.autohotkey.com/docs/commands/LoopFile.htm) will be used instead.',
            '3. `WhichTime`: ',
            '- `M` = Modification time(defaults)',
            '- `C` = Creation time',
            '- `A` = Last access time',
        ].join('\n'),
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/FileGetTime.htm',
        exp: [
            'FileGetTime, OutputVar [, Filename, WhichTime]',
            '',
            ';exp',
            'FileGetTime, fileTime, % "C:\\My Documents\\test.doc"',
            'MsgBox, % fileTime',
            '',
            'FormatTime, fmtTime, % fileTime, yyyy-MM-dd HH:mm:ss',
            'MsgBox, % fmtTime',
        ],
    },
    FILEGETVERSION: {
        keyRawName: 'FileGetVersion',
        body: 'FileGetVersion, ${1:OutputVar} [, % "${2:Filename}"]',
        doc: [
            'Retrieves the version of a file.',
            '1. `OutputVar` - The name of the variable in which to store the version number/string.',
            '2. `Filename` - The name of the target file. If a full path is not specified, this function uses the search sequence specified by the system [LoadLibrary](https://msdn.microsoft.com/en-us/library/windows/desktop/ms684175) function. If omitted, the current file of the innermost enclosing [File-Loop](https://www.autohotkey.com/docs/commands/LoopFile.htm) will be used instead.',
        ].join('\n'),
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/FileGetVersion.htm',
        exp: [
            'FileGetVersion, OutputVar [, Filename]',
            '',
            ';exp',
            'FileGetVersion, Version, % A_ProgramFiles "\\AutoHotkey\\AutoHotkey.exe"',
            'MsgBox, % Version',
        ],
    },
    FILEINSTALL: {
        keyRawName: 'FileInstall',
        body: 'FileInstall, ${1:Source}, % "${2:Dest}" [, ${3|true,false|}]',
        doc: [
            'Includes the specified file inside the [compiled version](https://www.autohotkey.com/docs/Scripts.htm#ahk2exe) of the script.',
            '1. `Source` - ',
            '> - The name of the file to be added to the compiled EXE. The file is assumed to be in (or relative to) the script\'s own directory if an absolute path isn\'t specified.',
            '> - The file name **must not** contain double quotes, variable references (e.g. %A_ProgramFiles%), or wildcards. In addition, any special characters such as literal percent signs and commas must be [escaped](https://www.autohotkey.com/docs/misc/EscapeChar.htm) (just like in the parameters of all other commands). Finally, this parameter must be listed to the right of the FileInstall command (that is, not on a [continuation line](https://www.autohotkey.com/docs/Scripts.htm#continuation) beneath it).',
            '2. `Dest` - When _Source_ is extracted from the EXE, this is the name of the file to be created. It is assumed to be in [%A_WorkingDir%](https://www.autohotkey.com/docs/Variables.htm#WorkingDir) if an absolute path isn\'t specified. The destination directory must already exist. Unlike _Source_, variable references may be used.',
            '3. `Overwrite` - This parameter determines whether to overwrite files if they already exist.',
        ].join('\n'),
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/FileInstall.htm',
        exp: ['FileInstall, Source, Dest [, Overwrite]'],
    },
    FILEMOVE: {
        keyRawName: 'FileMove',
        body: 'FileMove, % "${1:SourcePattern}", % "${2:DestPattern}" [, ${3|true,false|} ]',
        doc: [
            'Moves or renames one or more files.',
            '1. `SourcePattern` - The name of a single file or a wildcard pattern such as C:\\Temp\\*.tmp. _SourcePattern_ is assumed to be in [%A_WorkingDir%](https://www.autohotkey.com/docs/Variables.htm#WorkingDir) if an absolute path isn\'t specified.',
            '2. `DestPattern` - ',
            '> - The name or pattern of the destination, which is assumed to be in [%A_WorkingDir%](https://www.autohotkey.com/docs/Variables.htm#WorkingDir) if an absolute path isn\'t specified.',
            '> - If present, the first asterisk (`*`) in the filename is replaced with the source filename excluding its extension, while the first asterisk after the last full stop (`.`) is replaced with the source file\'s extension. If an asterisk is present but the extension is omitted, the source file\'s extension is used.',
            '> - To perform a simple move -- retaining the existing file name(s) -- specify only the folder name as shown in these mostly equivalent examples:',
            '> - ```FileMove, C:\\*.txt, C:\\My Folder```',
            '> - ```FileMove, C:\\*.txt, C:\\My Folder\\*.*```',
            '> - The destination directory must already exist. If _My Folder_ does not exist, the first example above will use "My Folder" as the target filename, while the second example will move no files.',
            '3. `Overwrite` - This parameter determines whether to overwrite files if they already exist.',
        ].join('\n'),
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/FileMove.htm',
        exp: [
            'FileMove, SourcePattern, DestPattern [, Overwrite]',
            '',
            '; Renames a single file.',
            'FileMove, % "D:\\File Before.txt", % "D:\\File After.txt"',
        ],
    },
    FILEMOVEDIR: {
        keyRawName: 'FileMoveDir',
        body: 'FileMoveDir, % "${1:Source}", % "${2:Dest}" [, ${3|0,1,2,R|}]',
        doc: [
            'Moves a folder along with all its sub-folders and files. It can also rename a folder.',
            '1. `Source` - Name of the source directory (with no trailing backslash), which is assumed to be in [%A_WorkingDir%](https://www.autohotkey.com/docs/Variables.htm#WorkingDir) if an absolute path isn\'t specified. For example: C:\\My Folder',
            '2. `Dest` - The new path and name of the directory (with no trailing baskslash), which is assumed to be in [%A_WorkingDir%](https://www.autohotkey.com/docs/Variables.htm#WorkingDir) if an absolute path isn\'t specified. For example: D:\\My Folder.',
            '> **Note**: _Dest_ is the actual path and name that the directory will have after it is moved; it is _not_ the directory into which _Source_ is moved (except for the known limitation mentioned below).',
            '3. `Flag` - ',
            '> - **0** (default): Do not overwrite existing files. The operation will fail if _Dest_ already exists as a file or directory.',
            '> - **1**: Overwrite existing files. However, any files or subfolders inside _Dest_ that do not have a counterpart in _Source_ will not be deleted. **Known limitation:** If _Dest_ already exists as a folder and it is on the same volume as _Source_, _Source_ will be moved into it rather than overwriting it. To avoid this, see the next option.',
            '> - **2**: The same as mode 1 above except that the limitation is absent.',
            '> - **R**: Rename the directory rather than moving it. Although renaming normally has the same effect as moving, it is helpful in cases where you want "all or none" behavior; that is, when you don\'t want the operation to be only partially successful when _Source_ or one of its files is locked (in use). Although this method cannot move _Source_ onto a different volume, it can move it to any other directory on its own volume. The operation will fail if _Dest_ already exists as a file or directory.',
        ].join('\n'),
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/FileMoveDir.htm',
        exp: [
            'FileMoveDir, Source, Dest , Flag',
            '',
            '; Moves a directory to a new drive.',
            'FileMoveDir, % "D:\\My Folder", % "E:\\My Folder"',
        ],
    },
    FILEREAD: {
        keyRawName: 'FileRead',
        body: 'FileRead, ${1:OutputVar}, % "${2:Filename}"',
        doc: 'Reads a file\'s contents into a [variable](https://www.autohotkey.com/docs/Variables.htm).\n > try to use [function](https://www.autohotkey.com/docs/Language.htm#commands-vs-functions) replace [FileOpen](https://www.autohotkey.com/docs/commands/FileOpen.htm) and [File.Read](https://www.autohotkey.com/docs/objects/File.htm#Read)',
        recommended: false,
        link: 'https://www.autohotkey.com/docs/commands/FileRead.htm',
        exp: [
            'FileRead, OutputVar, % "C:\\My Documents\\My File.txt"',
        ],
        diag: EDiagCode.code700,
    },
    FILEREADLINE: {
        keyRawName: 'FileReadLine',
        body: 'FileReadLine, ${1:OutputVar}, % "${2:Filename}", ${3:LineNum}',
        doc: 'Reads the specified line from a file and stores the text in a [variable](https://www.autohotkey.com/docs/Variables.htm).\n > `Remarks` - It is strongly recommended to use this command only for small files, or in cases where only a single line of text is needed. To scan and process a large number of lines (one by one), use a [file-reading loop](https://www.autohotkey.com/docs/commands/LoopReadFile.htm) for best performance.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/FileReadLine.htm',
        exp: [
            'FileReadLine, OutputVar, Filename, LineNum',
            '',
            'FileReadLine, lineText, % "D:\\test.txt", 5',
            'MsgBox % "lineText is " lineText',
        ],
    },
    FILERECYCLE: {
        keyRawName: 'FileRecycle',
        body: 'FileRecycle, % "${1:FilePattern}"',
        doc: 'Sends a file or directory to the recycle bin if possible, *or permanently deletes it.*',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/FileRecycle.htm',
        exp: [
            'FileRecycle, FilePattern',
            '',
            'FileRecycle, % "D:\\test.txt"',
        ],
    },
    FILERECYCLEEMPTY: {
        keyRawName: 'FileRecycleEmpty',
        body: 'FileRecycleEmpty [, % "${1:DriveLetter}"]',
        doc: 'Empties the recycle bin.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/FileRecycleEmpty.htm',
        exp: [
            'FileRecycleEmpty [, DriveLetter]',
            '',
            'FileRecycleEmpty, % "D:\\"',
        ],
    },
    FILEREMOVEDIR: {
        keyRawName: 'FileRemoveDir',
        body: 'FileRemoveDir, % "${1:Path}", ${2|true,false|}',
        doc: 'Deletes a folder.\n - `DirName`: Name of the directory to delete, which is assumed to be in [%A_WorkingDir%](https://www.autohotkey.com/docs/Variables.htm#WorkingDir) if an absolute path isn\'t specified.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/FileRecycleEmpty.htm',
        exp: [
            'FileRemoveDir, DirName [, Recurse]',
            '',
            'FileRemoveDir, % "D:\\Download Temp"',
        ],
    },
    FILESELECTFILE: {
        keyRawName: 'FileSelectFile',
        body: 'FileSelectFile, ${1:OutputVar} [, ${2:Options}, ${3:RootDir_or_Filename}, ${4:Title}, ${5:Filter}]',
        doc: 'Displays a standard dialog that allows the user to open or save file(s).',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/FileSelectFile.htm',
        exp: [
            'FileSelectFile, OutputVar [, Options, RootDir_or_Filename, Title, Filter]',
            '',
            'FileSelectFile, SelectedFile, 3, , % "Open a file", % "Text Documents (*.txt; *.doc)"',
            'if (SelectedFile = "")',
            '    MsgBox, % "The user didn\'t select anything."',
            'else',
            '    MsgBox, % "The user selected the following:`n" SelectedFile',
        ],
    },
    FILESELECTFOLDER: {
        keyRawName: 'FileSelectFolder',
        body: 'FileSelectFolder, ${1:OutputVar} [, ${2:StartingFolder}, ${3:Options}, ${4:Prompt}]',
        doc: [
            'Displays a standard dialog that allows the user to select a folder.',
            '',
            '`Options`:',
            '- **0**: The options below are all disabled (except on Windows 2000, where the "make new folder" button might appear anyway).',
            '- **1** (default): A button is provided that allows the user to create new folders.',
            '- **Add 2** to the above number to provide an edit field that allows the user to type the name of a folder. For example, a value of 3 for this parameter provides both an edit field and a "make new folder" button.',
            '- **Add 4** to the above number to omit the BIF_NEWDIALOGSTYLE property. Adding 4 ensures that FileSelectFolder will work properly even in a Preinstallation Environment like WinPE or BartPE. However, this prevents the appearance of a "make new folder" button, at least on Windows XP. ["4" requires v1.0.48+]',
        ].join('\n'),
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/FileSelectFolder.htm',
        exp: [
            'FileSelectFolder, OutputVar [, StartingFolder, Options, Prompt]',
            '',
            'FileSelectFolder, OutputVar, , 3, % "Select Folder to Do something"',
            'if (OutputVar = "")',
            '    MsgBox, % "You didn\'t select a folder."',
            'else',
            '    MsgBox, % "You selected folder`n" OutputVar',
        ],
    },
    FILESETATTRIB: {
        keyRawName: 'FileSetAttrib',
        body: 'FileSetAttrib, ${1:Attributes} [, % "${2:D:\\test.txt}", ${3|0,1,2|}, ${4|0,1|}]',
        doc: [
            'Changes the attributes of one or more files or folders. Wildcards are supported.',
            '1. `Attributes` -',
            '> - The attributes to change. For example, `+HA-R`.',
            '> - To easily turn on, turn off or toggle attributes, prefix one or more of the following attribute letters with a plus sign (+), minus sign (-) or caret (^), respectively:',
            '> 1. `R` = READONLY',
            '> 2. `A` = ARCHIVE',
            '> 3. `S` = SYSTEM',
            '> 4. `H` = HIDDEN',
            '> 5. `N` = NORMAL (this is valid only when used without any other attributes)',
            '> 6. `O` = OFFLINE',
            '> 7. `T` = TEMPORARY',
            '2. `FilePattern` -',
            '> - The name of a single file or folder, or a wildcard pattern such as `C:\\Temp\\*.tmp`. _FilePattern_ is assumed to be in [%A_WorkingDir%](https://www.autohotkey.com/docs/Variables.htm#WorkingDir) if an absolute path isn\'t specified.',
            '> - If omitted, the current file of the innermost enclosing File-Loop will be used instead.',
            '3. `OperateOnFolders` -',
            '> - `0` (default) = Folders are not operated upon (only files).',
            '> - `1` = All files and folders that match the wildcard pattern are operated upon.',
            '> - `2` = Only folders are operated upon (no files).',
            '4. `Recurse` -',
            '> - `0` (default) = Subfolders are not recursed into.',
            '> - `1` = Subfolders are recursed into so that files and folders contained therein are operated upon if they match FilePattern. All subfolders will be recursed into, not just those whose names match FilePattern. However, files and folders with a complete path name longer than 259 characters are skipped over as though they do not exist. Such files are rare because normally, the operating system does not allow their creation.',
        ].join('\n'),
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/FileSetAttrib.htm',
        exp: [
            'FileSetAttrib, Attributes [, FilePattern, OperateOnFolders?, Recurse?]',
            '',
            ';Turns on the "read-only" and "hidden" attributes of all files and directories (subdirectories are not recursed into).',
            'FileSetAttrib, % "+RH", % "D:\\MyFiles\\*.*", 1  ; +RH is identical to +R+H (readonly && hidden)',
        ],
    },
    FILESETTIME: {
        keyRawName: 'FileSetTime',
        body: 'FileSetTime [, ${1:YYYYMMDDHH24MISS}, % "${2:D:\\test.txt}", ${3|M,C,A|}, ${4|0,1,2|}, ${5|0,1|}]',
        doc: [
            'Changes the datetime stamp of one or more files or folders. Wildcards are supported.',
            '1. `YYYYMMDDHH24MISS` - This parameter is an [expression](https://www.autohotkey.com/docs/Variables.htm#Expressions).',
            '2. `FilePattern` - The name of a single file or folder, or a wildcard pattern such as C:\\Temp\\*.tmp. _FilePattern_ is assumed to be in [%A_WorkingDir%](https://www.autohotkey.com/docs/Variables.htm#WorkingDir).\n if an absolute path isn\'t specified.If omitted, the current file of the innermost enclosing [File-Loop](https://www.autohotkey.com/docs/commands/LoopFile.htm) will be used instead.',
            '3. `WhichTime` -',
            '> - `M` = Modification time (default)',
            '> - `C` = Creation time',
            '> - `A` = Last access time',
            '4. `OperateOnFolders` -',
            '> - `0` = Folders are not operated upon (only files).  (default)',
            '> - `1` = All files and folders that match the wildcard pattern are operated upon.',
            '> - `2` = Only folders are operated upon (no files).',
            '5. `OperateOnFolders` -',
            '> - `0` = Subfolders are not recursed into. (default)',
            '> - `1` = Subfolders are recursed into so that files and folders contained therein are operated upon if they match FilePattern. All subfolders will be recursed into, not just those whose names match FilePattern. However, files and folders with a complete path name longer than 259 characters are skipped over as though they do not exist. Such files are rare because normally, the operating system does not allow their creation.',
        ].join('\n'),
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/FileSetTime.htm',
        exp: [
            'FileSetTime [, YYYYMMDDHH24MISS, FilePattern, WhichTime, OperateOnFolders?, Recurse?]',
            '',
            ';Sets the modification date',
            'yyyy := "2004", Month := "12", Day := "31", Hour := "16", Minute := "58", Second := "59"',
            'setTime := yyyy . Month . Day . Hour . Minute . Second',
            'FileSetTime, setTime, % "D:\\test.txt"',
        ],
    },
    FINALLY: {
        keyRawName: 'Finally',
        body: 'Finally',
        doc: 'Ensures that one or more statements are always executed after a [Try](https://www.autohotkey.com/docs/commands/Try.htm) statement finishes.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/Finally.htm',
        exp: [
            'Try {',
            '    ...',
            '} Catch e {',
            '    ...',
            '} Finally {',
            '    ...',
            '}',
        ],
    },
    FOR: {
        keyRawName: 'For',
        body: 'For ${1:Key}, ${2:Value} in ${3:Expression} {\n}',
        doc: 'Repeats a series of commands once for each key-value pair in an object.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/For.htm',
        exp: [
            'For Key [, Value] in Expression',
            ';',
            '; exp',
            'For Key , Value in ["A", "B", "C"] {',
            '    MsgBox % Key " & " Value',
            '}',
        ],
    },
    FORMATTIME: {
        keyRawName: 'FormatTime',
        body: 'FormatTime, ${1:OutputVar} [, ${2:YYYYMMDDHH24MISS}, ${3:yyyy-MM-dd HH:mm:ss} ]',
        doc: 'Transforms a [YYYYMMDDHH24MISS](https://www.autohotkey.com/docs/commands/FileSetTime.htm#YYYYMMDD) timestamp into the specified date/time format.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/FormatTime.htm',
        exp: [
            'FormatTime, OutputVar [, YYYYMMDDHH24MISS, Format]',
            ';',
            ';---------------------',
            'FileGetTime, fileTime, % "C:\\My Documents\\test.doc"',
            'MsgBox, % fileTime',
            '',
            'FormatTime, fmtTime, % fileTime, yyyy-MM-dd HH:mm:ss',
            'MsgBox, % fmtTime',
            ';----------------------',
            'FormatTime, TimeString',
            'MsgBox % "The current time and date (time first) is " TimeString',
            '',
            'FormatTime, TimeString, R',
            'MsgBox % "The current time and date (date first) is " TimeString',
            '',
            'FormatTime, TimeString, , Time',
            'MsgBox % "The current time is " TimeString',
            '',
            'FormatTime, TimeString, T12, Time',
            'MsgBox % "The current 24-hour time is " TimeString',
            '',
            'FormatTime, TimeString, , LongDate',
            'MsgBox % "The current date (long format) is " TimeString',
            '',
            'FormatTime, TimeString, 20050423220133, dddd MMMM d, yyyy hh:mm:ss tt',
            'MsgBox % "The specified date and time, when formatted, is " TimeString',
            '',
            'FormatTime, TimeString, 200504, \'Month Name\': MMMM`n\'Day Name\': dddd',
            'MsgBox % TimeString',
            '',
            'FormatTime, YearWeek, 20050101, YWeek',
            'MsgBox % "January 1st of 2005 is in the following ISO year and week number: " YearWeek',
        ],
    },
    GETKEYSTATE: {
        keyRawName: 'GetKeyState',
        body: 'GetKeyState, ${1:OutputVar}, ${2:KeyName} [,${3:Mode}]',
        doc: '**Deprecated:** This command is not recommended for use in new scripts. Use the [GetKeyState](https://www.autohotkey.com/docs/commands/GetKeyState.htm#function) function instead.',
        recommended: false,
        link: 'https://www.autohotkey.com/docs/commands/GetKeyState.htm#command',
        exp: [
            'GetKeyState, OutputVar, KeyName , Mode',
            ' ',
            'KeyIsDown := GetKeyState(KeyName , Mode)',
        ],
        diag: EDiagCode.code700,
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
    GOSUB: {
        keyRawName: 'Gosub',
        body: 'Gosub, ${1:Label}',
        doc: 'Jumps to the specified label and continues execution until [Return](https://www.autohotkey.com/docs/commands/Return.htm) is encountered.',
        recommended: false,
        link: 'https://www.autohotkey.com/docs/commands/Gosub.htm',
        exp: [
            'Gosub, Label1 ',
            '    MsgBox, The Label1 subroutine has returned (it is finished).',
            'return',
            '',
            'Label1:',
            '    MsgBox, The Label1 subroutine is now running.',
            'return',
        ],
    },
    GOTO: {
        keyRawName: 'Goto',
        body: 'Goto, ${1:Label}',
        doc: 'Jumps to the specified label and continues execution.',
        recommended: false,
        link: 'https://www.autohotkey.com/docs/commands/Goto.htm',
        exp: [
            'Goto, MyLabel',
            '',
            '; ...',
            '',
            'MyLabel:',
            '',
            'Sleep, 100',
            '; ...',
            '',
        ],
    },
    GROUPACTIVATE: {
        keyRawName: 'GroupActivate',
        body: 'GroupActivate, ${1:GroupName} [, ${2:R} ]',
        doc: 'Activates the next window in a window group that was defined with GroupAdd.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/GroupActivate.htm',
        exp: [
            'GroupActivate, GroupName [, Mode]',
            '',
            '; Activates the newest window (the one most recently active) in a window group.',
            'GroupActivate, MyGroup, R',
        ],
    },
    GROUPADD: {
        keyRawName: 'GroupAdd',
        body:
            'GroupAdd, ${1:GroupName} [, ${2:WinTitle}, ${3:WinText}, ${4:Label}, ${5:ExcludeTitle}, ${6:ExcludeText}]',
        doc: 'Adds a window specification to a window group, creating the group if necessary.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/GroupAdd.htm',
        exp: ['GroupAdd, GroupName [, WinTitle, WinText, Label, ExcludeTitle, ExcludeText]'],
    },
    GROUPCLOSE: {
        keyRawName: 'GroupClose',
        body: 'GroupClose, ${1:GroupName} [, ${2:A|R}]',
        doc: 'Closes the active window if it was just activated by [GroupActivate](https://www.autohotkey.com/docs/commands/GroupActivate.htm) or [GroupDeactivate](https://www.autohotkey.com/docs/commands/GroupDeactivate.htm). It then activates the next window in the series. It can also close all windows in a group.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/GroupClose.htm',
        exp: ['GroupClose, GroupName [, Mode]'],
    },
    GROUPDEACTIVATE: {
        keyRawName: 'GroupDeactivate',
        body: 'GroupDeactivate, ${1:GroupName} [, ${2:R}]',
        doc: 'Similar to [GroupActivate](https://www.autohotkey.com/docs/commands/GroupActivate.htm) except activates the next window **not** in the group.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/GroupDeactivate.htm',
        exp: ['GroupDeactivate, GroupName [, Mode]'],
    },
    GUI: {
        keyRawName: 'Gui',
        body:
            'Gui, ${1|New,Add,Show,Submit,Cancel,Destroy,Font,Color,Margin,Options,Menu,Minimize,Flash,Default|} [, ${2:Value1}, ${3:Value2}, ${4:Value3]}]',
        doc: [
            'Creates and manages windows and controls. Such windows can be used as data entry forms or custom user interfaces.',
            '1. `Sub-commands` -',
            '',
            '- [New](https://www.autohotkey.com/docs/commands/Gui.htm#New) [[v1.1.04+]](https://www.autohotkey.com/docs/AHKL_ChangeLog.htm#v1.1.04.00 "Applies to AutoHotkey v1.1.04 and later"): Creates a new window.',
            '- [Add](https://www.autohotkey.com/docs/commands/Gui.htm#Add): Creates a control such as text, button, or checkbox.',
            '- [Show](https://www.autohotkey.com/docs/commands/Gui.htm#Show): Displays the window. It can also minimize, maximize, or move the window.',
            '- [Submit](https://www.autohotkey.com/docs/commands/Gui.htm#Submit): Saves the user\'s input and optionally hides the window.',
            '- [Cancel](https://www.autohotkey.com/docs/commands/Gui.htm#Cancel) / [Hide](https://www.autohotkey.com/docs/commands/Gui.htm#Hide): Hides the window.',
            '- [Destroy](https://www.autohotkey.com/docs/commands/Gui.htm#Destroy): Deletes the window.',
            '- [Font](https://www.autohotkey.com/docs/commands/Gui.htm#Font): Sets the typeface, size, style, and text color for subsequently created controls.',
            '- [Color](https://www.autohotkey.com/docs/commands/Gui.htm#Color): Sets the background color for the window and/or its controls.',
            '- [Margin](https://www.autohotkey.com/docs/commands/Gui.htm#Margin): Sets the margin/spacing used whenever no explicit position has been specified for a control.',
            '- [Options and styles for a window](https://www.autohotkey.com/docs/commands/Gui.htm#Options): Sets various options for the appearance and behavior of the window.',
            '- [Menu](https://www.autohotkey.com/docs/commands/Gui.htm#Menu): Adds or removes a menu bar.',
            '- [Minimize](https://www.autohotkey.com/docs/commands/Gui.htm#Minimize) / [Maximize](https://www.autohotkey.com/docs/commands/Gui.htm#Maximize) / [Restore](https://www.autohotkey.com/docs/commands/Gui.htm#Restore): Performs the indicated operation on the window.',
            '- [Flash](https://www.autohotkey.com/docs/commands/Gui.htm#Flash): Blinks the window and its taskbar button.',
            '- [Default](https://www.autohotkey.com/docs/commands/Gui.htm#Default): Changes the current thread\'s default GUI window name.',
        ].join('\n'),
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/Gui.htm',
        exp: [
            'Gui, SubCommand [, Value1, Value2, Value3]',
        ],
    },
    GUICONTROL: {
        keyRawName: 'GuiControl',
        body:
            'GuiControl, ${1|(Blank),Text,Move,MoveDraw,Focus,Disable,Enable,Hide,Show,Delete,Choose,ChooseString,Font,Options|}, ${2:ControlID} [, ${3:Value}]',
        doc: [
            'Makes a variety of changes to a control in a GUI window.',
            '1. `SubCommand` -',
            '',
            '- [(Blank)](https://www.autohotkey.com/docs/commands/GuiControl.htm#Blank): Puts new contents into the control.',
            '- [Text](https://www.autohotkey.com/docs/commands/GuiControl.htm#Text): Changes the text/caption of the control.',
            '- [Move](https://www.autohotkey.com/docs/commands/GuiControl.htm#Move): Moves and/or resizes the control.',
            '- [MoveDraw](https://www.autohotkey.com/docs/commands/GuiControl.htm#MoveDraw): Moves and/or resizes the control and repaints the region occupied by it.',
            '- [Focus](https://www.autohotkey.com/docs/commands/GuiControl.htm#Focus): Sets keyboard focus to the control.',
            '- [Disable](https://www.autohotkey.com/docs/commands/GuiControl.htm#Disable): Disables (grays out) the control.',
            '- [Enable](https://www.autohotkey.com/docs/commands/GuiControl.htm#Enable): Enables the control.',
            '- [Hide](https://www.autohotkey.com/docs/commands/GuiControl.htm#Hide): Hides the control.',
            '- [Show](https://www.autohotkey.com/docs/commands/GuiControl.htm#Show): Shows the control.',
            '- [Delete](https://www.autohotkey.com/docs/commands/GuiControl.htm#Delete): Not yet implemented.',
            '- [Choose](https://www.autohotkey.com/docs/commands/GuiControl.htm#Choose): Selects the specified item number in a multi-item control.',
            '- [ChooseString](https://www.autohotkey.com/docs/commands/GuiControl.htm#ChooseString): Selects a item in a multi-item control whose leading part matches a string.',
            '- [Font](https://www.autohotkey.com/docs/commands/GuiControl.htm#Font): Changes the control\'s font typeface, size, color, and style.',
            '- [Options](https://www.autohotkey.com/docs/commands/GuiControl.htm#options): Add or remove various control-specific or general options and styles.',
        ].join('\n'),
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/GuiControl.htm',
        exp: [
            'GuiControl, SubCommand, ControlID [, Value]',
        ],
    },
    GUICONTROLGET: {
        keyRawName: 'GuiControlGet',
        body:
            'GuiControlGet, ${1:OutputVar} [, ${2|(Blank),Pos,Focus,FocusV,Enabled,Visible,Hwnd,Name|}, ${3:ControlID}, ${4:Value}]',
        doc: [
            'Retrieves various types of information about a control in a GUI window.',
            '1. `SubCommand` -',
            '- [(Blank)](https://www.autohotkey.com/docs/commands/GuiControlGet.htm#Blank): Retrieves the contents of the control.',
            '- [Pos](https://www.autohotkey.com/docs/commands/GuiControlGet.htm#Pos): Retrieves the position and size of the control.',
            '- [Focus](https://www.autohotkey.com/docs/commands/GuiControlGet.htm#Focus): Retrieves the control identifier (ClassNN) for the control that currently has keyboard focus.',
            '- [FocusV](https://www.autohotkey.com/docs/commands/GuiControlGet.htm#FocusV) [[v1.0.43.06+]](https://www.autohotkey.com/docs/ChangeLogHelp.htm#Older_Changes "Applies to AutoHotkey v1.0.43.06 and later"): Retrieves the name of the focused control\'s associated variable.',
            '- [Enabled](https://www.autohotkey.com/docs/commands/GuiControlGet.htm#Enabled): Retrieves 1 if the control is enabled or 0 if it is disabled.',
            '- [Visible](https://www.autohotkey.com/docs/commands/GuiControlGet.htm#Visible): Retrieves 1 if the control is visible or 0 if it is hidden.',
            '- [Hwnd](https://www.autohotkey.com/docs/commands/GuiControlGet.htm#Hwnd) [[v1.0.46.16+]](https://www.autohotkey.com/docs/ChangeLogHelp.htm#v1.0.46.16 "Applies to AutoHotkey v1.0.46.16 and later"): Retrieves the window handle (HWND) of the control.',
            '- [Name](https://www.autohotkey.com/docs/commands/GuiControlGet.htm#Name) [[v1.1.03+]](https://www.autohotkey.com/docs/AHKL_ChangeLog.htm#v1.1.03.00 "Applies to AutoHotkey v1.1.03 and later"): Retrieves the name of the control\'s associated variable.',
        ].join('\n'),
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/GuiControlGet.htm',
        exp: [
            'GuiControlGet, OutputVar [, SubCommand, ControlID, Value]',
        ],
    },
    HOTKEY: {
        keyRawName: 'Hotkey',
        body: 'Hotkey, ${1:KeyName} , ${2:Label_or_funcName}, ${3:Options}',
        doc: 'Creates, modifies, enables, or disables a hotkey while the script is running.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/Hotkey.htm',
        exp: [
            'Hotkey, KeyName [, Label_or_funcName, Options]',
            'Hotkey, IfWinActive/Exist [ , WinTitle, WinText]',
            'Hotkey, If [, Expression]',
            'Hotkey, If, % FunctionObject',
        ],
    },
    IFEQUAL: {
        keyRawName: 'IfEqual',
        body: 'IfEqual, ${1:Var} [, ${2:Value} ]',
        doc: 'Specifies one or more [statements](https://www.autohotkey.com/docs/Concepts.htm#statement) to execute if the comparison of a [variable](https://www.autohotkey.com/docs/Variables.htm) to a value evaluates to true.',
        recommended: false,
        diag: EDiagCode.code806,
        link: 'https://www.autohotkey.com/docs/commands/IfEqual.htm',
        exp: ['IfEqual, Var , Value ; if Var = Value'],
    },
    IFEXIST: {
        keyRawName: 'IfExist',
        body: 'IfExist, ${1:FilePattern}',
        doc: 'Checks for the existence of a file or folder.',
        recommended: false,
        diag: EDiagCode.code700,
        link: 'https://www.autohotkey.com/docs/commands/IfExist.htm',
        exp: [
            'IfExist, FilePattern',
            'IfNotExist, FilePattern',
            '',
            ';exp',
            'IfExist, D:\\Docs\\*.txt',
            '    MsgBox, At least one .txt file exists.',
        ],
    },
    IFGREATER: {
        keyRawName: 'IfGreater',
        body: 'IfGreater, ${1:Var} [, ${2:Value} ]',
        doc: 'Specifies one or more [statements](https://www.autohotkey.com/docs/Concepts.htm#statement) to execute if the comparison of a [variable](https://www.autohotkey.com/docs/Variables.htm) to a value evaluates to true.',
        recommended: false,
        diag: EDiagCode.code806,
        link: 'https://www.autohotkey.com/docs/commands/IfEqual.htm',
        exp: ['IfGreater, Var , Value ; if Var > Value'],
    },
    IFGREATEROREQUAL: {
        keyRawName: 'IfGreaterOrEqual',
        body: 'IfGreaterOrEqual, ${1:Var} [, ${2:Value} ]',
        doc: 'Specifies one or more [statements](https://www.autohotkey.com/docs/Concepts.htm#statement) to execute if the comparison of a [variable](https://www.autohotkey.com/docs/Variables.htm) to a value evaluates to true.',
        recommended: false,
        diag: EDiagCode.code806,
        link: 'https://www.autohotkey.com/docs/commands/IfEqual.htm',
        exp: ['IfGreaterOrEqual, Var , Value ; if Var >= Value'],
    },
    IFINSTRING: {
        keyRawName: 'IfInString',
        body: 'IfInString, ${1:Var}, ${2:SearchString}',
        doc: 'Checks if a [variable](https://www.autohotkey.com/docs/Variables.htm) contains the specified string.',
        recommended: false,
        diag: EDiagCode.code700,
        link: 'https://www.autohotkey.com/docs/commands/IfInString.htm',
        exp: [
            'IfInString, Var, SearchString',
            'IfNotInString, Var, SearchString',
        ],
    },
    IFLESS: {
        keyRawName: 'IfLess',
        body: 'IfLess, ${1:Var} [, ${2:Value} ]',
        doc: 'Specifies one or more [statements](https://www.autohotkey.com/docs/Concepts.htm#statement) to execute if the comparison of a [variable](https://www.autohotkey.com/docs/Variables.htm) to a value evaluates to true.',
        recommended: false,
        diag: EDiagCode.code806,
        link: 'https://www.autohotkey.com/docs/commands/IfEqual.htm',
        exp: ['IfLess, Var , Value ; if Var < Value'],
    },
    IFLESSOREQUAL: {
        keyRawName: 'IfLessOrEqual',
        body: 'IfLessOrEqual, ${1:Var} [, ${2:Value} ]',
        doc: 'Specifies one or more [statements](https://www.autohotkey.com/docs/Concepts.htm#statement) to execute if the comparison of a [variable](https://www.autohotkey.com/docs/Variables.htm) to a value evaluates to true.',
        recommended: false,
        diag: EDiagCode.code806,
        link: 'https://www.autohotkey.com/docs/commands/IfEqual.htm',
        exp: ['IfLessOrEqual, Var , Value ; if Var <= Value'],
    },
    IFMSGBOX: {
        keyRawName: 'IfMsgBox',
        body: 'IfMsgBox, ${1|Yes,No,OK,Cancel,Abort,Ignore,Retry,Continue,TryAgain,Timeout|}',
        doc: 'Checks which button was pushed by the user during the most recent [MsgBox](https://www.autohotkey.com/docs/commands/MsgBox.htm) command.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/IfMsgBox.htm',
        exp: [
            'IfMsgBox, ButtonName',
        ],
    },
    IFNOTEQUAL: {
        keyRawName: 'IfNotEqual',
        body: 'IfNotEqual, ${1:Var} [, ${2:Value} ]',
        doc: 'Specifies one or more [statements](https://www.autohotkey.com/docs/Concepts.htm#statement) to execute if the comparison of a [variable](https://www.autohotkey.com/docs/Variables.htm) to a value evaluates to true.',
        recommended: false,
        diag: EDiagCode.code806,
        link: 'https://www.autohotkey.com/docs/commands/IfEqual.htm',
        exp: ['IfNotEqual, Var , Value ; if Var != Value'],
    },
    IFNOTEXIST: {
        keyRawName: 'IfNotExist',
        body: 'IfNotExist, ${1:FilePattern}',
        doc: 'Checks for the existence of a file or folder.',
        recommended: false,
        diag: EDiagCode.code700,
        link: 'https://www.autohotkey.com/docs/commands/IfExist.htm',
        exp: [
            'IfExist, FilePattern',
            'IfNotExist, FilePattern',
            '',
            ';exp',
            'IfExist, D:\\Docs\\*.txt',
            '    MsgBox, At least one .txt file exists.',
        ],
    },
    IFNOTINSTRING: {
        keyRawName: 'IfNotInString',
        body: 'IfNotInString, ${1:Var}, ${2:SearchString}',
        doc: 'Checks if a [variable](https://www.autohotkey.com/docs/Variables.htm) contains the specified string.',
        recommended: false,
        diag: EDiagCode.code700,
        link: 'https://www.autohotkey.com/docs/commands/IfInString.htm',
        exp: [
            'IfInString, Var, SearchString',
            'IfNotInString, Var, SearchString',
        ],
    },
    IFWINACTIVE: {
        keyRawName: 'IfWinActive',
        body: 'IfWinActive [, ${1:WinTitle}, ${2:WinText}, ${3:ExcludeTitle}, ${4:ExcludeText}]',
        doc: 'Checks if the specified window exists and is currently active (foremost).',
        recommended: false,
        diag: EDiagCode.code700,
        link: 'https://www.autohotkey.com/docs/commands/IfWinActive.htm',
        exp: [
            'IfWinActive [, WinTitle, WinText, ExcludeTitle, ExcludeText]',
            'IfWinNotActive [, WinTitle, WinText, ExcludeTitle, ExcludeText]',
        ],
    },
    IFWINEXIST: {
        keyRawName: 'IfWinExist',
        body: 'IfWinExist [, ${1:WinTitle}, ${2:WinText}, ${3:ExcludeTitle}, ${4:ExcludeText}]',
        doc: 'Checks if the specified window exists.',
        recommended: false,
        diag: EDiagCode.code700,
        link: 'https://www.autohotkey.com/docs/commands/IfWinExist.htm',
        exp: [
            'IfWinExist [, WinTitle, WinText, ExcludeTitle, ExcludeText]',
            'IfWinNotExist [, WinTitle, WinText, ExcludeTitle, ExcludeText]',
        ],
    },
    IFWINNOTACTIVE: {
        keyRawName: 'IfWinNotActive',
        body: 'IfWinNotActive [, ${1:WinTitle}, ${2:WinText}, ${3:ExcludeTitle}, ${4:ExcludeText}]',
        doc: 'Checks if the specified window exists and is currently active (foremost).',
        recommended: false,
        diag: EDiagCode.code700,
        link: 'https://www.autohotkey.com/docs/commands/IfWinActive.htm',
        exp: [
            'IfWinActive [, WinTitle, WinText, ExcludeTitle, ExcludeText]',
            'IfWinNotActive [, WinTitle, WinText, ExcludeTitle, ExcludeText]',
        ],
    },
    IFWINNOTEXIST: {
        keyRawName: 'IfWinNotExist',
        body: 'IfWinNotExist  [, ${1:WinTitle}, ${2:WinText}, ${3:ExcludeTitle}, ${4:ExcludeText}]',
        doc: 'Checks if the specified window exists.',
        recommended: false,
        diag: EDiagCode.code700,
        link: 'https://www.autohotkey.com/docs/commands/IfWinExist.htm',
        exp: [
            'IfWinExist [, WinTitle, WinText, ExcludeTitle, ExcludeText]',
            'IfWinNotExist [, WinTitle, WinText, ExcludeTitle, ExcludeText]',
        ],
    },
    IMAGESEARCH: {
        keyRawName: 'ImageSearch',
        body: 'ImageSearch, ${1:OutputVarX}, ${2:OutputVarY}, ${3:X1}, ${4:Y1}, ${5:X2}, ${6:Y2}, ${7:ImageFile}',
        doc: 'Searches a region of the screen for an image.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/ImageSearch.htm',
        exp: [
            'ImageSearch , OutputVarX, OutputVarY, X1, Y1, X2, Y2, ImageFile',
            '',
            'ImageSearch, FoundX, FoundY, 40, 40, 300, 300, % "C:\\My Images\\test.bmp"',
            'MsgBox % "FoundX : " FoundX " ,FoundY : " FoundY',
        ],
    },
    INIDELETE: {
        keyRawName: 'IniDelete',
        body: 'IniDelete, % "${1:Filename}", % "${2:Section}" [, % "${3:Key}"]',
        doc: [
            'Deletes a value from a standard format .ini file.',
            '- A standard *ini* file looks like:',
            '```ini',
            '[Section]',
            'Key=Value',
            '```',
        ].join('\n'),
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/IniDelete.htm',
        exp: [
            'IniDelete, Filename, Section [, Key]',
            '',
        ],
    },
    INIREAD: {
        keyRawName: 'IniRead',
        body: 'IniRead, ${4:OutputVar}, % "${1:Filename}", % "${2:Section}", % "${3:Key}" [,% "${5:Default}"]',
        doc: [
            'Reads a value, section or list of section names from a standard format .ini file.',
            '- A standard *ini* file looks like:',
            '```ini',
            '[Section]',
            'Key=Value',
            '```',
        ].join('\n'),
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/IniRead.htm',
        exp: [
            'IniRead, OutputVar, Filename, Section, Key [, Default]',
            'IniRead, OutputVarSection, Filename, Section',
            'IniRead, OutputVarSectionNames, Filename',
            '',
            'IniRead, OutputVar, % "Filename", % "Section", % "Key"',
        ],
    },
    INIWRITE: {
        keyRawName: 'IniWrite',
        body: 'IniWrite, % "${4:Value}", % "${1:Filename}", % "${2:Section}", % "${3:Key}"',
        doc: [
            'Writes a value or section to a standard format .ini file.',
            '- A standard *ini* file looks like:',
            '```ini',
            '[Section]',
            'Key=Value',
            '```',
        ].join('\n'),
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/IniWrite.htm',
        exp: [
            'IniWrite, Value, Filename, Section, Key',
            'IniWrite, Pairs, Filename, Section',
            '',
            'IniRead, OutputVar, % "Filename", % "Section", % "Key"',
            'IniWrite, % "Value", % "Filename", % "Section", % "Key"',
        ],
    },
    INPUT: {
        keyRawName: 'Input',
        body: 'Input [, ${1:OutputVar}, ${2:Options}, ${3:EndKeys}, ${4:MatchList}]',
        doc: 'Waits for the user to type a string.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/Input.htm',
        exp: ['Input [, OutputVar, Options, EndKeys, MatchList]'],
    },
    INPUTBOX: {
        keyRawName: 'InputBox',
        body:
            'InputBox, ${1:OutputVar} [,% "${2:Title}", % "${3:Prompt}", ${4:HIDE}, ${5:Width}, ${6:Height}, ${7:X}, ${8:Y}, ${9:Font}, ${10:Timeout}, % "${11:DefaultStr}"]',
        doc: 'Displays an input box to ask the user to enter a string.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/InputBox.htm',
        exp: [
            'InputBox, OutputVar [, Title, Prompt, HIDE, Width, Height, X, Y, Locale, Timeout, Default]',
            '',
            ';exp1 Allows the user to enter a hidden password.',
            'InputBox, password, % "Enter Password",% "(your input will be hidden)", hide',
            '',
            ';exp2 Allows the user to enter a phone number.',
            'InputBox, UserInput, % "Phone Number",% "Please enter a phone number.", , 640, 480',
            'if (ErrorLevel == 0)',
            '    MsgBox, % "CANCEL was pressed."',
            'else',
            '    MsgBox, % "You entered" UserInput',
        ],
    },
    KEYHISTORY: {
        keyRawName: 'KeyHistory',
        body: 'KeyHistory',
        doc: 'Displays script info and a history of the most recent keystrokes and mouse clicks.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/KeyHistory.htm',
        exp: [
            'KeyHistory',
            '',
            ';exp1',
            '~F10:: KeyHistory',
        ],
    },
    KEYWAIT: {
        keyRawName: 'KeyWait',
        body: 'KeyWait, ${1:KeyName} [, ${2:Options}]',
        doc: 'Waits for a key or mouse/joystick button to be released or pressed down.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/KeyWait.htm',
        exp: ['KeyWait, KeyName [, Options]'],
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
        body: 'ListLines [, ${1|On,Off|}]',
        doc: 'Displays the script lines most recently executed.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/ListLines.htm',
        exp: ['ListLines'],
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
        body: 'local, ${1:VariableName}',
        doc: 'Local variables are specific to a single function and are visible only inside that function. Consequently, a local variable may have the same name as a global variable and both will have separate contents. Separate functions may also safely use the same variable names.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/Functions.htm#Local',
        exp: [
            'local a',
            'Local b := 0',
        ],
    },
    LOOP: {
        keyRawName: 'Loop',
        body: 'Loop, ${1:number}',
        doc: 'Performs a series of commands repeatedly: either the specified number of times or until [break](https://www.autohotkey.com/docs/commands/Break.htm) is encountered.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/Loop.htm',
        exp: [
            'Loop, 3 {',
            '    MsgBox, % "Iteration number is " A_Index "!"  ; A_Index will be 1, 2, then 3',
            '    Sleep, 100',
            '}',
            '; ---',
            'iMax := 5',
            'Loop, % iMax + 2 {',
            '    MsgBox, % "Iteration number is " A_Index "!" ; 1 to 7',
            '    Sleep, 100',
            '}',
            '',
            ';--- loop 0',
            'Loop, iMax { ; Count cannot be an expression, use %',
            '    MsgBox, % "never loop "  A_Index ; loop 0',
            '    Sleep, 100',
            '}',
            '',
        ],
    },
    MENU: {
        keyRawName: 'Menu',
        body:
            'Menu, ${1:MenuName}, ${2|Add,Insert,Delete,DeleteAll,Rename,Check,Uncheck,ToggleCheck,Enable,Disable,ToggleEnable,Default,NoDefault,Standard,NoStandard,Icon,NoIcon,Tip,Show,Color,Click,MainWindow,NoMainWindow,UseErrorLevel|} [, ${3:Value1}, ${4:Value2}, ${5:Value3}, ${6:Value4}]',
        doc: [
            'Creates, deletes, modifies and displays menus and menu items. Changes the tray icon and its tooltip. Controls whether the main window of a [compiled script](https://www.autohotkey.com/docs/Scripts.htm#ahk2exe) can be opened.',
            '1. `SubCommand` -',
            '- [Add](https://www.autohotkey.com/docs/commands/Menu.htm#Add): Adds a menu item, updates one with a new submenu or label, or converts one from a normal item into a submenu (or vice versa).',
            '- [Insert](https://www.autohotkey.com/docs/commands/Menu.htm#Insert) [[v1.1.23+]](https://www.autohotkey.com/docs/AHKL_ChangeLog.htm#v1.1.23.00 "Applies to AutoHotkey v1.1.23 and later"): Inserts a new item before the specified menu item.',
            '- [Delete](https://www.autohotkey.com/docs/commands/Menu.htm#Delete): Deletes the specified menu item from the menu.',
            '- [DeleteAll](https://www.autohotkey.com/docs/commands/Menu.htm#DeleteAll): Deletes all custom menu items from the menu.',
            '- [Rename](https://www.autohotkey.com/docs/commands/Menu.htm#Rename): Renames the specified menu item.',
            '- [Check](https://www.autohotkey.com/docs/commands/Menu.htm#Check): Adds a visible checkmark in the menu next to the specified menu item.',
            '- [Uncheck](https://www.autohotkey.com/docs/commands/Menu.htm#Uncheck): Removes the checkmark from the specified menu item.',
            '- [ToggleCheck](https://www.autohotkey.com/docs/commands/Menu.htm#ToggleCheck): Adds a checkmark to the specified menu item; otherwise, removes it.',
            '- [Enable](https://www.autohotkey.com/docs/commands/Menu.htm#Enable): Enables the specified menu item if was previously disabled.',
            '- [Disable](https://www.autohotkey.com/docs/commands/Menu.htm#Disable): Disables the specified menu item.',
            '- [ToggleEnable](https://www.autohotkey.com/docs/commands/Menu.htm#ToggleEnable): Disables the specified menu item; otherwise, enables it.',
            '- [Default](https://www.autohotkey.com/docs/commands/Menu.htm#Default): Changes the menu\'s default item to be the specified menu item and makes its font bold.',
            '- [NoDefault](https://www.autohotkey.com/docs/commands/Menu.htm#NoDefault): Reverses setting a user-defined default menu item.',
            '- [Standard](https://www.autohotkey.com/docs/commands/Menu.htm#Standard): Inserts the standard menu items at the bottom of the menu.',
            '- [NoStandard](https://www.autohotkey.com/docs/commands/Menu.htm#NoStandard): Removes all standard menu items from the menu.',
            '- [Icon](https://www.autohotkey.com/docs/commands/Menu.htm#Icon): Changes the script\'s tray icon or [[in v1.0.90+]](https://www.autohotkey.com/docs/AHKL_ChangeLog.htm#L17 "Applies to:AutoHotkey_L Revision 17 and later AutoHotkey v1.0.90.00 and later") sets a icon for the specified menu item.',
            '- [NoIcon](https://www.autohotkey.com/docs/commands/Menu.htm#NoIcon): Removes the tray icon or [[in v1.0.90+]](https://www.autohotkey.com/docs/AHKL_ChangeLog.htm#L17 "Applies to:AutoHotkey_L Revision 17 and later AutoHotkey v1.0.90.00 and later") removes the icon from the specified menu item.',
            '- [Tip](https://www.autohotkey.com/docs/commands/Menu.htm#Tip): Changes the tray icon\'s tooltip.',
            '- [Show](https://www.autohotkey.com/docs/commands/Menu.htm#Show): Displays the specified menu.',
            '- [Color](https://www.autohotkey.com/docs/commands/Menu.htm#Color): Changes the background color of the menu.',
            '- [Click](https://www.autohotkey.com/docs/commands/Menu.htm#Click): Sets the number of clicks to activate the tray menu\'s default menu item.',
            '- [MainWindow](https://www.autohotkey.com/docs/commands/Menu.htm#MainWindow): Allows the main window of a script to be opened via the tray icon.',
            '- [NoMainWindow](https://www.autohotkey.com/docs/commands/Menu.htm#NoMainWindow): Prevents the main window from being opened via the tray icon.',
            '- [UseErrorLevel](https://www.autohotkey.com/docs/commands/Menu.htm#UseErrorLevel): Skips any warning dialogs and thread terminations whenever the Menu command generates an error.',
        ].join('\n'),
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/Menu.htm',
        exp: ['Menu, MenuName, SubCommand [, Value1, Value2, Value3, Value4]'],
    },
    MOUSECLICK: {
        keyRawName: 'MouseClick',
        body:
            'MouseClick [, ${1|Left,Right,Middle,WheelUp,WheelDown,WheelLeft,WheelRight|} , ${2:X}, ${3:Y}, ${4:ClickCount}, ${5:0-100}, ${6|D,U|}, ${7:R}]',
        doc: 'Clicks or holds down a mouse button, or turns the mouse wheel. NOTE: The [Click command](https://www.autohotkey.com/docs/commands/Click.htm) is generally more flexible and easier to use.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/MouseClick.htm',
        exp: ['MouseClick [, WhichButton , X, Y, ClickCount, Speed, DownOrUp, Relative]'],
    },
    MOUSECLICKDRAG: {
        keyRawName: 'MouseClickDrag',
        body:
            'MouseClickDrag, ${1|Left,Right,Middle,WheelUp,WheelDown|}, ${2:X1}, ${3:Y1}, ${4:X2}, ${5:Y2} [, ${6:0-100}, ${7:R}]',
        doc: 'Clicks and holds the specified mouse button, moves the mouse to the destination coordinates, then releases the button.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/MouseClickDrag.htm',
        exp: ['MouseClickDrag, WhichButton, X1, Y1, X2, Y2 [, Speed, Relative]'],
    },
    MOUSEGETPOS: {
        keyRawName: 'MouseGetPos',
        body:
            'MouseGetPos [, ${1:OutputVarX}, ${2:OutputVarY}, ${3:OutputVarWin}, ${4:OutputVarControl}, ${5|0,1,2,3|}]',
        doc: [
            'Retrieves the current position of the mouse cursor, and optionally which window and control it is hovering over.',
            '1. `OutputVarX`, `OutputVarY` - The names of the variables in which to store the X and Y coordinates. The retrieved coordinates are relative to the active window unless [CoordMode](https://www.autohotkey.com/docs/commands/CoordMode.htm) was used to change to screen coordinates.',
            '2. `OutputVarWin` -',
            '> - This optional parameter is the name of the variable in which to store the [unique ID number](https://www.autohotkey.com/docs/commands/WinGet.htm) of the window under the mouse cursor. If the window cannot be determined, this variable will be made blank.',
            '> - The window does not have to be active to be detected. Hidden windows cannot be detected.',
            '3. `OutputVarControl` -',
            '> - This optional parameter is the name of the variable in which to store the name (ClassNN) of the control under the mouse cursor. If the control cannot be determined, this variable will be made blank.',
            '> - The names of controls should always match those shown by the version of Window Spy distributed with [[v1.0.14+]](https://www.autohotkey.com/docs/ChangeLogHelp.htm#Older_Changes "Applies to AutoHotkey v1.0.14 and later") (but not necessarily older versions of Window Spy). The window under the mouse cursor does not have to be active for a control to be detected.',
            '4. `Flag` - If omitted or 0, the command uses the default method to determine _OutputVarControl_ and stores the control\'s ClassNN. To change this behavior, add up one or both of the following digits:',
            '> - **1**: Uses a simpler method to determine _OutputVarControl_. This method correctly retrieves the active/topmost child window of an Multiple Document Interface (MDI) application such as SysEdit or TextPad. However, it is less accurate for other purposes such as detecting controls inside a GroupBox control.',
            '> - **2** [[v1.0.43.06+]:](https://www.autohotkey.com/docs/ChangeLogHelp.htm#Older_Changes "Applies to AutoHotkey v1.0.43.06 and later") Stores the [control\'s HWND](https://www.autohotkey.com/docs/commands/ControlGet.htm#Hwnd) in _OutputVarControl_ rather than the control\'s ClassNN.',
            '> - For example, to put both options into effect, the _Flag_ parameter must be set to 3.',
        ].join('\n'),
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/MouseGetPos.htm',
        exp: [
            'MouseGetPos [, OutputVarX, OutputVarY, OutputVarWin, OutputVarControl, Flag]',
            '',
            ';Allows you to move the mouse cursor around to see the title of the window currently under the cursor.',
            '#Persistent',
            'SetTimer, fnWatchCursor, 100',
            'return',
            '',
            '',
            'fnWatchCursor() {',
            '    MouseGetPos, , , id, control',
            '    WinGetTitle, title, % "ahk_id " id',
            '    WinGetClass, class, % "ahk_id " id',
            '    ToolTip, % "ahk_id " id "`nahk_class " class "`n" title "`nControl: " control',
            '}',
        ],
    },
    MOUSEMOVE: {
        keyRawName: 'MouseMove',
        body: 'MouseMove, ${1:X}, ${2:Y} [, ${3:0-100}, ${4:R}]',
        doc: 'Moves the mouse cursor.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/MouseMove.htm',
        exp: [
            'MouseMove, X, Y [, Speed, Relative]',
            '',
            'MouseMove, 20 , 30, 50 , R',
        ],
    },
    MSGBOX: {
        keyRawName: 'MsgBox',
        body: 'MsgBox, % "${1:text}"',
        doc: [
            'Displays the specified text in a small window containing one or more buttons (such as Yes and No).',
            '',
            '- **Text** : type is string',
            '- **Options** : type is number, Indicates the type of message box and the possible button combinations. ',
            '- **Title** : type is string',
            '- **Timeout** : type is number of second, exp: `10` or `% mins*60`',
        ].join('\n'),
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/MsgBox.htm',
        exp: [
            'MsgBox, Text ;style1',
            'MsgBox, [Options, Title, Text, Timeout] ;style2',
            '',
            '; exp1 base of style1',
            'MsgBox, % "hello world! now is " A_Now',
            '',
            '',
            '; exp2 add `Buttons` -> `OK/Cancel` of 0x1 ',
            ';      and `Icon` -> `Icon Question` of 0x20',
            'MsgBox, % 0x1 + 0x20 ,% "exp2" ,% "Do you need help?"',
        ],
    },
    ONEXIT: {
        keyRawName: 'OnExit',
        body: 'OnExit [, ${1:Label}]',
        doc: 'Specifies a [callback function](https://www.autohotkey.com/docs/Functions.htm) or [subroutine](https://www.autohotkey.com/docs/commands/Gosub.htm) to run automatically when the script exits.',
        recommended: false,
        link: 'https://www.autohotkey.com/docs/commands/OnExit.htm#command',
        exp: [
            'OnExit , Label',
            'OnExit [, Label]',
            '',
            'OnExit(Func , AddRemove)',
        ],
        diag: EDiagCode.code812,
    },
    OUTPUTDEBUG: {
        keyRawName: 'OutputDebug',
        body: 'OutputDebug, % "${1:Text}',
        doc: 'Sends a string to the debugger (if any) for display.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/OutputDebug.htm',
        exp: [
            'OutputDebug, Text',
            '',
            'OutputDebug, % "[" A_Now "] Because the window [" TargetWindowTitle "] did not exist, the process was aborted."',
        ],
    },
    PAUSE: {
        keyRawName: 'Pause',
        body: 'Pause, [ ${1|On,Off,Toggle|}, ${2|0,1|} ]',
        doc: 'Pauses the script\'s [current thread](https://www.autohotkey.com/docs/misc/Threads.htm).',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/Pause.htm',
        exp: [
            'Pause , OnOffToggle, OperateOnUnderlyingThread',
            '; exp',
            'Pause::Pause  ; The Pause/Break key.',
            '#p::Pause  ; Win+P',
        ],
    },
    PIXELGETCOLOR: {
        keyRawName: 'PixelGetColor',
        body: 'PixelGetColor, ${1:OutputVar}, ${2:X}, ${3:Y} [, ${4|Alt,Slow,RGB|}]',
        doc: 'Retrieves the color of the pixel at the specified x,y coordinates.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/PixelGetColor.htm',
        exp: [
            'PixelGetColor, OutputVar, X, Y [, Mode]',
            '',
            '~F10::',
            'MouseGetPos, MouseX, MouseY',
            'PixelGetColor, color, % MouseX, % MouseY',
            'MsgBox % "The color at the current cursor position is " color',
            'return',
        ],
    },
    PIXELSEARCH: {
        keyRawName: 'PixelSearch',
        body:
            'PixelSearch, ${1:OutputVarX}, ${2:OutputVarY}, ${3:X1}, ${4:Y1}, ${5:X2}, ${6:Y2}, ${7:0x16_BGR_ColorID} [, ${8:0-255}, ${9:Fast RGB}]',
        doc: 'Searches a region of the screen for a pixel of the specified color.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/PixelSearch.htm',
        exp: ['PixelSearch, OutputVarX, OutputVarY, X1, Y1, X2, Y2, ColorID [, Variation, Mode]'],
    },
    POSTMESSAGE: {
        keyRawName: 'PostMessage',
        body:
            'PostMessage, ${1:Msg}, ${2:[wParam}, ${3:lParam}, ${4:Control}, ${5:WinTitle}, ${6:WinText}, ${7:ExcludeTitle}, ${8:ExcludeText]}',
        doc: 'Sends a message to a window or control (SendMessage additionally waits for acknowledgement).',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/PostMessage.htm',
        exp: [
            'PostMessage, Msg [, wParam, lParam, Control, WinTitle, WinText, ExcludeTitle, ExcludeText]',
            '',
            ';Switches the active window\'s keyboard layout/language to English',
            'PostMessage, 0x0050, 0, 0x4090409,, A  ; 0x0050 is WM_INPUTLANGCHANGEREQUEST.',
        ],
    },
    PROCESS: {
        keyRawName: 'Process',
        body: 'Process, ${1|Exist,Close,List,Priority,Wait,WaitClose|} [, % ${2:PID_Or_Name} , % "${3:Value}" ]',
        doc: [
            'Performs one of the following operations on a process: checks if it exists; changes its priority; closes it; waits for it to close.',
            '1. SubCommand',
            '- [Exist](https://www.autohotkey.com/docs/commands/Process.htm#Exist): Checks whether the specified process is present.',
            '- [Close](https://www.autohotkey.com/docs/commands/Process.htm#Close): Forces the first matching process to close.',
            '- [List](https://www.autohotkey.com/docs/commands/Process.htm#List): Not yet implemented.',
            '- [Priority](https://www.autohotkey.com/docs/commands/Process.htm#Priority): Changes the priority level of the first matching process.',
            '- [Wait](https://www.autohotkey.com/docs/commands/Process.htm#Wait): Waits for the specified process to exist.',
            '- [WaitClose](https://www.autohotkey.com/docs/commands/Process.htm#WaitClose): Waits for all matching processes to close.',
        ].join('\n'),
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/Process.htm',
        exp: [
            'Process, SubCommand [, PID_Or_Name, Value]',
            '',
            ';Launches Notepad, sets its priority to "High" and reports its current PID.',
            'Run, % "notepad.exe", , , NewPID',
            'Process, Priority, % NewPID, % "High"',
            'MsgBox % "The newly launched Notepad\'s PID is" NewPID',
        ],
    },
    PROGRESS: {
        keyRawName: 'Progress',
        body: 'Progress, Off',
        doc: 'Creates or updates a window containing a progress bar or an image.',
        recommended: false,
        diag: EDiagCode.code813,
        link: 'https://www.autohotkey.com/docs/commands/Progress.htm',
        exp: [
            'Progress, Off',
            'Progress, ProgressParam1 [, SubText, MainText, WinTitle, FontName]',
        ],
    },
    RANDOM: {
        keyRawName: 'Random',
        body: 'Random, ${1:OutputVar}, ${2:Min}, ${3:Max}',
        doc: 'Generates a pseudo-random number.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/Random.htm',
        exp: [
            'Random, OutputVar [, Min, Max]',
            'Random, , NewSeed',
            '',
            'Random, rand, 1, 10',
            'MsgBox % rand',
        ],
    },
    REGDELETE: {
        keyRawName: 'RegDelete',
        body: 'RegDelete, % "${1:HKLM|HKU|HKCU|HKCR|HKCC}" [, % "${2:ValueName}]"',
        doc: 'Deletes a subkey or value from the registry.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/RegDelete.htm',
        exp: ['RegDelete, KeyName [, ValueName]'],
    },
    REGREAD: {
        keyRawName: 'RegRead',
        body: 'RegRead, ${1:OutputVar}, % "${2:HKLM|HKU|HKCU|HKCR|HKCC}" [, % "${4:ValueName}" ]',
        doc: 'Reads a value from the registry.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/RegRead.htm',
        exp: ['RegRead, OutputVar, KeyName [, ValueName]'],
    },
    REGWRITE: {
        keyRawName: 'RegWrite',
        body:
            'RegWrite, ${1:REG_SZ|REG_EXPAND_SZ|REG_MULTI_SZ|REG_DWORD|REG_BINARY}, ${2:HKLM|HKU|HKCU|HKCR|HKCC} [, ${3:ValueName}, ${4:Value}]',
        doc: 'Writes a value to the registry.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/RegWrite.htm',
        exp: ['RegWrite, ValueType, KeyName [, ValueName, Value]'],
    },
    RELOAD: {
        keyRawName: 'Reload',
        body: 'Reload',
        doc: 'Replaces the currently running instance of the script with a new one.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/Reload.htm',
        exp: ['^!r::Reload  ; Ctrl+Alt+R'],
    },
    RETURN: {
        keyRawName: 'Return',
        body: 'Return',
        doc: 'Returns from a subroutine to which execution had previously jumped via [function-call](https://www.autohotkey.com/docs/Functions.htm), [Gosub](https://www.autohotkey.com/docs/commands/Gosub.htm), [Hotkey](https://www.autohotkey.com/docs/Hotkeys.htm) activation, [GroupActivate](https://www.autohotkey.com/docs/commands/GroupActivate.htm), or other means.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/Return.htm',
        exp: [
            '     Return 3',
            '     Return "literal string"',
            '     Return MyVar ',
            '     Return i + 1',
            '     Return true  ; Returns the number 1 to mean "true".',
            '     Return ItemCount < MaxItems  ; Returns a true or false value.',
            '     Return FindColor(TargetColor)',
        ],
    },
    RUN: {
        keyRawName: 'Run',
        body:
            'Run, % "${1:ReadMe.docx}" [, % "${2:D:\\document}", % "${3:Max Min Hide UseErrorLevel}", ${4:OutputVarPID}]',
        doc: 'Runs an external program.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/Run.htm',
        exp: [
            'Run, Target , WorkingDir, Options, OutputVarPID',
            '',
            'Run, % "ReadMe.docx", % A_WorkingDir "\\document", % "Max UseErrorLevel", PID',
            'if (ErrorLevel == "ERROR") {',
            '    MsgBox % "The document could not be launched."',
            '} else {',
            '    MsgBox, % "PID is " PID',
            '}',
        ],
    },
    RUNAS: {
        keyRawName: 'RunAs',
        body: 'RunAs, [${1:User}, ${2:Password}, ${3:Domain}]',
        doc: 'Specifies a set of user credentials to use for all subsequent uses of Run and RunWait.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/RunAs.htm',
        exp: [
            'RunAs , User, Password, Domain',
            '',
            ';---exp1-----',
            'InputBox, User, % "Title", % "input User", , , , , , , , % "Administrator"',
            'InputBox, MyPassword, % "Title", % "input Password", HIDE',
            'RunAs, % User, % MyPassword',
            'Run, RegEdit.exe',
            'RunAs ; Reset to normal behavior.',
        ],
    },
    RUNWAIT: {
        keyRawName: 'RunWait',
        body:
            'RunWait, % "${1:ReadMe.docx}" [, % "${2:D:\\document}", % "${3:Max Min Hide UseErrorLevel}", ${4:OutputVarPID}]',
        doc: 'Unlike Run, RunWait will wait until the program finishes before continuing.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/Run.htm',
        exp: [
            'RunWait, Target , WorkingDir, Options, OutputVarPID',
            '',
            'RunWait, % "ReadMe.docx", % A_WorkingDir "\\doc", % "Max UseErrorLevel", PID',
            'if (ErrorLevel == "ERROR") {',
            '    MsgBox % "The document could not be launched."',
            '} else {',
            '    MsgBox, % "PID is " PID',
            '}',
        ],
    },
    SEND: {
        keyRawName: 'Send',
        body: 'Send, ${1:Keys}',
        doc: 'Sends simulated keystrokes and mouse clicks to the active window.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/Send.htm',
        exp: [
            'Send Keys',
            'SendRaw Keys',
            'SendInput Keys',
            'SendPlay Keys',
            'SendEvent Keys',
        ],
    },
    SENDEVENT: {
        keyRawName: 'SendEvent',
        body: 'SendEvent, ${1:Keys}',
        doc: 'SendEvent sends keystrokes using the same method as the pre-1.0.43 Send command. The rate at which keystrokes are sent is determined by SetKeyDelay.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/Send.htm',
        exp: [
            'Send Keys',
            'SendRaw Keys',
            'SendInput Keys',
            'SendPlay Keys',
            'SendEvent Keys',
        ],
    },
    SENDINPUT: {
        keyRawName: 'SendInput',
        body: 'SendInput, ${1:Keys}',
        doc: 'SendInput and SendPlay use the same syntax as Send but are generally faster and more reliable. In addition, they buffer any physical keyboard or mouse activity during the send, which prevents the user\'s keystrokes from being interspersed with those being sent.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/Send.htm',
        exp: [
            'Send Keys',
            'SendRaw Keys',
            'SendInput Keys',
            'SendPlay Keys',
            'SendEvent Keys',
        ],
    },
    SENDLEVEL: {
        keyRawName: 'SendLevel',
        body: 'SendLevel, ${1:0-100}',
        doc: 'Controls which artificial keyboard and mouse events are ignored by hotkeys and hotstrings.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/SendLevel.htm',
        exp: [
            'SendLevel, Level',
        ],
    },
    SENDMESSAGE: {
        keyRawName: 'SendMessage',
        body:
            'SendMessage, ${1:Msg}, ${2:[wParam}, ${3:lParam}, ${4:Control}, ${5:WinTitle}, ${6:WinText}, ${7:ExcludeTitle}, ${8:ExcludeText}, ${9:Timeout]}',
        doc: 'Sends a message to a window or control (SendMessage additionally waits for acknowledgement).',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/PostMessage.htm',
        exp: [
            'SendMessage, Msg [, wParam, lParam, Control, WinTitle, WinText, ExcludeTitle, ExcludeText, Timeout]',
        ],
    },
    SENDMODE: {
        keyRawName: 'SendMode',
        body: 'SendMode, ${1|Event,Play,Input,InputThenPlay|}',
        doc: 'Makes Send synonymous with SendInput or SendPlay rather than the default (SendEvent). Also makes Click and MouseMove/Click/Drag use the specified method.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/SendMode.htm',
        exp: ['SendMode Mode'],
    },
    SENDPLAY: {
        keyRawName: 'SendPlay',
        body: 'SendPlay, ${1:Keys}',
        doc: 'SendInput and SendPlay use the same syntax as Send but are generally faster and more reliable. In addition, they buffer any physical keyboard or mouse activity during the send, which prevents the user\'s keystrokes from being interspersed with those being sent.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/Send.htm',
        exp: [
            'Send Keys',
            'SendRaw Keys',
            'SendInput Keys',
            'SendPlay Keys',
            'SendEvent Keys',
        ],
    },
    SENDRAW: {
        keyRawName: 'SendRaw',
        body: 'SendRaw, ${1:Keys}',
        doc: 'Similar to Send, except that all characters in Keys are interpreted and sent literally. See Raw mode for details.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/Send.htm',
        exp: [
            'Send Keys',
            'SendRaw Keys',
            'SendInput Keys',
            'SendPlay Keys',
            'SendEvent Keys',
        ],
    },
    SETBATCHLINES: {
        keyRawName: 'SetBatchLines',
        body: 'SetBatchLines, ${1:-1 | 20ms | LineCount}',
        doc: 'Determines how fast a script will run (affects CPU utilization).',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/SetBatchLines.htm',
        exp: [
            'SetBatchLines, 20ms ;Causes the script to sleep every 20 ms.',
            'SetBatchLines -1;never sleep (i.e. have the script run at maximum speed).',
            'SetBatchLines, 1000 ;Causes the script to sleep every 1000 lines.',
        ],
    },
    SETCAPSLOCKSTATE: {
        keyRawName: 'SetCapsLockState',
        body: 'SetCapsLockState, ${1|On,Off,AlwaysOn,AlwaysOff|}',
        doc: 'Sets the state of **CapsLock** / **NumLock** / **ScrollLock**. Can also force the key to stay on or off.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/SetNumScrollCapsLockState.htm',
        exp: [
            'SetCapsLockState [, State]',
            'SetNumLockState [, State]',
            'SetScrollLockState [, State]',
        ],
    },
    SETCONTROLDELAY: {
        keyRawName: 'SetControlDelay',
        body: 'SetControlDelay, ${1:Delay}',
        doc: 'Sets the delay that will occur after each control-modifying command.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/SetControlDelay.htm',
        exp: [
            'SetControlDelay, Delay',
            'SetControlDelay, -1 ; Use -1 for no delay at all',
            'SetControlDelay, 0 ; 0 for the smallest possible delay.',
            'SetControlDelay, 20 ; If unset, the default delay is 20.',
        ],
    },
    SETDEFAULTMOUSESPEED: {
        keyRawName: 'SetDefaultMouseSpeed',
        body: 'SetDefaultMouseSpeed, ${1:0-100}',
        doc: 'Sets the mouse speed that will be used if unspecified in [Click](https://www.autohotkey.com/docs/commands/Click.htm) and [MouseMove](https://www.autohotkey.com/docs/commands/MouseMove.htm)/[Click](https://www.autohotkey.com/docs/commands/MouseClick.htm)/[Drag](https://www.autohotkey.com/docs/commands/MouseClickDrag.htm).',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/SetDefaultMouseSpeed.htm',
        exp: ['SetDefaultMouseSpeed, Speed'],
    },
    SETENV: {
        keyRawName: 'SetEnv',
        body: 'SetEnv, Var, Value',
        doc: 'Assigns the specified value to a [variable](https://www.autohotkey.com/docs/Variables.htm).',
        recommended: false,
        link: 'https://www.autohotkey.com/docs/commands/SetEnv.htm',
        exp: [
            'SetEnv, Var, Value',
            'Var = Value',
            'Var := "Value"',
        ],
        diag: EDiagCode.code814,
    },
    SETFORMAT: {
        keyRawName: 'SetFormat',
        body: 'SetFormat, NumberType, Format',
        doc: 'Sets the format of integers and floating point numbers generated by math operations.',
        recommended: false,
        link: 'https://www.autohotkey.com/docs/commands/SetFormat.htm',
        exp: ['SetFormat, NumberType, Format'],
        diag: EDiagCode.code815,
    },
    SETKEYDELAY: {
        keyRawName: 'SetKeyDelay',
        body: 'SetKeyDelay, ${1:[ Delay}, ${2:PressDuration]}',
        doc: 'Sets the delay that will occur after each keystroke sent by [Send](https://www.autohotkey.com/docs/commands/Send.htm) or [ControlSend](https://www.autohotkey.com/docs/commands/ControlSend.htm).',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/SetKeyDelay.htm',
        exp: [
            'SetKeyDelay , Delay, PressDuration, Play',
        ],
    },
    SETMOUSEDELAY: {
        keyRawName: 'SetMouseDelay',
        body: 'SetMouseDelay, ${1:Delay_ms}, [ ${2:Play}]',
        doc: 'Sets the delay that will occur after each mouse movement or click.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/SetMouseDelay.htm',
        exp: [
            'SetMouseDelay, Delay [, Play]',
        ],
    },
    SETNUMLOCKSTATE: {
        keyRawName: 'SetNumLockState',
        body: 'SetNumLockState, ${1|On,Off,AlwaysOn,AlwaysOff|}',
        doc: 'Sets the state of **CapsLock** / **NumLock** / **ScrollLock**. Can also force the key to stay on or off.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/SetNumScrollCapsLockState.htm',
        exp: [
            'SetCapsLockState [, State]',
            'SetNumLockState [, State]',
            'SetScrollLockState [, State]',
        ],
    },
    SETREGVIEW: {
        keyRawName: 'SetRegView',
        body: 'SetRegView, ${1|32,64,Default|}',
        doc: 'Sets the registry view used by [RegRead](https://www.autohotkey.com/docs/commands/RegRead.htm), [RegWrite](https://www.autohotkey.com/docs/commands/RegWrite.htm), [RegDelete](https://www.autohotkey.com/docs/commands/RegDelete.htm) and [registry loops](https://www.autohotkey.com/docs/commands/LoopReg.htm), allowing them in a 32-bit script to access the 64-bit registry view and vice versa.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/SetRegView.htm',
        exp: [
            'SetRegView, RegView',
            'SetRegView 32',
            'SetRegView 64',
            'SetRegView Default',
        ],
    },
    SETSCROLLLOCKSTATE: {
        keyRawName: 'SetScrollLockState',
        body: 'SetScrollLockState, ${1|On,Off,AlwaysOn,AlwaysOff|}',
        doc: 'Sets the state of **CapsLock** / **NumLock** / **ScrollLock**. Can also force the key to stay on or off.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/SetNumScrollCapsLockState.htm',
        exp: [
            'SetCapsLockState [, State]',
            'SetNumLockState [, State]',
            'SetScrollLockState [, State]',
        ],
    },
    SETSTORECAPSLOCKMODE: {
        keyRawName: 'SetStoreCapsLockMode',
        body: 'SetStoreCapsLockMode, ${1:|On,Off|}',
        doc: 'Whether to restore the state of CapsLock after a [Send](https://www.autohotkey.com/docs/commands/Send.htm).',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/SetStoreCapslockMode.htm',
        exp: [
            'SetStoreCapsLockMode, OnOff',
            'SetStoreCapsLockMode, Off',
            'SetStoreCapsLockMode, On',
        ],
    },
    SETTIMER: {
        keyRawName: 'SetTimer',
        body: 'SetTimer [, ${1:Label_or_fnName}, ${2|Period,On,Off|}]',
        doc: 'Causes a subroutine to be launched automatically and repeatedly at a specified time interval.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/SetTimer.htm',
        exp: [
            'SetTimer , Label_or_fnName, PeriodOnOffDelete, Priority',
            '',
            ';exp1 of param is 0 functions',
            '~F10:: SetTimer, fn0, -250',
            'fn0() {',
            '    MsgBox % "hi~ this " . A_ThisFunc',
            '}',
            '',
            ';exp2 of param > 0 functions',
            '~F11:: fn_exp()',
            'fn_exp() {',
            '    Random, OutputVar , 0, 100',
            '    fn := func("fn2").Bind(1000, OutputVar) ; https://www.autohotkey.com/docs/objects/Functor.htm#BoundFunc',
            '    SetTimer,% fn, -100',
            '}',
            '',
            'fn2(param1, param2) {',
            '    MsgBox % A_ThisFunc " : " (param1 + param2)',
            '}',
        ],
    },
    SETTITLEMATCHMODE: {
        keyRawName: 'SetTitleMatchMode',
        body: 'SetTitleMatchMode, ${1:Fast|Slow|RegEx|1|2|3}',
        doc: 'Sets the matching behavior of the WinTitle parameter in commands such as [WinWait](https://www.autohotkey.com/docs/commands/WinWait.htm).',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/SetTitleMatchMode.htm',
        exp: [
            'SetTitleMatchMode, MatchMode',
            'SetTitleMatchMode, Speed',
        ],
    },
    SETWINDELAY: {
        keyRawName: 'SetWinDelay',
        body: 'SetWinDelay, ${1:Delay_ms}',
        doc: 'Sets the delay that will occur after each windowing command, such as [WinActivate](https://www.autohotkey.com/docs/commands/WinActivate.htm).',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/SetWinDelay.htm',
        exp: [
            'SetWinDelay, Delay',
            '; Use -1 for no delay at all and 0 for the smallest possible delay. If unset, the default delay is 100.',
        ],
    },
    SETWORKINGDIR: {
        keyRawName: 'SetWorkingDir',
        body: 'SetWorkingDir, % "${1:DirName}"',
        doc: 'Changes the script\'s current working directory.\n - `DirName` - The name of the new working directory, which is assumed to be a subfolder of the current [%A_WorkingDir%](https://www.autohotkey.com/docs/Variables.htm#WorkingDir) if an absolute path isn\'t specified.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/SetWorkingDir.htm',
        exp: [
            'SetWorkingDir, DirName',
            '',
            'SetWorkingDir, % "D:\\My Folder\\Temp"',
        ],
    },
    SHUTDOWN: {
        keyRawName: 'Shutdown',
        body: 'Shutdown, ${1:Flag}',
        doc: [
            'Shuts down, restarts, or logs off the system.',
            '1. `Flag` - A combination (sum) of the following numbers:',
            '',
            '- 0 = Logoff',
            '- 1 = Shutdown',
            '- 2 = Reboot',
            '- 4 = Force',
            '- 8 = Power down',
            '',
            'Add the required values together. For example, to shutdown and power down the flag would be 9 (shutdown + power down = 1 + 8 = 9). Alternatively, an [expression](https://www.autohotkey.com/docs/Variables.htm#Expressions) such as 1+8 can be specified.',
            '',
            'The "Force" value (4) forces all open applications to close. It should only be used in an emergency because it may cause any open applications to lose data.',
            '',
            'The "Power down" value (8) shuts down the system and turns off the power.',
        ].join('\n'),
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/Shutdown.htm',
        exp: [
            'Shutdown, Flag',
            '',
            'Shutdown, 1 ; Shutdown',
        ],
    },
    SLEEP: {
        keyRawName: 'Sleep',
        body: 'Sleep, ${1:Delay_ms}',
        doc: 'Waits the specified amount of time before continuing.\n `Delay` - The amount of time to pause (in milliseconds) between 0 and 2147483647 (24 days), which can be an [expression](https://www.autohotkey.com/docs/Variables.htm#Expressions).',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/Sleep.htm',
        exp: [
            'Sleep, Delay ; Delay 0 - 2147483647 (24 days)',
            '',
            'Sleep, 1000 ; 1000ms is 1 sec',
            '',
            ';Waits 30 minutes before continuing execution.',
            'Sleep 30 * 60 * 1000 ; Sleep for 30 minutes.',
        ],
    },
    SORT: {
        keyRawName: 'Sort',
        body: 'Sort, ${1:VarName} [, ${2:Options}]',
        doc: 'Arranges a variable\'s contents in alphabetical, numerical, or random order (optionally removing duplicates).',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/Sort.htm',
        exp: [
            'Sort, VarName [, Options]',
            '',
            'MyVar := "5,3,7,9,1,13,999,-4"',
            'rawStr := MyVar',
            'Sort MyVar, % "N D," ; Sort numerically, use comma as delimiter.',
            'MsgBox % rawStr ;              5,3,7,9,1,13,999,-4',
            'MsgBox % MyVar ; The result is -4,1,3,5,7,9,13,999',
        ],
    },
    SOUNDBEEP: {
        keyRawName: 'SoundBeep',
        body: 'SoundBeep [, ${1:Frequency_37_to_32767}, ${2:Duration_ms}]',
        doc: 'Emits a tone from the PC speaker.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/SoundBeep.htm',
        exp: [
            'SoundBeep [, Frequency, Duration]',
            '',
            'SoundBeep ; Plays the default pitch and duration.',
            'SoundBeep, 750, 500 ;Plays a higher pitch for half a second.',
        ],
    },
    SOUNDGET: {
        keyRawName: 'SoundGet',
        body:
            'SoundGet, ${1:OutputVar} [, ${2|MASTER,SPEAKERS,DIGITAL,LINE,MICROPHONE,SYNTH,CD,TELEPHONE,PCSPEAKER,WAVE,AUX,ANALOG,HEADPHONES,N/A|}, ${3:ControlType}, ${4:DeviceNumber}]',
        doc: 'Retrieves various settings from a sound device (master mute, master volume, etc.)',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/SoundGet.htm',
        exp: [
            'SoundGet, OutputVar [, ComponentType, ControlType, DeviceNumber]',
            '',
            'SoundGet, master_volume',
            'MsgBox, % "Master volume is " master_volume " percent."',
        ],
    },
    SOUNDGETWAVEVOLUME: {
        keyRawName: 'SoundGetWaveVolume',
        body: 'SoundGetWaveVolume, ${1:OutputVar} [, ${2:DeviceNumber}]',
        doc: 'Retrieves the wave output volume for a sound device.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/SoundGet.htm',
        exp: [
            'SoundGetWaveVolume, OutputVar [, DeviceNumber]',
            '',
            'SoundGetWaveVolume, OutputVar',
            'MsgBox, % "The current wave output volume level is " OutputVar',
        ],
    },
    SOUNDPLAY: {
        keyRawName: 'SoundPlay',
        body: 'SoundPlay, ${1:Filename} [, ${2:wait}]',
        doc: 'Plays a sound, video, or other supported file type.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/SoundPlay.htm',
        exp: [
            'SoundPlay, Filename [, Wait]',
        ],
    },
    SOUNDSET: {
        keyRawName: 'SoundSet',
        body: 'SoundSet, ${1:NewSetting} [, ${2:ComponentType}, ${3:ControlType}, ${4:DeviceNumber}]',
        doc: 'Changes various settings of a sound device (master mute, master volume, etc.)',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/SoundSet.htm',
        exp: [
            'SoundSet, NewSetting [, ComponentType, ControlType, DeviceNumber]',
            '',
            'SoundSet, 50 ;Sets the master volume to 50%.',
            'SoundSet, 10 ;Sets the master volume to 10%.',
            'SoundSet, +10 ;Increases the master volume by 10%.',
            'SoundSet -10;Decreases the master volume by 10%.',
        ],
    },
    SOUNDSETWAVEVOLUME: {
        // FIXME: add more doc
        keyRawName: 'SoundSetWaveVolume',
        body: 'SoundSetWaveVolume, ${1:Percent}, [ ${2:DeviceNumber]}',
        doc: 'Changes the wave output volume for a sound device.',
    },
    SPLASHIMAGE: {
        keyRawName: 'SplashImage',
        body: 'SplashImage, Off',
        doc: 'Creates or updates a window containing a progress bar or an image.',
        recommended: false,
        diag: EDiagCode.code813,
        link: 'https://www.autohotkey.com/docs/commands/Progress.htm',
        exp: [
            'SplashImage, Off',
            'SplashImage [, ImageFile, Options, SubText, MainText, WinTitle, FontName]',
        ],
    },
    SPLASHTEXTOFF: {
        keyRawName: 'SplashTextOff',
        body: 'SplashTextOff',
        doc: 'Creates or removes a customizable text popup window.',
        recommended: false,
        diag: EDiagCode.code816,
        link: 'https://www.autohotkey.com/docs/commands/SplashTextOn.htm',
        exp: ['SplashTextOff'],
    },
    SPLASHTEXTON: {
        keyRawName: 'SplashTextOn',
        body: 'SplashTextOn [, ${1:Width}, ${2:Height}, ${3:Title}, ${4:Text}]',
        doc: 'Creates or removes a customizable text popup window.',
        recommended: false,
        diag: EDiagCode.code816,
        link: 'https://www.autohotkey.com/docs/commands/SplashTextOn.htm',
        exp: ['SplashTextOn , Width, Height, Title, Text'],
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
            '    Static LoggedLines := 0',
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
        diag: EDiagCode.code700,
    },
    STRINGLEFT: {
        keyRawName: 'StringLeft',
        body: 'StringLeft, OutputVar, InputVar, Count',
        doc: 'Retrieves a number of characters from the left or right-hand side of a string.\n\n**Deprecated:** These commands are not recommended for use in new scripts. Use the [SubStr](https://www.autohotkey.com/docs/commands/SubStr.htm) function instead.',
        recommended: false,
        link: 'https://www.autohotkey.com/docs/commands/StringLeft.htm',
        exp: ['StringLeft, OutputVar, InputVar, Count'],
        diag: EDiagCode.code700,
    },
    STRINGLEN: {
        keyRawName: 'StringLen',
        body: 'StringLen, OutputVar, InputVar',
        doc: 'Retrieves the count of how many characters are in a string.\n\n**Deprecated:** This command is not recommended for use in new scripts. Use the [StrLen](https://www.autohotkey.com/docs/commands/StrLen.htm) function instead.',
        recommended: false,
        link: 'https://www.autohotkey.com/docs/commands/StringLen.htm',
        exp: ['StringLen, OutputVar, InputVar'],
        diag: EDiagCode.code700,
    },
    STRINGLOWER: {
        keyRawName: 'StringLower',
        body: 'StringLower, ${1:OutputVar}, ${2:InputVar} [, T]',
        doc: 'Converts a string to lowercase or uppercase.',
        recommended: false,
        link: 'https://www.autohotkey.com/docs/commands/StringLower.htm',
        exp: ['StringLower, OutputVar, InputVar , T'],
        diag: EDiagCode.code700,
    },
    STRINGMID: {
        keyRawName: 'StringMid',
        body: 'StringMid, OutputVar, InputVar, StartChar [, Count, L]',
        doc: 'Retrieves one or more characters from the specified position in a string.\n\n**Deprecated:** This command is not recommended for use in new scripts. Use the [SubStr](https://www.autohotkey.com/docs/commands/SubStr.htm) function instead.',
        recommended: false,
        link: 'https://www.autohotkey.com/docs/commands/StringMid.htm',
        exp: ['StringMid, OutputVar, InputVar, StartChar , Count, L'],
        diag: EDiagCode.code700,
    },
    STRINGREPLACE: {
        keyRawName: 'StringReplace',
        body: 'StringReplace, OutputVar, InputVar, SearchText , ReplaceText, ReplaceAll',
        doc: 'Replaces the specified substring with a new string.\n\n**Deprecated:** This command is not recommended for use in new scripts. Use the [StrReplace](https://www.autohotkey.com/docs/commands/StrReplace.htm) function instead.',
        recommended: false,
        link: 'https://www.autohotkey.com/docs/commands/StringReplace.htm',
        exp: ['StringReplace, OutputVar, InputVar, SearchText , ReplaceText, ReplaceAll'],
        diag: EDiagCode.code700,
    },
    STRINGRIGHT: {
        keyRawName: 'StringRight',
        body: 'StringRight, OutputVar, InputVar, Count',
        doc: 'Retrieves a number of characters from the left or right-hand side of a string.\n\n**Deprecated:** These commands are not recommended for use in new scripts. Use the [SubStr](https://www.autohotkey.com/docs/commands/SubStr.htm) function instead.',
        recommended: false,
        link: 'https://www.autohotkey.com/docs/commands/StringLeft.htm',
        exp: ['StringRight, OutputVar, InputVar, Count'],
        diag: EDiagCode.code700,
    },
    STRINGSPLIT: {
        keyRawName: 'StringSplit',
        body: 'StringSplit, ${1:OutputArray}, ${2:InputVar} [, ${3:Delimiters}, ${4:OmitChars}]',
        doc: 'Retrieves a number of characters from the left or right-hand side of a string.\n\n**Deprecated:** These commands are not recommended for use in new scripts. Use the [SubStr](https://www.autohotkey.com/docs/commands/SubStr.htm) function instead.',
        recommended: false,
        link: 'https://www.autohotkey.com/docs/commands/StringLeft.htm',
        exp: ['StringSplit, OutputArray, InputVar [, Delimiters, OmitChars]'],
        diag: EDiagCode.code700,
    },
    STRINGTRIMLEFT: {
        keyRawName: 'StringTrimLeft',
        body: 'StringTrimLeft, OutputVar, InputVar, Count',
        doc: 'Removes a number of characters from the left or right-hand side of a string.\n\n**Deprecated:** These commands are not recommended for use in new scripts. Use the [SubStr](https://www.autohotkey.com/docs/commands/SubStr.htm) function instead.',
        recommended: false,
        link: 'https://www.autohotkey.com/docs/commands/StringTrimLeft.htm',
        exp: ['StringTrimLeft, OutputVar, InputVar, Count'],
        diag: EDiagCode.code700,
    },
    STRINGTRIMRIGHT: {
        keyRawName: 'StringTrimRight',
        body: 'StringTrimRight, OutputVar, InputVar, Count',
        doc: 'Removes a number of characters from the left or right-hand side of a string.\n\n**Deprecated:** These commands are not recommended for use in new scripts. Use the [SubStr](https://www.autohotkey.com/docs/commands/SubStr.htm) function instead.',
        recommended: false,
        link: 'https://www.autohotkey.com/docs/commands/StringTrimLeft.htm',
        exp: ['StringTrimRight, OutputVar, InputVar, Count'],
        diag: EDiagCode.code700,
    },
    STRINGUPPER: {
        keyRawName: 'StringUpper',
        body: 'StringUpper, OutputVar, InputVar [, T]',
        doc: 'Converts a string to lowercase or uppercase.\n\nCommand -> func https://www.autohotkey.com/docs/Language.htm#commands-vs-functions',
        recommended: false,
        link: 'https://www.autohotkey.com/docs/commands/StringLower.htm',
        exp: ['StringUpper, OutputVar, InputVar , T'],
        diag: EDiagCode.code700,
    },
    SUSPEND: {
        keyRawName: 'Suspend',
        body: 'Suspend, ${1:[ On|Off|Toggle|Permit]}',
        doc: 'Disables or enables all or selected hotkeys and hotstrings.',
    },
    SWITCH: {
        keyRawName: 'Switch',
        body: [
            'Switch ${1:key} {',
            'Case ${2:val1}:',
            '    $0',
            'Case ${3:val2}, ${4:val3}:',
            '    ',
            'Default :',
            '    ',
            '}',
        ].join('\n'),
        doc: 'Executes one case from a list of mutually exclusive candidates.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/Switch.htm',
        exp: [
            'Switch UserInput {',
            '    Case "btw":   MsgBox % "by the way"',
            '    Case "otoh":  MsgBox % "on the other hand"',
            '    Case "fl":    MsgBox % "Florida" Send, {backspace 3}Florida',
            '    Case "ca":    MsgBox % "California"  Send, {backspace 3}California',
            '    Case "ahk":   Run, % "https://www.autohotkey.com"',
            '    Default :     MsgBox % "default"',
            '}',
        ],
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
    THROW: {
        keyRawName: 'Throw',
        body: 'Throw, Exception("${1:Message}" , ${2|"What",-1|}, "${3:Extra}")',
        doc: 'Signals the occurrence of an error. This signal can be caught by a [try](https://www.autohotkey.com/docs/commands/Try.htm)\\-[catch](https://www.autohotkey.com/docs/commands/Catch.htm) statement.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/Throw.htm',
        exp: [
            'Throw 3',
            'Throw "literal string"',
            'Throw MyVar',
            'Throw i + 1',
            'Throw { what: "Custom error", file: A_LineFile, line: A_LineNumber } ; Throws an object',
        ],
    },
    TOOLTIP: {
        keyRawName: 'ToolTip',
        body: 'ToolTip, ${1:[ Text}, ${2:X}, ${3:Y}, ${4:1_to_20]}',
        doc: 'Creates an always-on-top window anywhere on the screen.',
    },
    TRANSFORM: {
        keyRawName: 'Transform',
        body: 'Transform, OutputVar, SubCommand, Value1 [, Value2]',
        doc: 'Performs miscellaneous math functions, bitwise operations, and tasks such as ASCII/Unicode conversion.\n\n**Deprecated:** This command is not recommended for use in new scripts. For details on what you can use instead, see the sub-command sections below.',
        recommended: false,
        link: 'https://www.autohotkey.com/docs/commands/Transform.htm',
        exp: ['Transform, OutputVar, SubCommand, Value1 [, Value2]'],
        diag: EDiagCode.code824,
    },
    TRAYTIP: {
        keyRawName: 'TrayTip',
        body: 'TrayTip, ${1:[ Title}, ${2:Text}, ${3:Seconds}, ${4:Options]}',
        doc: 'Creates a balloon message window near the tray icon. On Windows 10, a toast notification may be shown instead.',
    },
    TRY: {
        keyRawName: 'Try',
        body: 'Try',
        doc: 'Guards one or more statements (commands or expressions) against runtime errors and exceptions thrown by the [throw](https://www.autohotkey.com/docs/commands/Throw.htm) command.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/Try.htm',
        exp: [
            'Try {',
            '    ...',
            '} Catch e {',
            '    ...',
            '} Finally {',
            '    ...',
            '}',
        ],
    },
    UNTIL: {
        keyRawName: 'Until',
        body: 'Until $0',
        doc: 'Applies a condition to the continuation of a Loop or For-loop.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/Until.htm',
        exp: [
            'Loop {',
            '    ...',
            '} Until Expression',
        ],
    },
    URLDOWNLOADTOFILE: {
        keyRawName: 'UrlDownloadToFile',
        body: 'UrlDownloadToFile, ${1:URL}, ${2:Filename}',
        doc: 'Downloads a file from the Internet.',
    },
    WHILE: {
        keyRawName: 'While',
        body: 'While ($0) {\n    \n}',
        doc: 'Performs a series of commands repeatedly until the specified [expression](https://www.autohotkey.com/docs/Variables.htm#Expressions) evaluates to false.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/While.htm',
        exp: [
            ';exp1 As the user drags the left mouse button, a tooltip displays the size of the region inside the drag-area.',
            '',
            'CoordMode, Mouse, Screen',
            '',
            '~LButton::fn_lb1()',
            '',
            'fn_lb1(){',
            '    MouseGetPos, begin_x, begin_y',
            '    While GetKeyState("LButton")',
            '    {',
            '        MouseGetPos, x, y',
            '        ToolTip, % begin_x ", " begin_y "`n" Abs(begin_x-x) " x " Abs(begin_y-y)',
            '        Sleep, 10',
            '    }',
            '    ToolTip',
            '}',
        ],
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
