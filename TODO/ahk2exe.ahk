;@Ahk2Exe-IgnoreBegin
;@Ahk2Exe-IgnoreEnd
;@Ahk2Exe-Keep
;@Ahk2Exe-Let U_version = %A_PriorLine~U)^(.+"){1}(.+)".*$~$2%
;@Ahk2Exe-Let U_company = %A_PriorLine~U)^(.+"){3}(.+)".*$~$2%
;@Ahk2Exe-AddResource FileName , ResourceName
;@Ahk2Exe-AddResource Icon1.ico, 160  ; Replaces 'H on blue'
;@Ahk2Exe-AddResource Icon2.ico, 206  ; Replaces 'S on green'
;@Ahk2Exe-AddResource Icon3.ico, 207  ; Replaces 'H on red'
;@Ahk2Exe-AddResource Icon4.ico, 208  ; Replaces 'S on red'
;@Ahk2Exe-AddResource MyScript1.ahk, #2
;@Ahk2Exe-AddResource MyScript2.ahk, MYRESOURCE
;@Ahk2Exe-Bin  [Path\]Name , [Exe_path\][Name], Codepage ; Deprecated
;@Ahk2Exe-Base [Path\]Name , [Exe_path\][Name], Codepage ; [v1.1.33.10+]
;@Ahk2Exe-ConsoleApp
;@Ahk2Exe-Cont Text
;@Ahk2Exe-Debug Text
;@Ahk2Exe-ExeName [Path\][Name]
;@Ahk2Exe-Obey U_bits, = %A_PtrSize% * 8
;@Ahk2Exe-Obey U_type, = "%A_IsUnicode%" ? "Unicode" : "ANSI"
;@Ahk2Exe-ExeName %A_ScriptName~\.[^\.]+$%_%U_type%_%U_bits%
;@Ahk2Exe-Let Name = Value , Name = Value, ...
;@Ahk2Exe-Nop Text
;@Ahk2Exe-Obey U_V, = "%A_PriorLine~U)^(.+")(.*)".*$~$2%" ? "SetVersion" : "Nop"
;@Ahk2Exe-%U_V%        %A_AhkVersion%%A_PriorLine~U)^(.+")(.*)".*$~$2%
;@Ahk2Exe-Obey Name, CmdOrExp , Extra
;@Ahk2Exe-Obey U_date, FormatTime U_date`, R D2 T2
;@Ahk2Exe-Obey U_type, = "%A_IsUnicode%" ? "Unicode" : "ANSI"
;@Ahk2Exe-Obey U_bits, U_bits := %A_PtrSize% * 8
;@Ahk2Exe-PostExec Program [parameters] , When, WorkingDir, Hidden, IgnoreErrors
;@Ahk2Exe-Obey U_au, = "%A_IsUnicode%" ? 2 : 1    ; Script ANSI or Unicode?
;@Ahk2Exe-PostExec "BinMod.exe" "%A_WorkFileName%"
;@Ahk2Exe-Cont  "%U_au%2.>AUTOHOTKEY SCRIPT<. DATA              "
;@Ahk2Exe-PostExec "BinMod.exe" "%A_WorkFileName%"
;@Ahk2Exe-Cont  "11.UPX." "1.UPX!.", 2
;@Ahk2Exe-PostExec "MPRESS.exe" "%A_WorkFileName%" -q -x, 0,, 1
;@Ahk2Exe-PostExec "UPX.exe" "%A_WorkFileName%"
;@Ahk2Exe-Cont  -q --all-methods --compress-icons=0, 0,, 1
;@Ahk2Exe-ResourceID Name
;@Ahk2Exe-SetMainIcon IcoFile
;@Ahk2Exe-SetProp Value
;@Ahk2Exe-Set Prop, Value
;@Ahk2Exe-UpdateManifest RequireAdmin , Name, Version, UIAccess
;@Ahk2Exe-UseResourceLang LangCode


;@Ahk2Exe-Base           AutoHotkeyU32.exe      ; Commented out; advisory only
;@Ahk2Exe-SetName         Ahk2Exe
;@Ahk2Exe-SetDescription  AutoHotkey Script Compiler
;@Ahk2Exe-SetCopyright    Copyright (c) since 2004
;@Ahk2Exe-SetOrigFilename Ahk2Exe.ahk
;@Ahk2Exe-SetMainIcon     Ahk2Exe.ico
;@Ahk2Exe-Obey U_V, = "%A_PriorLine~U)^(.+")(.*)".*$~$2%" ? "SetVersion" : "Nop"
;@Ahk2Exe-%U_V%        %A_AhkVersion%%A_PriorLine~U)^(.+")(.*)".*$~$2%
;@Ahk2Exe-IgnoreBegin
;@Ahk2Exe-IgnoreEnd

/*@Ahk2Exe-Keep
MsgBox This message appears only in the compiled script
*/
MsgBox % "This message appears in both the compiled and uncompiled script"


;@Ahk2Exe-SetVersion     2020.08.23     ; Edition: 23 August 2020
;@Ahk2Exe-SetCopyright   TAC109
;@Ahk2Exe-SetCompanyName TAC109
;@Ahk2Exe-SetProductName BinMod
;@Ahk2Exe-SetDescription Binary file editor - see Ahk2Exe's PostExec directive
;@Ahk2Exe-Obey U_au, = "%A_IsUnicode%" ? 2 : 1 ; .Bin file ANSI or Unicode?
;@Ahk2Exe-PostExec "BinMod.exe" "%A_WorkFileName%"
;@Ahk2Exe-Cont  "%U_au%2.>AUTOHOTKEY SCRIPT<. DATA              "
;@Ahk2Exe-Cont  "1%U_au%2.>AUTOHOTKEY SCRIPT<. DATA              "
;@Ahk2Exe-Cont  "%U_au%.AutoHotkeyGUI.My_String"
;@Ahk2Exe-Cont  /ScriptGuard2     ; See bit.ly/ScriptGuard for more details.
;@Ahk2Exe-Cont  /SetDateTime     ; Set current local date and time, or
;@Ahk2Exe-Cont  /SetUTC          ; Set current UTC date and time
;@Ahk2Exe-PostExec "BinMod.exe" "%A_WorkFileName%" "11.UPX." "1.UPX!.", 2

;@Ahk2Exe-SetCompanyName
;@Ahk2Exe-SetCopyright
;@Ahk2Exe-SetDescription
;@Ahk2Exe-SetFileVersion
;@Ahk2Exe-SetInternalName
;@Ahk2Exe-SetLanguage
;@Ahk2Exe-SetLegalTrademarks
;@Ahk2Exe-SetName
;@Ahk2Exe-SetOrigFilename
;@Ahk2Exe-SetProductName
;@Ahk2Exe-SetProductVersion
;@Ahk2Exe-SetVersion

if StrStartsWith(tline, Options.comm "@Ahk2Exe-IgnoreEnd")

if !StrStartsWith(tline, "@Ahk2Exe-")

if !StrStartsWith(tline, "/*@Ahk2Exe-Keep")

if RegExMatch(A_LoopReadLine,"i)^\s*\S{1,2}@Ahk2Exe-(?:Bin|Base) (.*$)")

if (Cont=1&&RegExMatch(A_LoopReadLine,"i)^\s*\S{1,2}@Ahk2Exe-Cont (.*$)",o))
    && RegExMatch(A_LoopReadLine,"i)^\s*\S{1,2}@Ahk2Exe-(?:Bin|Base) (.*$)",o)

MsgBox, % "https://www.autohotkey.com/docs/misc/Ahk2ExeDirectives.htm#Nop"
MsgBox, % "TODO"
;TODO Ahk2Exe