obj := {a:999, " b":"1000"}
Var := ">=======<"
style1 := 0

; EXAMPLE #1:
style1 =
( c ; use c-flag
" Var"  %Var% ; OK
%Var% ; OK
;`%` variable name contains an illegal character
% Var% ; beacuse ahk can't find var name like " Var"  <---space
%obj.a% ; beacuse ahk can't find var name like "obj.a"  <---.
%obj[" b"]% ; beacuse ahk can't find var name like "obj[" b"]"  <---.
    )

MsgBox, % style1





