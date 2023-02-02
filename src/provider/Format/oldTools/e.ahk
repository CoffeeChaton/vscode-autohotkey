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

IfNotExist, %AhkScript%
    if !iOption
        Util_Error((IsFirstScript ? "Script" : "#include") " file cannot be opened.", 0x32, """" AhkScript """")
    else return
MsgBox, % "A"
MsgBox, % "D"

InputBox, OutputVar 

if (OutputVar == "") ; x86 machine code
    OutputVar := "A"
    + "B"
    + "C"


