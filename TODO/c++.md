```c++
class Line
{
private:
 ResultType EvaluateCondition();
```

```c++
////////////////////////////////////////////////////////////////////////////////////////
// Do some special preparsing of the MsgBox command, since it is so frequently used and
// it is also the source of problem areas going from AutoIt2 to 3 and also due to the
// new numeric parameter at the end.  Whenever possible, we want to avoid the need for
// the user to have to escape commas that are intended to be literal.
///////////////////////////////////////////////////////////////////////////////////////
int max_params_override = 0; // Set default.
if (aActionType == ACT_MSGBOX)
```

```c++
case ACT_MSGBOX:
{
  int result;
  HWND dialog_owner = THREAD_DIALOG_OWNER; // Resolve macro only once to reduce code size.
  //...
}
```

```c++
// Parse the parameter string into a list of separate params.
```

```c++
int FindNextDelimiter(LPCTSTR aBuf, TCHAR aDelimiter, int aStartIndex, LPCTSTR aLiteralMap)
```
