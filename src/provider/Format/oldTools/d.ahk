Search0()
Search(node, find, return="") {
    found := this.xml.SelectNodes(node "[contains(.,'" RegExReplace(find, "&", "')][contains(.,'") "')]")
    while, ff := found.item(a_index-1)
        if (ff.text=find) {
            if return
                return ff.SelectSingleNode("../" return)
            return ff.SelectSingleNode("..")
        }
}
;refer Studio.ahk Class XML Search()
Search0(i, return := "") {
    while, (ff := foo())
        if (ff.text=find) {
            if return
                while, (i := foo2(i))
                    if (ff.text=find) {
                        if return
                            MsgBox, % "text" ff.SelectSingleNode("../" return)
                        MsgBox, % "A"
                        MsgBox, % "B"
                        MsgBox, % "C"
                        MsgBox, % "D"
                    }
            MsgBox, % "A"
            MsgBox, % "B"
            MsgBox, % "C"
            MsgBox, % "D"
        }


    MsgBox, % "c"

}

InputBox, OutputVar 

if (OutputVar == "") ; x86 machine code
    OutputVar := "A"
    + "B"
    + "C"

; MsgBox, % "OutputVar is " OutputVar



; If (PropType = 5) || (PropType = 10)
; {
;     NumType := PropType = 5 ? "UInt" : "Int"
;     PropyLen := PropLen // 8
;     Loop %PropyLen%
;         PropVal .= (A_Index > 1 ? " " : "") . NumGet(PropAddr + 0, (A_Index - 1) << 2, NumType)
;             .  "/" . NumGet(PropAddr + 4, (A_Index - 1) << 2, NumType)

;     Return True
; }

; OutputVar := "A"
;     + "B"
;     + "C"

; finish_work := 0
; error_mod := 1
; bmp_primitive := 2
; err_code := A_LineFile
;     . "`n"
;     . "`n" A_ThisFunc
;     . "`n 丟錯finish_work參數了--324--67"
;     . "`n finish_work is : " finish_work
;     . "`n error_mod : " error_mod
;     . "`n bmp : " bmp_primitive

; MsgBox, % "is " err_code